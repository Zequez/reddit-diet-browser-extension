function setExternalFrame (bail) {
  bail = bail == null ? 10 : bail - 1
  if (bail <= 0) return
  if (window.r && window.r.config) {
    window.r.config.external_frame = true
  } else {
    setTimeout(() => setExternalFrame(bail), 50)
  }
}

var isIframe = window != window.top
if (isIframe) {
  chrome.runtime.sendMessage('isValidRequest', function(isValidRequest) {
    if (isValidRequest) {
      var injection = '(' + setExternalFrame + ')()'
      document.documentElement.setAttribute('onreset', injection)
      document.documentElement.dispatchEvent(new CustomEvent('reset'))
      document.documentElement.removeAttribute('onreset')
    }
  })
}
