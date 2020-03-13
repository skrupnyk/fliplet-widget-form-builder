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
    }
  },
  validations: function () {
    var rules = {
      value: {}
    };

    if (this.required) {
      rules.value.required = window.validators.required;
    }
    return rules;
  },
  computed: {
    isInterface: function () {
      return Fliplet.Env.get('interface');
    }
  },
  watch: {
    value: function (val) {
      // This happens when the value is updated programmatically via the FormBuilder field().val() method
      val = _.isNumber(val) ? _.toString(val) : val;
      if (this.editor && val !== this.editor.getContent()) {
        return this.editor.setContent(val || '', { format : 'raw' });
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
          this.editor.setContent('');
        } catch (e) {}
      }

      this.value = '';
    },
    addPlaceHolder: function() {
      var editor = this.editor;
      var element = editor.settings.inline ? editor.getElement() : editor.contentAreaContainer;

      // set placeholder attribute on the element if its set from settings
      element.classList.add('plugin-placeholder');

      if (element.getAttribute('placeholder') === null) {
        element.setAttribute('placeholder', editor.settings.placeholder || editor.getElement().getAttribute('placeholder'));
      }

      // add the styles to head for the placegolder
      if (document.getElementById('plugin-placeholder') === null) {
        this.addPlaceholderStyles();
      }

      // add extra listener since click on the :before element doesnt focus the editor
      element.addEventListener('click', function() {
        editor.execCommand('mceFocus', false, element);
      });
    },
    addPlaceholderStyles: function() {
      var head = document.head || document.getElementsByTagName('head')[0];
      var css = document.createElement('style');
      css.id = 'plugin-placeholder';
      css.type = 'text/css';
      css.innerHTML = ' \
        .plugin-placeholder:before { \
          top: "5px"; \
          display: none; \
          position: absolute; \
          content: attr(placeholder); \
          -webkit-margin-before: 1em; \
          -webkit-margin-after: 1em; \
          -webkit-margin-start: 0px; \
          -webkit-margin-end: 0px; \
          color: #888; \
        } \
        .mce-panel.plugin-placeholder:before{ \
          margin-left: 8px; \
        } \
        .plugin-placeholder iframe { z-index: -1; } \
        .plugin-placeholder.empty:before{ \
          display: block; \
        }';
      head.appendChild(css);
    }
  },
  mounted: function() {
    var $vm = this;
    var lineHeight = 40;

    tinymce.init({
      target: this.$refs.textarea,
      theme: 'modern',
      mobile: {
        theme: 'mobile',
        plugins: [ 'autosave', 'lists', 'autolink' ],
        toolbar: [ 'bold', 'italic', 'underline', 'bullist', 'numlist', 'removeformat' ]
      },
      plugins: [
        'advlist autolink lists link directionality',
        'autoresize fullscreen code paste'
      ].join(' '),
      toolbar: [
        'bold italic underline',
        'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
        'ltr rtl | link | removeformat code fullscreen'
      ].join(' | '),
      image_advtab: true,
      menubar: false,
      statusbar: false,
      inline: false,
      resize: false,
      autoresize_bottom_margin: 0,
      autoresize_max_height: lineHeight * this.rows,
      autoresize_min_height: lineHeight * this.rows,
      autofocus: false,
      branding: false,
      setup: function (editor) {
        $vm.editor = editor;

        editor.on('init', function () {
          $vm.addPlaceHolder();

          // initialise value if it was set prior to initialisation
          if ($vm.value) {
            editor.setContent($vm.value, { format : 'raw' });
          }

          if ($vm.isInterface) {
            // iFrames don't work with the form builder's Sortable feature
            // Instead, the iFrame is swapped with a <div></div> of the same dimensions
            var $el = $($vm.$refs.ghost);
            $el.width(editor.iframeElement.style.width).height(editor.iframeElement.style.height);
            $(editor.iframeElement).replaceWith($el);
          }
        });

        editor.on('change', function(e) {
          $vm.value = editor.getContent();

          $vm.updateValue();
        });

        editor.on('reset', function(e) {
          // Stops tinymce events that are returning the old value
          // Solution for this issue https://github.com/Fliplet/fliplet-studio/issues/5514
          e.preventDefault();
          e.stopPropagation();
          return false;
        });

        
        // When selectionchange or init happened check if placeholder should show or hide
        editor.on('selectionchange init', function() {
          var element = editor.settings.inline ? editor.getElement() : editor.contentAreaContainer;

          if (editor.getContent().trim() == '') {
            element.classList.add('empty');
          } else {
            element.classList.remove('empty');
          }
        });
      }
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