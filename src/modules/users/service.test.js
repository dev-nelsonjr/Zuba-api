import { decodeBasicToken } from './services'

describe('User services', () => {
  it('should return user by basic authentication token', () => {
    // prepare
    const email = 'test@test.com'
    const password = '1234'
    const token = Buffer.from(`${email}:${password}`, 'utf8').toString('base64')

    const basicToken = `Basic ${token}`

    // execution
    const result = decodeBasicToken(basicToken)

    //expectation
    expect(result).toEqual([email, password])
  })

  it('should throw new error when token is not Basic type', () => {
    // prepare
    const email = 'test@test.com'
    const password = '1234'
    const token = Buffer.from(`${email}:${password}`, 'utf8').toString('base64')

    const basicToken = `Bearer ${token}`

    // execution
    const result = () => decodeBasicToken(basicToken)

    //expectation
    expect(result).toThrow('Wrong token type')
  })

  it('should throw a new error when credentials are not in the correct format', () => {
    // prepare
    const email = 'test@test.com'
    const password = '1234'
    const token = Buffer.from(`${email}${password}`, 'utf8').toString('base64')

    const basicToken = `Basic ${token}`

    // execution
    const result = () => decodeBasicToken(basicToken)

    //expectation
    expect(result).toThrow('Wrong credentials format')
  })

  it('should throw new error when credentials is not base64 encoded', () => {
    // prepare
    const email = 'test@test.com'
    const password = '1234'
    const token = `${email}:${password}`

    const basicToken = `Basic ${token}`

    // execution
    const result = () => decodeBasicToken(basicToken)

    //expectation
    expect(result).toThrow('Wrong credentials is not correct encoded')
  })
})
