// Paste as Plain Text plugin
if (tinymce && tinymce.majorVersion === '5') {
  tinymce.PluginManager.add('pasteplaintext', function(editor, url) {
    var openDialog = function() {
      return editor.windowManager.open({
        title: 'Paste as Plain Text',
        body: {
          type: 'panel',
          items: [
            {
              type: 'htmlpanel',
              html: '<p>Please paste inside the following box using the keyboard (<strong style="font-weight:600">Cmd/Ctrl + V</strong>) and hit <strong style="font-weight:600">Paste</strong>.<br></p><style>.tox .tox-form__group--stretched { height: 240px; }</style>'
            },
            {
              type: 'textarea',
              name: 'text'
            }
          ]
        },
        buttons: [
          {
            type: 'cancel',
            text: 'Cancel'
          },
          {
            type: 'submit',
            text: 'Paste',
            primary: true
          }
        ],
        onSubmit: function(api) {
          var data = api.getData();

          /* Insert content when the window form is submitted */
          editor.insertContent(data.text.replace(/(?:\r\n|\r|\n)/g, '<br>'));
          api.close();
        }
      });
    };

    /* Add a button that opens a window */
    editor.ui.registry.addButton('pasteplaintext', {
      icon: 'paste-text',
      tooltip: 'Paste as Plain Text',
      onAction: function() {
        openDialog();
      }
    });

    /* Return the metadata for the plugin */
    return {
      getMetadata: function() {
        return  {
          name: 'Paste as Plain Text'
        };
      }
    };
  });
}

Fliplet.FormBuilder.field('wysiwyg', {
  name: 'Rich text',
  category: 'Text inputs',
  props: {
    placeholder: {
      type: String
    },
    rows: {
      type: Number,
      default: 5
    },
    description: {
      type: String
    }
  },
  validations: function() {
    var rules = {
      value: {}
    };

    if (this.required) {
      rules.value.required = window.validators.required;
    }

    return rules;
  },
  computed: {
    isInterface: function() {
      return Fliplet.Env.get('interface');
    }
  },
  watch: {
    value: function(val) {
      // This happens when the value is updated programmatically via the FormBuilder field().val() method
      val = _.isNumber(val) ? _.toString(val) : val;

      if (this.editor && val !== this.editor.getContent()) {
        return this.editor.setContent(val || '', { format: 'raw' });
      }

      if (val !== this.value) {
        this.value = val;
      }
    }
  },
  methods: {
    onReset: function() {
      if (this.editor) {
        try {
          return this.editor.setContent(this.value);
        } catch (e) {
          // nothing
        }
      }
    },
    placeholderLabel: function() {
      var placeholderText = this.editor.getElement().getAttribute('placeholder') || this.editor.settings.placeholder;
      var contentAreaContainer = this.editor.getContentAreaContainer();
      var defaultStyles = {
        style: {
          position: 'absolute',
          top: '17px',
          left: '8px',
          color: '#888',
          lineHeight: '19px',
          padding: tinymce.DOM.getStyle(contentAreaContainer, 'padding', true),
          width: '98%',
          overflow: 'hidden',
          'white-space': 'pre-wrap',
          'font-weight': 'normal',
          'font-size': '16px'
        }
      };
      var placeholderAttrs = this.editor.settings.placeholderAttrs || defaultStyles;

      tinymce.DOM.setStyle(contentAreaContainer, 'position', 'relative');

      // Create label element in the TinyMCE editor
      this.labelElement = tinymce.DOM.add(contentAreaContainer, this.editor.settings.placeholderTag || 'p', placeholderAttrs, placeholderText);
    },
    hidePlaceholderLabel: function() {
      tinymce.DOM.setStyle(this.labelElement, 'display', 'none');
    },
    showPlaceholderLabel: function() {
      tinymce.DOM.setStyle(this.labelElement, 'display', '');
    },
    onPlaceholderFocus: function() {
      if (!this.editor.settings.readonly) {
        this.hidePlaceholderLabel();
      }

      this.editor.execCommand('mceFocus', false);
    },
    onPlaceholderBlur: function() {
      if (!this.editor.getContent()) {
        this.showPlaceholderLabel();
      } else {
        this.hidePlaceholderLabel();
      }
    },
    addPlaceholder: function() {
      // Init placeholder
      this.placeholderLabel();
      this.onPlaceholderBlur();

      // Add placeholder listeners
      tinymce.DOM.bind(this.labelElement, 'click', this.onPlaceholderFocus);
      this.editor.on('focus', this.onPlaceholderFocus);
      this.editor.on('blur', this.onPlaceholderBlur);
      this.editor.on('change', this.onPlaceholderBlur);
      this.editor.on('setContent', this.onPlaceholderBlur);
      this.editor.on('keydown', this.hidePlaceholderLabel);
    },
    addBulletedListShortcutsWindows: function() {
      var $vm = this;

      // For Windows
      this.editor.addShortcut('ctrl+shift+8', 'UnorderedList', function() {
        $vm.editor.execCommand('InsertUnorderedList');
      });
    },
    addBulletedListShortcutsMac: function(event) {
      if (event.metaKey && event.code === 'BracketLeft') {
        event.preventDefault();
        this.editor.execCommand('InsertUnorderedList');
      }
    }
  },
  mounted: function() {
    var $vm = this;
    var lineHeight = 40;

    var config = {
      target: this.$refs.textarea,
      readonly: this.readonly,
      height: lineHeight * this.rows,
      menubar: false,
      formats: {
        removeformat: [
          // Remove block containers
          {
            selector: 'div,main,article,aside,header,footer',
            remove: 'all',
            split: false,
            expand: false,
            block_expand: true,
            deep: true
          },
          // Remove inline containers
          {
            selector: 'b,strong,em,i,font,u,strike,sub,sup,dfn,code,samp,kbd,var,cite,mark,q,del,ins,span',
            remove: 'all',
            split: true,
            expand: false,
            deep: true
          },
          // Remove attributes
          {
            selector: '*',
            attributes: ['style', 'class', 'id'],
            split: false,
            expand: false,
            deep: true
          }
        ]
      },
      plugins: [
        'advlist autolink lists link searchreplace print directionality',
        'table paste pasteplaintext'
      ],
      statusbar: false,
      toolbar: this.readonly
        ? false
        : ['bold italic underline | alignleft aligncenter alignright alignjustify',
          'bullist numlist outdent indent | ltr rtl',
          'link | pasteplaintext removeformat | formatselect'].join(' | '),
      mobile: {
        menubar: false,
        toolbar_mode: 'sliding'
      },
      // Prevent URLs from being altered
      // https://stackoverflow.com/questions/3796942
      relative_urls: false,
      remove_script_host: false,
      convert_urls: true,
      branding: false,
      setup: function(editor) {
        $vm.editor = editor;

        editor.on('init', function() {
          $vm.addPlaceholder();
          $vm.addBulletedListShortcutsWindows();

          if ($vm.defaultValueSource !== 'default') {
            $vm.setValueFromDefaultSettings({ source: $vm.defaultValueSource, key: $vm.defaultValueKey });
          }

          // initialise value if it was set prior to initialisation
          if ($vm.value) {
            editor.setContent($vm.value, { format: 'raw' });
          }

          if ($vm.isInterface) {
            // iFrames don't work with the form builder's Sortable feature
            // Instead, the iFrame is swapped with a <div></div> of the same dimensions
            var $el = $($vm.$refs.ghost);

            $el.width(editor.iframeElement.style.width).height(editor.iframeElement.style.height);
            $(editor.iframeElement).replaceWith($el);
          }
        });

        editor.on('keydown', $vm.addBulletedListShortcutsMac);

        editor.on('focus', function() {
          var $el = $(editor.iframeElement);

          $el.parent().parent().addClass('focus-outline');
        });

        editor.on('blur', function() {
          var $el = $(editor.iframeElement);

          $el.parent().parent().removeClass('focus-outline');
        });

        editor.on('change', function() {
          $vm.value = editor.getContent();

          $vm.updateValue();
        });
      }
    };

    // Allow custom code to register hooks before this runs
    Fliplet().then(function() {
      Fliplet.Hooks.run('beforeRichFieldInitialize', {
        field: this,
        config: config
      }).then(function() {
        tinymce.init(config);
      });
    });

    Fliplet.FormBuilder.on('reset', this.onReset);
  },
  destroyed: function() {
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }

    Fliplet.FormBuilder.off('reset', this.onReset);
  }
});
