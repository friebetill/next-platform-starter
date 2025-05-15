import { Context } from '@netlify/functions';

export default async (request: Request, context: Context) => {
  try {
    // Parse the request body if it's a POST request
    let receiver, subject, body;

    if (request.method === 'POST') {
      const requestBody = await request.json();
      receiver = requestBody.receiver;
      subject = requestBody.subject;
      body = requestBody.body;
    } else {
      // For GET requests, use URL parameters
      const url = new URL(request.url);
      receiver = url.searchParams.get('receiver');
      subject = url.searchParams.get('subject');
      body = url.searchParams.get('body');
    }

    // Validate inputs
    if (!receiver || !subject || !body) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: receiver, subject, and body' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);

    return new Response(
      JSON.stringify({ error: 'Failed to send email', details: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
