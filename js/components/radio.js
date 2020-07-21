Fliplet.FormBuilder.field('radio', {
  name: 'Radios (single-select)',
  category: 'Multiple options',
  props: {
    options: {
      type: Array,
      default: [
        {
          label: 'Option 1'
        },
        {
          label: 'Option 2'
        }
      ]
    },
    readonly: {
      type: Boolean,
      default: false
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
  methods: {
    clickHandler: function (option) {
      if (this.readonly) {
        return;
      }

      this.value = option.id || option.label;
      this.updateValue();
    }
  }
});
