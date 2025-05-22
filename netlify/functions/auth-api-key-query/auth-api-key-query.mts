import { Context } from '@netlify/functions'

const API_KEY = '78157ceb935f2f46607c2ae4c5f1ddbb'

export default (request: Request, context: Context) => {
  try {
    console.log('Received request', request)
    const url = new URL(request.url)
    const apiKey = url.searchParams.get('apiKey') // Read API key from query param

    if (!apiKey) {
      return new Response('Unauthorized: Missing API key in query parameter', { status: 401 })
    }

    if (apiKey !== API_KEY) {
      return new Response('Unauthorized: Invalid API key', { status: 401 })
    }

    const subject = url.searchParams.get('name') || 'World'

    return new Response(`Hello ${subject}`)
  } catch (error) {
    return new Response(error.toString(), {
      status: 500,
    })
  }
}