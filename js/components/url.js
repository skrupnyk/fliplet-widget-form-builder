Fliplet.FormBuilder.field('url', {
  name: 'URL input',
  category: 'Text inputs',
  props: {
    placeholder: {
      type: String
    }
  },
  validations: function () {
    var rules = {
      value: {
        url: window.validators.helpers.regex('', /(?:^|[^@\.\w-])([a-z0-9]+:\/\/)?(\w(?!ailto:)\w+:\w+@)?([\w.-]+\.[a-z]{2,4})(:[0-9]+)?(\/.*)?(?=$|[^@\.\w-])/i)
      }
    };

    if (this.required) {
      rules.value.required = window.validators.required;
    }
    return rules;
  }
});
