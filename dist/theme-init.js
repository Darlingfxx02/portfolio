// Apply the saved theme before styles paint; this external script works with CSP 'self'.
(() => {
  let theme = 'dark'
  try {
    if (localStorage.getItem('darling-live:theme') === 'light') theme = 'light'
  } catch { /* The default theme also works without storage. */ }
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
})()
