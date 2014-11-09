  /*!
   * jQuery 'best options' plugin boilerplate
   * Licensed under the MIT license
   */

  (function ( $, window, document, undefined ) {

    $.fn.adder = function ( options ) {

      // Here's a 'best' approach for overriding 'defaults' with specified options.
      // Note how rather than a regular defaults object being passed as the second
      // parameter, we instead refer to $.fn.pluginName.options explicitly, merging it
      // with the options passed directly to the plugin. This allows us to override
      // options both globally and on a per-call level.

    var count = 0,
        id = 0,
        add = typeof options.add === 'string' ? function () {return options.add;} : options.add;
    options = $.extend( {}, $.fn.adder.options, options );


    $('#adderWrapper').on('click', '.remove', function (evt) {
      $(evt.target.parentElement).slideUp('slow', function () {
        $(this).remove();
      });
      count--;
      if(count === 1) {
        $('.remove').attr('disabled', 'true');
      }
    });

    $('#adderWrapper').on('click', '.add', function (evt) {
      $(evt.target.parentElement).after(add(count, id)).hide().slideDown('slow');
      count++;
      id++;
      if(count === 2) {
        $('.remove').attr('disabled', 'false');
      }
    });

    return this.each(function () {

        var elem = $(this),
            temp = '';

        for (i=0, ii = options.count || 1; i<ii; i++) {
          temp += add(count, id);
          count++;
          id++;
        }
        elem.html(temp); 

      });
    };

    // Globally overriding options
    // Here are our publicly accessible default plugin options that are available in case
    // the user doesn't pass in all of the values expected. The user is provided a default
    // experience but can also override the values as necessary.
    // eg. $fn.pluginName.key ='otherval';

    $.fn.adder.options = {

      key: "value",
      myMethod: function ( elem, param ) {

      }
    };

  })( jQuery, window );


