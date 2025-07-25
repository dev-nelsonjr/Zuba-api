class TokenTypeError extends Error {
  constructor(message = 'Invalid token type') {
    super()
    this.message = message
    this.custom = true
  }
}

class Base64EncodedError extends Error {
  constructor(message = 'Wrong credentials is not correct encodedclea') {
    super()
    this.message = message
    this.custom = true
  }
}

class BadCredentialError extends Error {
  constructor(message = 'Wrong credentials format') {
    super()
    this.message = message
    this.custom = true
  }
}

export const decodeBasicToken = basicToken => {
  const [type, credentials] = basicToken.split(' ')
  if (type !== 'Basic') {
    throw new TokenTypeError()
  }
  
  const decoded = Buffer.from(credentials, 'base64').toString()
  const endocded = Buffer.from(decoded, 'utf8').toString('base64')

  if (endocded !== credentials) {
    throw new Base64EncodedError()
  }

  if (decoded.indexOf(':') === -1) {
    throw new BadCredentialError()
  }
  return decoded.split(':')
}
