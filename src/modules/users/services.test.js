import { decodeBasicToken } from './services'

describe('User services', () => {
  it('should return credential by basic athentication token ', () => {
    //prepare
    const email = 'nelson@gmail.com'
    const password = '123456'
    const token = Buffer.from(`${email}:${password}`, 'utf8').toString('base64')
    const basicToken = `Basic ${token}`
    // execute
    const result = decodeBasicToken(basicToken)
    // expectation
    expect(result).toEqual([email, password])
  })
})

it('should throw new error when token is not basic type ', () => {
  //prepare
  const email = 'nelson@gmail.com'
  const password = '123456'
  const token = Buffer.from(`${email}${password}`, 'utf8').toString('base64')
  const basicToken = `Bearer ${token}`
  // execute
  const result = () => decodeBasicToken(basicToken)
  // expectation
  expect(result).toThrowError('Invalid token type')
})

it('Should throw a new error when credentials is not on correct format', () => {
  //prepare
  const email = 'nelson@gmail.com'
  const password = '123456'
  const token = Buffer.from(`${email}${password}`, 'utf8').toString('base64')
  const basicToken = `Basic ${token}`
  // execute
  const result = () => decodeBasicToken(basicToken)
  // expectation
  expect(result).toThrowError('Wrong credentials format')
})

it('Should throw a new error when credentials is not base64 encoded', () => {
  //prepare
  const basicToken = 'Basic notBase64EncodedToken'

  // execute
  const result = () => decodeBasicToken(basicToken)

  // expectation
  expect(result).toThrowError('Wrong credentials is not correct encodedclea')
})
