let tokenString = ''

;(function getToken () {
  const queryString = window.location.search

  const urlParams = new URLSearchParams(queryString)

    tokenString = urlParams.get('token')
    document.getElementById('tokenField').value = tokenString


})()
