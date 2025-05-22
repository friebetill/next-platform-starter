import { Context } from '@netlify/functions'

// WARNING: Default credentials. Change these or use environment variables!
const USERNAME = 'admin'
const PASSWORD = 'password'

export default (request: Request, context: Context) => {
  try {
    console.log('Received request', request)
    const authorization = request.headers.get('Authorization')

    if (!authorization || !authorization.startsWith('Basic ')) {
      return new Response('Unauthorized: Missing or invalid Basic authentication header', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Restricted Area"' },
      })
    }

    const base64Credentials = authorization.split('Basic ')[1]
    if (!base64Credentials) {
        return new Response('Unauthorized: Missing credentials', {
            status: 401,
            headers: { 'WWW-Authenticate': 'Basic realm="Restricted Area"' },
        })
    }

    let decodedCredentials
    try {
      // In Node.js environments, Buffer is available globally.
      // In Deno/Edge environments, you might need TextDecoder if Buffer is not available.
      // Assuming a Node.js-like environment for Netlify Functions for now.
      decodedCredentials = Buffer.from(base64Credentials, 'base64').toString('utf-8')
    } catch (e) {
      return new Response('Unauthorized: Malformed credentials', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Restricted Area"' },
      })
    }

    const [username, password] = decodedCredentials.split(':')

    if (username !== USERNAME || password !== PASSWORD) {
      return new Response('Unauthorized: Invalid username or password', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Restricted Area"' },
      })
    }

    const url = new URL(request.url)
    const subject = url.searchParams.get('name') || 'World'

    return new Response(`Hello ${subject}`)
  } catch (error) {
    return new Response(error.toString(), {
      status: 500,
    })
  }
}