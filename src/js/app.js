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

  const INSTAGRAM_NAME = 'kvartira1_zp'

  function addImages(element, images = []) {
    images.forEach((image) => {
      const link = document.createElement('a')
      const img = document.createElement('img')
      const inner = document.createElement('span')

      img.src = image.thumbnail_resources[0].src;
      img.alt = image.caption

      link.href = `https://instagram.com/p/${image.code}`
      link.rel = "noreferrer nofollow"
      link.target = "__blank"

      inner.classList.add('feedback__widget__in')

      inner.appendChild(img)
      link.appendChild(inner)

      element.append(link)
    })
  }

  $.get(`https://www.instagram.com/${INSTAGRAM_NAME}/?__a=1`)
  .then((resp) => {
    const images = resp.user.media.nodes.slice(0, 4);
    addImages($('#instagram'), images)
  })


  $('.prices-block').each(function () {
    const $prices = $(this)
    const tabHeadersActiveClass = 'tabs__item_active'
    const $tabHeaders = $prices.find('.prices-block__tabs .tabs__item')
    const tabBlocksActiveClass = 'tabs__item_active'
    const $tabBlocks = $prices.find('.prices-block__prices .prices')

    function setActive(index) {
      $tabHeaders.removeClass(tabHeadersActiveClass)
      $tabHeaders.eq(index).addClass(tabHeadersActiveClass)

      $tabBlocks.css('display', 'none')
      $tabBlocks.eq(index).css('display', 'block')
    }

    $tabHeaders.on('click', function (e) {
      e.preventDefault()
      e.stopPropagation()
      const $header = $(this)
      setActive($tabHeaders.index($header))
    })
    setActive(0)
  })
})
