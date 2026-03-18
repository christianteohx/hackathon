import { Resend } from 'resend'; 

export async function POST(request: Request) {
  try {
    const { to, subject, body } = await request.json();
    
    if (!to || !subject || !body) {
      return new Response(JSON.stringify({ error: 'Missing required fields: to, subject, body' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: 'Resend API key not configured' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const resend = new Resend(resendApiKey);
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Replace with your verified domain
      to: to,
      subject: subject,
      html: body,
    });

    if (error) {
      return new Response(JSON.stringify({ error }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
