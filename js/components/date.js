var DATE_FORMAT = 'YYYY-MM-DD';

Fliplet.FormBuilder.field('date', {
  name: 'Date picker',
  category: 'Text inputs',
  props: {
    placeholder: {
      type: String
    },
    description: {
      type: String
    },
    autofill: {
      type: String,
      default: 'always'
    },
    defaultSource: {
      type: String,
      default: 'load'
    },
    empty: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      datePicker: null,
      isInputFocused: false
    };
  },
  validations: function() {
    var rules = {
      value: {}
    };

    return rules;
  },
  computed: {
    isWeb: function() {
      return Fliplet.Env.get('platform') === 'web';
    },
    isApplyCurrentDateField: function() {
      return this.autofill === 'always' || this.autofill === 'default';
    }
  },
  mounted: function() {
    var $vm = this;

    if (Fliplet.Env.get('platform') === 'web') {
      this.datePicker = $(this.$el).find('input.date-picker').datepicker({
        format: 'yyyy-mm-dd',
        todayHighlight: true,
        autoclose: true
      }).on('changeDate', function(e) {
        if (e.date) {
          $vm.value = moment(e.date).format(DATE_FORMAT);
        }

        $vm.updateValue();
      });

      if (this.autofill !== 'empty') {
        this.datePicker.datepicker('setDate', new Date(this.value) || new Date());
      }
    }

    if (this.defaultValueSource !== 'default') {
      this.setValueFromDefaultSettings({ source: this.defaultValueSource, key: this.defaultValueKey });
    }

    if (!this.value || this.autofill === 'always') {
      // HTML5 date field wants YYYY-MM-DD format
      this.value = moment().format(DATE_FORMAT);
      this.empty = false;
    }

    if (this.autofill === 'empty') {
      this.value = '';
      this.datePicker.datepicker('setDate', '');

      return;
    }

    this.$emit('_input', this.name, this.value);
    $vm.$v.$reset();
  },
  watch: {
    value: function(val) {
      if (!val && this.autofill !== 'empty') {
        this.updateValue(moment().format(DATE_FORMAT));
      }

      this.highlightError();
      this.$emit('_input', this.name, val);
    }
  }
});
