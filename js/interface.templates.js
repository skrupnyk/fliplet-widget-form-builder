this["Fliplet"] = this["Fliplet"] || {};
this["Fliplet"]["Widget"] = this["Fliplet"]["Widget"] || {};
this["Fliplet"]["Widget"]["Templates"] = this["Fliplet"]["Widget"]["Templates"] || {};

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.file"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"form-group\">\n  <label>Allowed files</label>\n  <select v-model=\"accept\" class=\"form-control\">\n    <option value=\"\">All files</option>\n    <option value=\"image/gif, image/jpg, image/jpeg, image/tiff, image/png\">Images only</option>\n  </select>\n</div>";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.form-result"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<h2>Thanks for sending the form!</h2>\n<hr />\n<a href=\"#\" class=\"btn btn-primary\" @click.prevent=\"start()\">Start over</a>";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.form"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "    <div class=\"form-group\">\n      <label>Options (one per line)</label>\n      <textarea v-on:input=\"_setOptions($event.target.value)\" class=\"form-control\" v-model=\"_options\"></textarea>\n    </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", buffer = 
  "<form v-on:submit.prevent=\"onSubmit\">\n  <div v-if=\"_isFormField\">\n    <div class=\"form-group\">\n      <label>Field ID</label>\n      <input class=\"form-control\" type=\"text\" v-model.trim=\"name\" placeholder=\"Field name\" />\n    </div>\n\n    <div class=\"form-group\">\n      <label>Field description</label>\n      <input class=\"form-control\" type=\"text\" v-model.trim=\"label\" placeholder=\"Field description\" />\n    </div>\n\n    <div class=\"form-group\">\n      <label>Is this field required?</label>\n      <select v-model=\"required\" class=\"form-control\">\n        <option v-bind:value=\"true\">Yes, this field is required</option>\n        <option v-bind:value=\"false\">No, this field isn't required</option>\n      </select>\n    </div>\n  </div>\n\n";
  stack1 = ((helper = (helper = helpers.hasOptions || (depth0 != null ? depth0.hasOptions : depth0)) != null ? helper : alias2),(options={"name":"hasOptions","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.hasOptions) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n  "
    + ((stack1 = ((helper = (helper = helpers.template || (depth0 != null ? depth0.template : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"template","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n\n  <hr />\n  <button type=\"submit\" class=\"btn btn-primary\">Save changes</button>\n</form>";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.input"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"form-group\">\n  <label>Default value</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"value\" placeholder=\"Default value\" />\n</div>\n<div class=\"form-group\">\n  <label>Placeholder</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"placeholder\" placeholder=\"Placeholder text\" />\n</div>\n<div class=\"form-group\">\n  <label>Max length</label>\n  <input class=\"form-control\" type=\"number\" v-model=\"maxlength\" placeholder=\"Type a Number\" />\n</div>\n<div class=\"form-group\">\n  <label>Input type</label>\n  <select v-model=\"type\" class=\"form-control\">\n    <option value=\"text\">Text</option>\n    <option value=\"password\">Password (hidden characters)</option>\n    <option value=\"email\">E-mail address</option>\n    <option value=\"url\">URL</option>\n    <option value=\"tel\">Telephone</option>\n  </select>\n</div>";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.paragraph"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"form-group\">\n  <label>Text</label>\n  <textarea class=\"form-control\" v-model.trim=\"value\" placeholder=\"Type some text\" rows=\"6\"></textarea>\n</div>";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.select"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"form-group\">\n  <label>Option placeholder</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"placeholder\" placeholder=\"Placeholder\" />\n</div>";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.textarea"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"form-group\">\n  <label>Default value</label>\n  <textarea class=\"form-control\" v-model.trim=\"value\" placeholder=\"Default value\"></textarea>\n</div>\n<div class=\"form-group\">\n  <label>Placeholder</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"placeholder\" placeholder=\"Placeholder\" />\n</div>\n<div class=\"form-group\">\n  <label>Rows (defines the height of the textarea)</label>\n  <select v-model=\"rows\" class=\"form-control\">\n    <option :value=\"number\" v-for=\"number in [1,2,3,4,5,6,7,8,9]\">{{ number }}</option>\n  </select>\n</div>";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.title"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"form-group\">\n  <label>Title text</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"value\" placeholder=\"Type some text\" />\n</div>";
},"useData":true});