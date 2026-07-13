import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  TicketStatus,
  TicketCategory,
} from "../src/generated/prisma/client";
import { AI_AGENT_ID } from "core/constants/ai-agent.ts";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing tickets (will cascade to replies)
  await prisma.ticket.deleteMany();

  const tickets = [];
  const now = new Date();
  const msInDay = 24 * 60 * 60 * 1000;
  
  // We want EXACTLY 38 tickets.
  // We'll make: 10 Open, 22 Resolved, 6 Closed.
  
  const subjects = [
    "App crashes when uploading large files",
    "Two-factor authentication not sending SMS",
    "API rate limit exceeded unexpectedly",
    "Cannot connect to database after migration",
    "Webhook payloads missing timestamps",
    "SSL certificate renewal failing",
    "GraphQL subscriptions dropping",
    "Docker container keeps restarting",
    "Search index not updating",
    "OAuth callback URL mismatch error",
    "How do I export my data to CSV?",
    "What are the differences between plan tiers?",
    "Can I add more team members?",
    "Is there a mobile app available?",
    "How do I change my account email?",
    "Do you offer nonprofit discounts?",
    "Where can I find the API documentation?",
    "What payment methods do you accept?",
    "Charged twice for February subscription",
    "Service outage caused lost revenue",
    "Accidentally upgraded to Enterprise plan",
    "Cancellation processed but still being charged",
    "Refund for unused annual plan months",
    "Urgent: Account compromised",
    "Partnership inquiry",
    "Feature request: Dark mode",
    "Feedback on the new onboarding flow",
    "Request for SOC 2 compliance report"
  ];
  
  for (let i = 0; i < 38; i++) {
    // Distribute createdAt over the last 28 days so the graph is fully populated
    const daysAgo = 28 - Math.floor((i / 38) * 28);
    const createdAt = new Date(now.getTime() - (daysAgo * msInDay) + (Math.random() * msInDay * 0.5));
    
    // Resolution time (2 to 48 hours later)
    const hoursToResolve = 2 + Math.random() * 46;
    const updatedAt = new Date(createdAt.getTime() + hoursToResolve * 60 * 60 * 1000);
    
    let status = TicketStatus.open;
    let assignedToId: string | null = null;
    
    if (i < 10) {
      status = TicketStatus.open;
    } else if (i < 32) {
      status = TicketStatus.resolved;
      // Resolve 12 of these by AI to give a healthy AI resolution rate
      if (i < 22) {
        assignedToId = AI_AGENT_ID;
      }
    } else {
      status = TicketStatus.closed;
    }
    
    tickets.push({
      subject: subjects[i % subjects.length] + (i >= subjects.length ? ` (${i})` : ""),
      body: "This is a detailed description of the problem or question the customer is having. It contains sufficient length to look like a real ticket body.",
      status,
      category: [TicketCategory.technical_question, TicketCategory.general_question, TicketCategory.refund_request][i % 3],
      senderName: `Customer ${i + 1}`,
      senderEmail: `customer${i + 1}@example.com`,
      assignedToId,
      createdAt,
      updatedAt: status === TicketStatus.open ? createdAt : updatedAt,
    });
  }

  // Insert all tickets individually so Prisma respects the updatedAt field
  for (const t of tickets) {
    await prisma.ticket.create({
      data: t,
    });
  }

  console.log(`Seeded EXACTLY ${tickets.length} realistic tickets successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
