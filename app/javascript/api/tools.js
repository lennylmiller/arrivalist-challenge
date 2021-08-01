// determines if api request was successful (200 status)
export const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    const error = new Error(response.statusText)
    error.response = response
    if (response.status === 404) {
      error.invalidUser = true
    }
    if (response.status === 500) {
      // log all 500 errors
      console.log('error', error)
    }
    throw error
  }
}

// parse the response
export const parseJSON = response => response.json()
