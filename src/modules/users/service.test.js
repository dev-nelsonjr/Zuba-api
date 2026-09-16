import { decodeBasicToken } from './services'

describe('User services', () => {
  it('should decode a Basic authentication token', () => {
    const email = 'test@test.com'
    const password = '1234'
    const token = Buffer.from(`${email}:${password}`, 'utf8').toString('base64')

    const basicToken = `Basic ${token}`

    const result = decodeBasicToken(basicToken)

    expect(result).toEqual([email, password])
  })

  it('should reject an unsupported authorization type', () => {
    const email = 'test@test.com'
    const password = '1234'
    const token = Buffer.from(`${email}:${password}`, 'utf8').toString('base64')

    const basicToken = `Bearer ${token}`

    const result = () => decodeBasicToken(basicToken)

    expect(result).toThrow('Unsupported authorization type')
  })

  it('should reject credentials without the email:password separator', () => {
    const email = 'test@test.com'
    const password = '1234'
    const token = Buffer.from(`${email}${password}`, 'utf8').toString('base64')

    const basicToken = `Basic ${token}`

    const result = () => decodeBasicToken(basicToken)

    expect(result).toThrow('Credentials must use email:password format')
  })

  it('should reject credentials that are not valid Base64', () => {
    const email = 'test@test.com'
    const password = '1234'
    const token = `${email}:${password}`

    const basicToken = `Basic ${token}`

    const result = () => decodeBasicToken(basicToken)

    expect(result).toThrow('Credentials are not valid Base64')
  })
})
