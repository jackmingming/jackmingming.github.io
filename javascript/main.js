(function($) {
  $(document).ready(function() {
    void 0;

    // Init page content
    function initPageContent(target, page, callback) {
      if (target && page) {
        $(target).load(page, callback);
      }
    }

    //Searching box
    $('.searching-button').click(function() {
      var inputBoxWidth;

      if ($('.sb-input').hasClass('inactive')) {
        $('.sb-input').animate({ width: '253px' });
        $('.sb-input').removeClass('inactive');
      } else {
        // Because I set borders as 1px and set padding left and 
        // right as 20px. So we calculate it and get result is 211px  
        inputBoxWidth = $('.sb-input').width() === 211 ? "0px" : "253px";
        $('.sb-input').animate({ width: inputBoxWidth });
      }
    });

    // Load content completely and then add carouse and clickable element to div
    function handleMainPageComplete() {
      $('.accordion-button').click(handleOpenOrCloseAccordion);
      /*
       * For keeping code clean. So created a jquery plugin for
       * Carousel by myself.
       */
      $('#carousel').carouselBird();
      loadImage('.accordion-image img', 'src', 'images/earth1.jpg');
      $('#contact').load('contact.html', handleContactPage);
    }

    $('.nav-contact').click(goToContact);

    function goToContact(evt) {
      var item = $(this);

      $('#nav-list').find('a').removeClass('nav-active');
      item.addClass('nav-active');
      $(window).scrollTop($('#contact').offset().top + 800);
    }

    function handleContactPage() {
      $('.contact-submit').click(function(evt) {
        var name;
        var email;
        var comment;

        $('.contact-feedback').text('');
        $('.contact-feedback').show();

        name = $("input[name*='userName']").val();
        email = $("input[name*='userEmail']").val();
        comment = $("textarea[name*='userComment']").val();

        $('.contact-feedback').text('Thank you ' + name + 'for submitting your request. ' +
          'This is what you submitted. User name: ' + name + '.' +
          ' User email: ' + email + '.' + ' User comment: ' + comment);

        $('.contact-feedback').css('padding', '1em');
        $(this).css('background', '#999');
      });
    }



    // When user scroll to top of page, the focus will be set back to home
    $(window).on('scroll', function() {
      var scrollTop = $(this).scrollTop();

      //document.body.scrollTop === 0
      if (scrollTop === 0) {
        $('#nav-list').find('a').removeClass('nav-active');
        $('.nav-home').addClass('nav-active');
      }
    });

    function handleOpenOrCloseAccordion(evt) {
      var item = $(this);
      var speed = 300;
      var itemIndex;
      var imagePath;

      // get div index for loading image
      itemIndex = item.parent().index() + 1;
      imagePath = 'images/earth' + itemIndex + '.jpg';
      loadImage('.accordion-image img', 'src', imagePath);
      $('#accordion').find('.accordion-inner').addClass('inactive');

      $(item).siblings().slideToggle(speed, function() {
        if ($(this).css('display') === 'block') {
          $(this).removeClass('inactive');
          $(this).addClass('active');
          $('#accordion').find('.inactive').slideUp(speed);
        } else {
          $(this).removeClass('active');
          $(this).addClass('inactive');
        }
      });

      evt.preventDefault();
    }

    // Load image
    function loadImage(target, attr, value) {
      if (target && attr && value) {
        $(target).attr(attr, value);
      }
    }

    initPageContent('#container', 'main-page.html', handleMainPageComplete);
  });

  /*
   * Name: carouselBird
   * Author: Ziming Zhu (Myself)
   * 20/08/2017
   * Jquery carousel plugin
   * MIT
   * Copy css and assign plugin to wherever element
   * you want to use.
   */

  $.fn.carouselBird = function(options) {
    var defaultConfigurations = {
      slideDuration: '5000',
      speed: 500,
      nextButton: '.keepForFuture',
      previousButton: '.keepForFuture',
    };

    var configurations = $.extend({}, defaultConfigurations, options);

    return this.each(function() {
      var nextButton = $(this).find('.carousel-next');
      var preButton = $(this).find('.carousel-previous');
      var carouselList = $(this).find('.items-list');
      var carouselItem = carouselList.find('.item');
      var imageWidth = carouselItem.outerWidth();
      var length = carouselItem.length;
      var totalWidth;

      totalWidth = imageWidth * length;
      carouselList.width(totalWidth);
      carouselList.find('.item:first-child').before(carouselList.find('.item:last-child'));
      carouselList.css({ 'left': -Math.abs(imageWidth) });

      //rotate the carousel
      var runCarousel = setInterval(function() {
        nextButton.click();
      }, configurations.slideDuration);

      // set next button
      nextButton.click(function() {
        carouselList.finish().animate({
          left: '-=' + imageWidth
        }, configurations.speed, function() {
          carouselList.find('.item:last-child').after(carouselList.find('.item:first-child'));
          carouselList.css({ 'left': -Math.abs(imageWidth) });
        });

        return false;
      });

      // set pre button
      preButton.click(function() {
        carouselList.finish().animate({
          left: '+=' + imageWidth
        }, configurations.speed, function() {
          carouselList.find('.item:first-child').before(carouselList.find('.item:last-child'));
          carouselList.css({ 'left': -Math.abs(imageWidth) });
        });

        return false;
      });

      $(this).hover(
        function() {
          clearInterval(runCarousel);
        },
        function() {
          runCarousel = setInterval(function() {
            nextButton.click();
          }, configurations.slideDuration);
        }
      );
    });
  };
})(jQuery);