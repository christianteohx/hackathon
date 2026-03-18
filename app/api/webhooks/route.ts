import { NextRequest, NextResponse } from 'next/server';

// In a real application, you'd store and manage webhook subscriptions in a database.
// For this example, we'll use a simple in-memory store (not persistent across restarts).
interface WebhookSubscription {
  id: string;
  url: string;
  events: string[]; // e.g., ['new_vote', 'new_project']
}

const webhookSubscriptions: WebhookSubscription[] = [];

export async function POST(req: NextRequest) {
  try {
    const { url, events } = await req.json();

    if (!url || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: url and events (array of strings)' },
        { status: 400 }
      );
    }

    const newSubscription: WebhookSubscription = {
      id: crypto.randomUUID(),
      url,
      events,
    };

    webhookSubscriptions.push(newSubscription);

    console.log(`New webhook subscription: ${JSON.stringify(newSubscription)}`);

    return NextResponse.json(
      { message: 'Webhook subscribed successfully', subscription: newSubscription },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error subscribing webhook:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(webhookSubscriptions);
}
