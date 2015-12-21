/**
 * d3 library does transition with setting only transform
 * style property. In some browsers, like safari, it will not work.
 * To solve the issue I add transitions with vendor prefixes.
 */
(function() {
  var vendors = ["-moz-", "-ms-", "-o-", "-webkit-"];
  var slist = ['transform'];

  //Abstract function extender
  var prefixExtender = function(callerf, extender) {
    /*jslint evil: true */
    var caller = eval(callerf, extender);
    var copy = _.clone({t: caller}).t;
    var extended = extender(copy);

    eval(callerf + ' = extended');
    eval(callerf + '.prototype = copy.prototype');

    for(var pname in copy) {
      if(copy.hasOwnProperty(pname)) {
        eval(callerf + '[' + pname + '] = copy[pname]');
      }
    }
  };

  prefixExtender('d3.transition.prototype.styleTween', function(copy) {
    return function(name, tween, priority) {
      if(arguments.length < 3) priority = "";
      function styleTween(d, i) {
        var f = tween.call(this, d, i, window.getComputedStyle(this, null).getPropertyValue(name));
        return f && function(t) {
            var that = this;
            this.style.setProperty(name, f(t), priority);

            if(slist.indexOf(name) > -1) {
              _.each(vendors, function(vendor) {
                that.style.setProperty(vendor+name, f(t), priority);
              });
            }
          };
      }

      return this.tween("style." + name, styleTween);
    };
  });
})();

