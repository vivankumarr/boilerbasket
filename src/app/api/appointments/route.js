import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { name, email, puid, role, date, time } = await req.json();

    if (!name || !email || !date || !time) {
      return new Response(JSON.stringify({ error: 'Missing required fields.' }), { status: 400 });
    }

    await resend.emails.send({
      from: 'appointments@boilerbasket.com',
      to: email,
      subject: 'Booking Submission Received',
      html: `
        <h2>ACE Food Pantry</h2>
        <p>Hello ${name},</p>
        <p>You have successfully submitted the appointment form with the following details:</p>
        <ul>
          <li>Date: ${date}</li>
          <li>Time: ${time}</li>
          <li>Role: ${role}</li>
        </ul>
        <p>This confirms your submission of the appointment form, not the actual appointment itself.</p>
        <p>Thank you for submitting!</p>
      `,
    });

    return new Response(JSON.stringify({ message: 'Submission received.' }), { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/appointments:', error);
    return new Response(JSON.stringify({ error: 'Failed to send confirmation email.' }), { status: 500 });
  }
}
