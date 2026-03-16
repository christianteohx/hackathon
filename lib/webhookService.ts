import { getOrganizationById } from "./organizations"; // To get organization details including webhookUrl

export async function sendWebhook(
  organizationId: string,
  eventType: string,
  payload: object
): Promise<void> {
  const organization = getOrganizationById(organizationId);

  if (!organization || !organization.webhookUrl) {
    console.log(
      `No webhook URL configured for organization ${organizationId}. Skipping webhook.`
    );
    return;
  }

  console.log("--- Webhook Notification ---");
  console.log(`To: ${organization.webhookUrl}`);
  console.log(`Event Type: ${eventType}`);
  console.log("Payload:");
  console.log(JSON.stringify(payload, null, 2));
  console.log("----------------------------");

  // In a real application, this would send an HTTP POST request to organization.webhookUrl
  // with the payload.
}
