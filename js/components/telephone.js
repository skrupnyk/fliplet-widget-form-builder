Fliplet.FormBuilder.field('telephone', {
  name: 'Telephone input',
  category: 'Text inputs',
  props: {
    placeholder: {
      type: String
    }
  },
  validations: function () {
    var rules = {
      value: {
        phone: window.validators.helpers.regex('', /^[0-9;,.()\-+\n*#]+$/)
      }
    };

    if (this.required) {
      rules.value.required = window.validators.required;
    }
    return rules;
  }
});
