Fliplet.FormBuilder.field('select', {
  name: 'Dropdown (single-select)',
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
    source: {
      type: String
    },
    placeholder: {
      type: String,
      default: '-- Select one'
    },
    valueLabel: {
      type: String,
      default: ''
    }
  },
  methods: {
    changeHandler: function(value) {
      var selectedOption = _.filter(this.options, ['id', value]);
      
      if (selectedOption.length) {
        this.valueLabel = selectedOption[0].label || value;
      } else {
        this.valueLabel = value;
      }

      this.updateValue();
    }
  },
  mounted: function() {
    var $vm = this;

    if ($vm.source === 'dataSources') {
      Fliplet.DataSources.get().then(function(dataSources) {
        $vm.options = dataSources;
      })
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
  }
});
