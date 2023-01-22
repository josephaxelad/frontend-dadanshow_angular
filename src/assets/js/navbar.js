$(function () {
  $(window).on('scroll', function () {
      if ( $(window).scrollTop() > 10 ) {
          $('.navbar_').addClass('active');
      } else {
          $('.navbar_').removeClass('active');
      }
  });
});
