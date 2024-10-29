import $ from 'cash-dom'

function isIn(path: string) {
  return window.location.href.endsWith(path)
}

function main() {
  if (isIn('/proxies')) {
    $('#app div[class*=_content_] div[class*=_group_]').each((_, group) => {
      const nameEl = $(group).find('div[class*=_groupHead_] span').first()
      if (!nameEl) return

      const name = nameEl.text()
      if (name === 'GLOBAL') $(group).hide()
    })
  }

  if (isIn('/configs')) {
    $('#app div[class*=_content_] div[class*=_root_]:nth-of-type(2)').hide()
  }
}

new MutationObserver(main).observe(document.body, {
  subtree: true,
  childList: true,
})
