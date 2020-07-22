Fliplet.FormBuilder.field('title', {
  name: 'Title',
  category: 'Formatting',
  submit: false,
  props: {
    label: undefined,
    showLabel: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: 'Title'
    },
    isPossibleToHide: {
      type: Boolean,
      default: false
    }
  }
});
