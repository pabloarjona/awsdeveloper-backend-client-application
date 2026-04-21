import axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const certifcate =`-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJUx6kQ3pFLuY1MA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1qbnk4YWRuazNhNnRnZ3l5LnVzLmF1dGgwLmNvbTAeFw0yNjA0MjAw
NzUwMjNaFw0zOTEyMjgwNzUwMjNaMCwxKjAoBgNVBAMTIWRldi1qbnk4YWRuazNh
NnRnZ3l5LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAJqcQ84SkGwZwJY44c1hFm5DYmTBgzDBI15FIeitcIXEG0GUFxq/ghCPeGWe
nwZMgZMKDwDAAk9uxMDfq/s4EyF9nvfFjCT6D49NiGUrEBhNINSZaWI/FYxmxZcH
86cuImfnFg9rcs9RuA19qqIPOasqQOUsd4nG8d+hSA8l8Fe6vPKAZJscmkCsiZcD
c2s3VCu8jilfTK5Bhl24voDxEza6SNz6eN732nyaTXTu9pjSUHTvrsNH260rtqHT
qYFI9y3Rf8XfR84vCTW5cmyJ0Y/IRfpgl4iMfw31tiYZzDdGNSaBe1jTfzJUSCoO
xD0aPYD3PNBpoErnNLzzPx/6bqMCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUK+DwFwUY5gM6GYefS5/hMyFBoPUwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQByfZF0Ti/RW9oTi2mQdh/DxWt3SB4LNMilHR4XqiDz
7u5XUA09XfgAd6YUjkr+F4gkdJfxlOxuguunpTZY0KXZoUNmS0nXLpnPBuYGI+Lx
+mGu028h/7QTG7wOPB9Lf+6LMfd1La2pb1nfk5KXDrrPXVg0qTlby8IfY8nl4y2A
s/Kn2YL7WNlHc1bQqKKBJL09pH0BQN8ak1H4yfzbCjOYI+rhF/z7yBWPncK0CK+4
VjU/qZuF4Aj8ZLPnvs4USosSHcOoyGSXI1dqVQbpGdkgZB/PR1kKYz9UjnqytfTH
x0y4/WB81YD5CiIf0UjwbdSyzC1vsQswN17Gs8A4tpJC
-----END CERTIFICATE-----`

const jwksUrl = 'https://test-endpoint.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    const jsonwebtoken = await verifyToken(event.authorizationToken)
    console.log('User was authorized')
    return {
      principalId: jsonwebtoken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]
  //if (token !== 'secret') throw new Error('Invalid token')
  return jsonwebtoken.verify(token, certifcate, { algorithms: ['RS256'], audience: 'https://todo-api/', issuer: 'https://dev-jny8adnk3a6tggyy.us.auth0.com/' })
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]
  //if (token !== 'secret') throw new Error('Invalid token')
  return jsonwebtoken.verify(token, certifcate, { algorithms: ['RS256'] })
}
