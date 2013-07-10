if (Meteor.isClient) {
  Template.hello.helloMessage = function() { return Session.get('helloMessage'); }
  Template.standard.layoutMessage = function() { return Session.get('layoutMessage'); }
  Template.helloAside.aside = function() { return Session.get('aside'); }
  
  
  // XXX: need this helper purely because meteor's handlebars doesn't
  // support hash arguments to block helpers
  //
  // - what about if the block helper has 0 arguments?
  Handlebars.registerHelper('withContent', function(name, options) {
    return {template: name, yields: options.hash};
  });
  
  Handlebars.registerHelper('layout', function(templateName, options) {
    var yields = {};
    if (! _.isString(templateName)) {
      yields = templateName.yields;
      templateName = templateName.template;
    }
    
    yields.__base__ = options.fn;
    
    // now render template, with the named yields prepared
    var html = Template[templateName](_.extend(this, {__yields__: yields}));
    
    return new Handlebars.SafeString(html);
  });
  
  Handlebars.registerHelper('yield', function(name) {
    name = _.isString(name) ?  name : '__base__';
    
    var yield;
    if (! this.__yields__ || ! (yield = this.__yields__[name]))
      return;
    
    var html = _.isFunction(yield) ? yield(this) : Template[yield](this);
    
    return new Handlebars.SafeString(html);
  });
}
