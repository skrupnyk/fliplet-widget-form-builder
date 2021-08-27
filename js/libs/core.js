/* eslint-disable eqeqeq */
Fliplet.FormBuilder = (function() {
  var components = {};
  var eventHub = new Vue();

  var DATE_FORMAT = 'YYYY-MM-DD';

  Vue.use(window.vuelidate.default);

  var templates = Fliplet.Widget.Templates;

  function name(component) {
    return 'fl' + component.charAt(0).toUpperCase() + component.slice(1);
  }

  return {
    on: function(eventName, fn) {
      eventHub.$on(eventName, fn);
    },
    off: function(eventName, fn) {
      eventHub.$off(eventName, fn);
    },
    emit: function(eventName, data) {
      eventHub.$emit(eventName, data);
    },
    components: function() {
      return components;
    },
    categories: function() {
      var categories = [];

      _.forIn(components, function(component, componentName) {
        var categoryName = component.category || 'Generic';
        var category = _.find(categories, {
          name: categoryName
        });
        var isExisting = !!category;

        if (!isExisting) {
          category = {
            name: categoryName,
            fields: []
          };
        }

        category.fields.push(componentName);

        if (!isExisting) {
          categories.push(category);
        }
      });

      return categories;
    },
    field: function(componentName, component) {
      if (!component.name) {
        throw new Error('The component name is required');
      }

      var template = templates['templates.components.' + componentName];

      if (!template) {
        throw new Error('A template for the ' + componentName + ' component has not been found');
      }

      if (!component.methods) {
        component.methods = {};
      }

      // Define method to emit the new input value on change
      if (!component.methods.updateValue) {
        component.methods.updateValue = function() {
          this.highlightError();
          this.$emit('_input', this.name, this.value);
        };
      }

      /**
       * This function is responsible personalizating a default value when we need to get it from user personalized data
       * For example: set default value to the user email
       *
       * @param {Object} data - an object with source and key properties
       *  Where source - is defining the value  source type
       *  And key - tell us what key in the source we should take as a value
       *
       * @return {void} - this method does not return anything but updates the value directly on the target field.
       */
      component.methods.setValueFromDefaultSettings = function(data) {
        var result;
        var $vm = this;

        switch (data.source) {
          case 'profile':
            if (!data.key) {
              throw new Error('A key is required to fetch data from the user\'s profile');
            }

            result = Fliplet.User.getCachedSession()
              .then(function(session) {
                if (session && session.entries) {
                  if (session.entries.dataSource) {
                    return session.entries.dataSource.data[data.key];
                  }

                  if (session.entries.saml2) {
                    return session.entries.saml2.data[data.key];
                  }

                  if (session.entries.flipletLogin) {
                    return session.entries.flipletLogin.data[data.key];
                  }
                }

                return Fliplet.Profile.get(data.key);
              });
            break;
          case 'query':
            if (!data.key) {
              throw new Error('A key is required to fetch data from the navigation query parameters');
            }

            result = Fliplet.Navigate.query[data.key];
            break;
          case 'appStorage':
            if (!data.key) {
              throw new Error('A key is required to fetch data from app storage');
            }

            result = Fliplet.App.Storage.get(data.key);
            break;
          default:
            result = this.value;
        }

        if (!(result instanceof Promise)) {
          result = Promise.resolve(result);
        }

        return result.then(function(value) {
          if (typeof value === 'undefined') {
            value = '';
          }

          if (componentName === 'flCheckbox') {
            value = Array.isArray(value) ? value : [value];
          }

          var isValueChanged = value !== $vm.value;

          $vm.value = value;

          if (isValueChanged) {
            $vm.updateValue();
          }
        });
      };

      // Define method to highlight Error on blur form field
      component.methods.highlightError = function() {
        var $vm = this;

        if ($vm.$v && $vm.$v.value) {
          $vm.$v.$touch();

          if ($vm.$v.value.$error) {
            $($vm.$el).toggleClass('has-error', $vm.$attrs.enabled == true);
          } else {
            $($vm.$el).removeClass('has-error');
          }
        }
      };

      component.methods.onInput = _.debounce(function($event) {
        this.$emit('_input', this.name, $event.target.value);
      }, 200);

      component.methods.browserSupport = function(browserType) {
        switch (browserType) {
          case 'IE11':
            return navigator.userAgent.indexOf('Trident/') !== -1;
          case 'Safari':
            return navigator.userAgent.indexOf('Safari') !== -1;
          default:
            return false;
        }
      };

      // Define method to trigger the form reset from a children
      if (!component.methods.resetForm) {
        component.methods.resetForm = function() {
          this.$emit('_reset');
        };
      }

      if (!component.computed) {
        component.computed = {};
      }

      component.computed._isFormField = function() {
        return this.showLabel || this.showLabel === undefined;
      };

      component.computed._showField = function() {
        if (this.readonly) {
          if (['flTime', 'flDate'].includes(this._componentName)) {
            return true;
          }

          if (Array.isArray(this.value)) {
            return !!this.value.length;
          }

          return !!this.value;
        }

        if (this.isHidden) {
          return false;
        }

        return true;
      };

      component.computed._selectedLabel = function() {
        if (!this.options) {
          return this.value;
        }

        var vm = this;

        var option = _.find(this.options, function(opt) {
          return opt.id == vm.value;
        });

        return option ? (option.label || option.id) : this.value;
      };

      if (!component.mounted) {
        component.mounted = function() {
          if (this.defaultValueSource !== 'default') {
            this.setValueFromDefaultSettings({ source: this.defaultValueSource, key: this.defaultValueKey });
          }
        };
      }

      var fieldContext = $('html').hasClass('context-build') ? 'field' : 'interface';

      component.template = templates['templates.components.' + fieldContext]({
        template: template()
      });

      componentName = name(componentName);
      components[componentName] = component;

      // All fields have these properties
      component.props = _.assign({
        name: {
          type: String,
          required: true
        },
        label: {
          type: String,
          default: component.name || 'Label text'
        },
        _componentName: {
          type: String,
          default: componentName
        },
        showLabel: {
          type: Boolean,
          default: true
        },
        value: {
          type: String,
          default: ''
        },
        required: {
          type: Boolean,
          default: false
        },
        isHidden: {
          type: Boolean,
          default: false
        },
        canHide: {
          type: Boolean,
          default: true
        },
        readonly: {
          type: Boolean,
          default: false
        },
        defaultValueSource: {
          type: String,
          default: 'default'
        },
        defaultValueKey: {
          type: String,
          default: ''
        }
      }, component.props);

      Vue.component(componentName, component);
    },
    fields: function() {
      return Object.keys(components);
    },
    configuration: function(componentName, component) {
      if (!component) {
        component = {};
      }

      var template = templates['templates.configurations.' + componentName];

      componentName = name(componentName);

      // Extend from base component
      component = _.assign({
        computed: {},
        methods: {},
        props: {}
      }, _.pick(components[componentName], [
        'props', 'computed'
      ]), component);

      // On submit event
      component.methods._onSubmit = function() {
        if (!this.defaultValueKey && this._componentsWithPersonalization.includes(this._componentName) && this.defaultValueSource !== 'default') {
          return 'Key field is required';
        }

        if (this._fieldNameError || this._fieldLabelError) {
          return;
        }

        var $vm = this;
        var data = {};

        Object.keys($vm.$props).forEach(function(prop) {
          if (prop.indexOf('_') !== 0) {
            data[prop] = $vm[prop];
          }
        });

        eventHub.$emit('field-settings-changed', data);
      };

      if (!component.methods.onSubmit) {
        component.methods.onSubmit = component.methods._onSubmit;
      }

      component.props._fields = {
        type: Array
      };

      component.props._componentName = {
        type: String,
        default: componentName
      };

      component.props._componentsWithPersonalization = {
        type: Array,
        default: ['flInput', 'flCheckbox', 'flRadio', 'flEmail', 'flNumber', 'flTelephone', 'flUrl', 'flTextarea', 'flWysiwyg', 'flSelect']
      };

      component.props._componentsWithDescription = {
        type: Array,
        default: ['flInput', 'flCheckbox', 'flRadio', 'flEmail', 'flNumber', 'flTelephone', 'flUrl', 'flTextarea', 'flWysiwyg', 'flSelect', 'flDate', 'flTime', 'flStarRating', 'flSignature', 'flImage', 'flFile']
      };

      component.props._readOnlyComponents = {
        type: Array,
        default: ['flInput', 'flCheckbox', 'flRadio', 'flEmail', 'flNumber', 'flTelephone', 'flUrl', 'flTextarea', 'flWysiwyg', 'flSelect', 'flDate', 'flTime', 'flStarRating', 'flSignature', 'flImage', 'flFile']
      };

      component.props._idx = {
        type: Number,
        default: -1
      };

      component.props._isEditingName = {
        type: Boolean,
        default: false
      };

      component.props._showNameField = {
        type: Boolean,
        default: false
      };

      component.computed._fieldNameError = function() {
        if (!this.name) {
          return 'Please provide a Field Name';
        }

        var existing = _.findIndex(this._fields, {
          name: this.name
        });

        if (existing > -1 && existing !== this._idx) {
          return this.name + ' is taken. Please use another Field Name.';
        }

        return '';
      };

      component.computed._fieldLabelError = function() {
        if (this.type === 'flButtons') {
          if ((this.showSubmit && !this.submitValue) || (this.showClear && !this.clearValue)) {
            return 'Please provide a Field Label';
          }

          return '';
        }

        if (!this.label) {
          return 'Please provide a Field Label';
        }

        var existing = _.findIndex(this._fields, {
          name: this.name
        });

        if (existing > -1 && existing !== this._idx) {
          return this.name + ' is taken. Please use another Field Label.';
        }

        return '';
      };

      component.methods.browserSupport = function(browserType) {
        switch (browserType) {
          case 'IE11':
            return navigator.userAgent.indexOf('Trident/') !== -1;
          case 'Safari':
            return navigator.userAgent.indexOf('Safari') !== -1;
          default:
            return false;
        }
      };

      if (!component.mounted) {
        component.mounted = function() {
          this._showNameField = this.name !== this.label;
          this.initTooltip();
          this.initDatepicker();

          if (this.browserSupport('IE11') || this.browserSupport('safari')) {
            this.initTimePicker();
          }
        };
      }

      component.methods._disableAutomatch = function() {
        this._showNameField = true;
        this.initTooltip();
      };

      if (!component.methods.disableAutomatch) {
        component.methods.disableAutomatch = component.methods._disableAutomatch;
      }

      component.methods._enableAutomatch = function() {
        this._showNameField = false;
        this.name = this.label;
        this.initTooltip();
      };

      if (!component.methods.enableAutomatch) {
        component.methods.enableAutomatch = component.methods._enableAutomatch;
      }

      component.methods._matchFields = function() {
        this.name = this._showNameField ? this.name : this.label;
      };

      if (!component.methods.matchFields) {
        component.methods.matchFields = component.methods._matchFields;
      }

      component.methods._initTooltip = function() {
        var $vm = this;

        $vm.$nextTick(function() {
          var tooltip = $vm.$refs.tooltip;

          if (tooltip) {
            $(tooltip).tooltip();
          }
        });
      };

      component.methods._initDatepicker = function() {
        var $vm = this;

        $vm.$nextTick(function() {
          var $el = $(this.$el).find('input.date-picker').datepicker({
            format: 'yyyy-mm-dd',
            todayHighlight: true,
            autoclose: true
          }).on('changeDate', function(e) {
            var value = moment(e.date).format(DATE_FORMAT);

            $vm.value = value;
          });

          $el.datepicker('setDate', this.value || new Date());
        });
      };

      if (!component.methods.initDatepicker) {
        component.methods.initDatepicker = component.methods._initDatepicker;
      }

      component.methods._initTimePicker = function() {
        var $vm = this;

        $vm.$nextTick(function() {
          var $el = $($vm.$refs.timepicker).timeEntry({
            show24Hour: true
          }).on('change', function(event) {
            $vm.value = event.target.value;
          });

          $el.timeEntry('setTime', this.value);
        });
      };

      if (!component.methods.initTimePicker) {
        component.methods.initTimePicker = component.methods._initTimePicker;
      }

      if (!component.methods.initTooltip) {
        component.methods.initTooltip = component.methods._initTooltip;
      }

      component.methods._openFilePicker = function() {
        var $vm = this;

        var config = {
          selectedFiles: {},
          selectMultiple: false,
          type: 'folder'
        };

        window.currentProvider = Fliplet.Widget.open('com.fliplet.file-picker', {
          data: config,
          onEvent: function(e, data) {
            switch (e) {
              case 'widget-set-info':
                Fliplet.Studio.emit('widget-save-label-reset');
                Fliplet.Studio.emit('widget-save-label-update', {
                  text: 'Select'
                });
                Fliplet.Widget.toggleSaveButton(!!data.length);

                var msg = data.length ? data.length + ' folder selected' : 'no selected folders';

                Fliplet.Widget.info(msg);
                break;
              default:
                // nothing
            }
          }
        });

        window.currentProvider.then(function(result) {
          Fliplet.Widget.info('');
          Fliplet.Studio.emit('widget-save-label-update');
          $vm.mediaFolderData = result.data[0];
          $vm.mediaFolderId = result.data[0].id;
          $vm.mediaFolderNavStack = result.data[0].navStackRef || {};
          window.currentProvider = null;
        });
      };

      if (!component.methods.openFilePicker) {
        component.methods.openFilePicker = component.methods._openFilePicker;
      }

      component.methods._openFileManager = function() {
        var $vm = this;

        Fliplet.Studio.emit('overlay', {
          name: 'widget',
          options: {
            size: 'large',
            package: 'com.fliplet.file-manager',
            title: 'File Manager',
            classes: 'data-source-overlay',
            data: {
              context: 'overlay',
              appId: Fliplet.Env.get('appId'),
              folder: $vm.mediaFolderData,
              navStack: $vm.mediaFolderNavStack
            }
          }
        });
      };

      if (!component.methods.openFileManager) {
        component.methods.openFileManager = component.methods._openFileManager;
      }

      var hasOptions = component.props.options && Array.isArray(component.props.options.type());

      // If options is an array, automatically deal with options
      if (hasOptions) {
        component.computed._options = function generateOptions() {
          return this.options.map(function(option) {
            if (option.id && option.label && option.id != option.label) {
              return option.label + ' <' + option.id + '>';
            }

            return option.label || option.id;
          }).join('\r\n');
        };

        component.methods._setOptions = function setOptions(str) {
          this.options = _.compact(str.split(/\r?\n/).map(function(rawOption) {
            rawOption = rawOption.trim();

            var regex = /<.*>$/g;
            var match = rawOption.match(regex);
            var option = {};

            if (match) {
              option.label = rawOption.replace(regex, '').trim();

              var value = match[0].substring(1, match[0].length - 1).trim();

              option.id = value || option.label;
            } else {
              option.label = rawOption;
              option.id = rawOption;
            }

            return option;
          }));
        };
      }

      component.template = templates['templates.configurations.form']({
        template: template && template() || '',
        hasOptions: hasOptions
      });

      Vue.component(componentName + 'Config', component);
    }
  };
})();
