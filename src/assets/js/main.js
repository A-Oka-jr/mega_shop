(function ($) {
  "use strict"

  // Mobile Nav toggle
  $('.menu-toggle > a').on('click', function (e) {
    e.preventDefault();
    $('#responsive-nav').toggleClass('active');
  })

  // Fix cart dropdown from closing
  $('.cart-dropdown').on('click', function (e) {
    e.stopPropagation();
  });

  /////////////////////////////////////////

  // Products Slick
  $('.products-slick').each(function () {
    var $this = $(this),
      $nav = $this.attr('data-nav');

    $this.slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: true,
      infinite: true,
      speed: 300,
      dots: false,
      arrows: true,
      appendArrows: $nav ? $nav : false,
      responsive: [{
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          }
        },
      ]
    });
  });

  // Products Widget Slick
  $('.products-widget-slick').each(function () {
    var $this = $(this),
      $nav = $this.attr('data-nav');

    $this.slick({
      infinite: true,
      autoplay: true,
      speed: 300,
      dots: false,
      arrows: true,
      appendArrows: $nav ? $nav : false,
    });
  });

  /////////////////////////////////////////

  // Product Main img Slick
  $('#product-main-img').slick({
    infinite: true,
    speed: 300,
    dots: false,
    arrows: true,
    fade: true,
    asNavFor: '#product-imgs',
  });

  // Product imgs Slick
  $('#product-imgs').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    focusOnSelect: true,
    centerPadding: 0,
    vertical: true,
    asNavFor: '#product-main-img',
    responsive: [{
      breakpoint: 991,
      settings: {
        vertical: false,
        arrows: false,
        dots: true,
      }
    },
    ]
  });

  // Product img zoom
  var zoomMainProduct = document.getElementById('product-main-img');
  if (zoomMainProduct) {
    $('#product-main-img .product-preview').zoom();
  }

  /////////////////////////////////////////

  // Input number
  $('.input-number').each(function () {
    var $this = $(this),
      $input = $this.find('input[type="number"]'),
      up = $this.find('.qty-up'),
      down = $this.find('.qty-down');

    down.on('click', function () {
      var value = parseInt($input.val()) - 1;
      value = value < 1 ? 1 : value;
      $input.val(value);
      $input.change();
      updatePriceSlider($this, value)
    })

    up.on('click', function () {
      var value = parseInt($input.val()) + 1;
      $input.val(value);
      $input.change();
      updatePriceSlider($this, value)
    })
  });

  var priceInputMax = document.getElementById('price-max'),
    priceInputMin = document.getElementById('price-min');

  priceInputMax.addEventListener('change', function () {
    updatePriceSlider($(this).parent(), this.value)
  });

  priceInputMin.addEventListener('change', function () {
    updatePriceSlider($(this).parent(), this.value)
  });

  function updatePriceSlider(elem, value) {
    if (elem.hasClass('price-min')) {
      console.log('min')
      priceSlider.noUiSlider.set([value, null]);
    } else if (elem.hasClass('price-max')) {
      console.log('max')
      priceSlider.noUiSlider.set([null, value]);
    }
  }

  // Price Slider
  var priceSlider = document.getElementById('price-slider');
  if (priceSlider) {
    noUiSlider.create(priceSlider, {
      start: [1, 999],
      connect: true,
      step: 1,
      range: {
        'min': 1,
        'max': 999
      }
    });

    priceSlider.noUiSlider.on('update', function (values, handle) {
      var value = values[handle];
      handle ? priceInputMax.value = value : priceInputMin.value = value
    });
  }

  var $window = $(window)
  $window.on('scroll', function () {
    var scroll = $window.scrollTop()
    if (scroll < 300) {
      $('.sticky').removeClass('is-sticky')
    } else {
      $('.sticky').addClass('is-sticky')
    }
  })

  // Off Canvas Open close
  $('.mobile-menu-btn').on('click', function () {
    $('body').addClass('fix')
    $('.off-canvas-wrapper').addClass('open')
  })

  $('.btn-close-off-canvas,.off-canvas-overlay').on('click', function () {
    $('body').removeClass('fix')
    $('.off-canvas-wrapper').removeClass('open')
  })

  // offcanvas mobile menu
  var $offCanvasNav = $('.mobile-menu')

  var $offCanvasNavSubMenu = $offCanvasNav.find('.dropdown')

  /* Add Toggle Button With Off Canvas Sub Menu */
  $offCanvasNavSubMenu
    .parent()
    .prepend('<span class="menu-expand"><i></i></span>')

  /* Close Off Canvas Sub Menu */
  $offCanvasNavSubMenu.slideUp()

  /* Category Sub Menu Toggle */
  $offCanvasNav.on('click', 'li a, li .menu-expand', function (e) {
    var $this = $(this)
    if (
      $this
        .parent()
        .attr('class')
        .match(/\b(menu-item-has-children|has-children|has-sub-menu)\b/) &&
      ($this.attr('href') === '#' || $this.hasClass('menu-expand'))
    ) {
      e.preventDefault()
      if ($this.siblings('ul:visible').length) {
        $this.parent('li').removeClass('active')
        $this.siblings('ul').slideUp()
      } else {
        $this.parent('li').addClass('active')
        $this
          .closest('li')
          .siblings('li')
          .removeClass('active')
          .find('li')
          .removeClass('active')
        $this
          .closest('li')
          .siblings('li')
          .find('ul:visible')
          .slideUp()
        $this.siblings('ul').slideDown()
      }
    }
  })

  // hero slider active js
  $('.hero-slider-active').slick({
    // fade: true,
    speed: 1000,
    dots: false,
    arrows: false,
    adaptiveHeight: true,
    prevArrow: '<button type="button" class="slick-prev"></button>',
    nextArrow: '<button type="button" class="slick-next"></button>',
    responsive: [{
      breakpoint: 1200,
      settings: {
        arrows: false,
        dots: false
      }
    }]
  })

  // testimonial cariusel active js
  $('.testimonial-carousel-active').slick({
    speed: 1000,
    autoplay: false,
    arrows: true,
    adaptiveHeight: true,
    prevArrow: '<button type="button" class="slick-prev"></button>',
    nextArrow: '<button type="button" class="slick-next"></button>'
  })

  // brand logo carousel active js
  $('.brand-logo-carousel').slick({
    speed: 1000,
    slidesToShow: 4,
    autoplay: true,
    arrows: false,
    adaptiveHeight: true,
    responsive: [{
      breakpoint: 992,
      settings: {
        slidesToShow: 2
      }
    },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  })

  // Background Image JS start
  var bgSelector = $('.bg-img')
  bgSelector.each(function (index, elem) {
    var element = $(elem)

    var bgSource = element.data('bg')
    element.css('background-image', 'url(' + bgSource + ')')
  })

  // mailchimp active js
  $('#mc-form').ajaxChimp({
    language: 'en',
    callback: mailChimpResponse,
    // ADD YOUR MAILCHIMP URL BELOW HERE!
    url: 'https://devitems.us11.list-manage.com/subscribe/post?u=6bbb9b6f5827bd842d9640c82&amp;id=05d85f18ef'
  })

  // mailchimp active js
  function mailChimpResponse(resp) {
    if (resp.result === 'success') {
      $('.mailchimp-success')
        .html('' + resp.msg)
        .fadeIn(900)
      $('.mailchimp-error').fadeOut(400)
    } else if (resp.result === 'error') {
      $('.mailchimp-error')
        .html('' + resp.msg)
        .fadeIn(900)
    }
  }

  // Counter To Up JS
  $('.odometer').each(function () {
    $(this).appear(function () {
      var $this = $(this)

      var $dataValue = $this.data('count')

      setTimeout(function () {
        $this.html($dataValue)
      }, 1000)
    })
  })

  // waypoint active js
  function teamMember() {
    if ($window.width() < 575) {
      $('.team-member').waypoint(
        function () {
          $(this.element).toggleClass('team-open')
        }, {
          offset: '75%'
        }
      )
    }
  }

  teamMember()

  // Scroll to top active js
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 600) {
      $('.scroll-top').removeClass('not-visible')
    } else {
      $('.scroll-top').addClass('not-visible')
    }
  })
  $('.scroll-top').on('click', function (event) {
    $('html,body').animate({
        scrollTop: 0
      },
      1000
    )
  })

  $window.resize(function () {
    teamMember()
  })

  // wow js active
  new WOW().init()
})(jQuery);
