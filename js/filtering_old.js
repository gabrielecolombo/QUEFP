// external js: isotope.pkgd.js

// store filter for each group
var buttonFilters = {};
var buttonFilter;
// quick search regex
var qsRegex;

// init Isotope
var $grid = $('.grid').isotope({
  itemSelector: '.element-item',
  filter: function() {
  var $this = $(this);
  var searchResult = qsRegex ? $this.text().match( qsRegex ) : true;
  var buttonResult = buttonFilter ? $this.is( buttonFilter ) : true;
  return searchResult && buttonResult;
},
  layoutMode: 'packery',

  getSortData: {
    name: '.name',
    symbol: '.symbol',
    number: '.number parseInt',
    category: '[data-category]',
    weight: function( itemElem ) {
      var weight = $( itemElem ).find('.weight').text();
      return parseFloat( weight.replace( /[\(\)]/g, '') );
    }
  }
});

// filter functions
var filterFns = {
  // show if number is greater than 50
  numberGreaterThan10: function() {
    var number = $(this).find('.number').text();
    return parseInt( number, 10 ) > 50;
  },
  // show if name ends with -ium
  loch: function() {
    var name = $(this).find('.name').text();
    return name.match( /Loch/ );
  },


  forest: function() {
    var name = $(this).find('.name').text();
    return name.match( /Forest/ );
  },


  park: function() {
    var name = $(this).find('.name').text();
    return name.match( /Park/ );
  }
};

// bind filter button click
$('.filters').on( 'click', '.button', function() {
  var $this = $(this);
  // get group key
  var $buttonGroup = $this.parents('.button-group');
  var filterGroup = $buttonGroup.attr('data-filter-group');
  // set filter for group
  buttonFilters[ filterGroup ] = $this.attr('data-filter');
  // combine filters
  buttonFilter = concatValues( buttonFilters );
  // Isotope arrange
  $grid.isotope();
});

// use value of search field to filter
var $quicksearch = $('.quicksearch').keyup( debounce( function() {
  qsRegex = new RegExp( $quicksearch.val(), 'gi' );
  $grid.isotope();
}) );

// bind sort button click
$('#sorts').on( 'click', 'button', function() {
  var sortByValue = $(this).attr('data-sort-by');
  $grid.isotope({ sortBy: sortByValue });
});

// change is-checked class on buttons
$('.button-group').each( function( i, buttonGroup ) {
  var $buttonGroup = $( buttonGroup );
  $buttonGroup.on( 'click', 'button', function() {
    $buttonGroup.find('.is-checked').removeClass('is-checked');
    $( this ).addClass('is-checked');
  });
});

// flatten object by concatting values
function concatValues( obj ) {
  var value = '';
  for ( var prop in obj ) {
    value += obj[ prop ];
  }
  return value;
}

// debounce so filtering doesn't happen every millisecond
function debounce( fn, threshold ) {
  var timeout;
  threshold = threshold || 100;
  return function debounced() {
    clearTimeout( timeout );
    var args = arguments;
    var _this = this;
    function delayed() {
      fn.apply( _this, args );
    }
    timeout = setTimeout( delayed, threshold );
  };
}
