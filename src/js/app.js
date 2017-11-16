//=include lib/jquery.js

console.log('App is running')

$(document).ready(function () {
  function parseUrl(url) {
    var parser = document.createElement('a');
    parser.href = url;
    return parser;
  }
  function scrollToElement (element, duration) {
    $('html, body').animate({
        scrollTop: $(element).offset().top
    }, duration);
  }

  $('.nav__item a').on('click', function(e) {
    const $this = $(this)
    const href = $this.prop('href')
    const url = parseUrl(href)

    if (url.pathname == location.pathname && !!url.hash) {
      e.preventDefault();
      e.stopPropagation();
      const id = url.hash
      scrollToElement($(url.hash), 500)
    }
  })
})
