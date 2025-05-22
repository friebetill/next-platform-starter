import { Context } from '@netlify/functions'

const AUTH_TOKEN = 'QRAVQgdvBEVX3kVtV5FGT1copZjiCBzgPcfiA4Q5+Ts='

export default (request: Request, context: Context) => {
  try {
    const authorization = request.headers.get('Authorization')
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return new Response('Unauthorized', { status: 401 })
    }

    const token = authorization.split('Bearer ')[1]
    if (token !== AUTH_TOKEN) {
      return new Response('Unauthorized', { status: 401 })
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
