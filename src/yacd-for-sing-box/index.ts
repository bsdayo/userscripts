function urlEndsWith(path: string) {
  return window.location.href.endsWith(path)
}

function main() {
  if (urlEndsWith('/proxies')) {
    document
      .querySelectorAll<HTMLDivElement>('#app div[class*=_content_] div[class*=_group_]')
      .forEach((group) => {
        const nameEl = group.querySelector<HTMLSpanElement>('div[class*=_groupHead_] span')
        if (!nameEl) return

        const name = nameEl.innerText
        if (name === 'GLOBAL') group.style.display = 'none'
      })
  }

  if (urlEndsWith('/configs')) {
    const div = document.querySelector<HTMLDivElement>(
      '#app div[class*=_content_] div[class*=_root_]:nth-of-type(2)'
    )
    if (div) div.style.display = 'none'
  }
}

new MutationObserver(main).observe(document.body, {
  subtree: true,
  childList: true,
})
