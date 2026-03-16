export async function sendEmail(
  to: string,
  subject: string,
  body: string
): Promise<void> {
  console.log("--- Email Notification ---");
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log("Body:");
  console.log(body);
  console.log("--------------------------");
  // In a real application, this would integrate with an email sending service (e.g., SendGrid, Mailgun)
}
