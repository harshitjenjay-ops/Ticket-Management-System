import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  TicketStatus,
  TicketCategory,
} from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const tickets: {
  subject: string;
  body: string;
  status: TicketStatus;
  category: TicketCategory | null;
  senderName: string;
  senderEmail: string;
  createdAt: Date;
}[] = [
  {
    subject: "Issue connecting custom domain",
    body: "Hi, I have been trying to point my domain to your servers following the guide, but it's been 48 hours and the SSL is still pending. Can you check my DNS records?",
    status: TicketStatus.resolved,
    category: TicketCategory.technical_question,
    senderName: "Sarah Jenkins",
    senderEmail: "sarah@startup.io",
    createdAt: new Date("2026-04-12T14:30:00Z"),
  },
  {
    subject: "Question about Enterprise pricing tier",
    body: "We are currently on the Pro plan but expect our user base to double next month. Could you provide a breakdown of the Enterprise volume discounts?",
    status: TicketStatus.closed,
    category: TicketCategory.general_question,
    senderName: "David Lee",
    senderEmail: "d.lee@techcorp.com",
    createdAt: new Date("2026-04-20T09:15:00Z"),
  },
  {
    subject: "Double charge on my credit card",
    body: "My statement this month shows two identical charges of $49.00 on April 28th. Could you please refund the duplicate?",
    status: TicketStatus.resolved,
    category: TicketCategory.refund_request,
    senderName: "Marcus Thorne",
    senderEmail: "marcus.thorne@gmail.com",
    createdAt: new Date("2026-05-02T11:45:00Z"),
  },
  {
    subject: "Webhooks failing intermittently",
    body: "Our system is missing about 5% of webhook events since yesterday. Checking the logs, it looks like your server is returning 502 Bad Gateway occasionally.",
    status: TicketStatus.resolved,
    category: TicketCategory.technical_question,
    senderName: "Priya Sharma",
    senderEmail: "psharma@devagency.net",
    createdAt: new Date("2026-05-15T16:20:00Z"),
  },
  {
    subject: "How do I invite team members?",
    body: "I just upgraded my workspace, but I can't find the option to invite my colleagues. Where is the team management panel?",
    status: TicketStatus.closed,
    category: TicketCategory.general_question,
    senderName: "Elena Rodriguez",
    senderEmail: "elena@creativeflow.co",
    createdAt: new Date("2026-05-22T10:05:00Z"),
  },
  {
    subject: "Feature request: Dark Mode",
    body: "I absolutely love the platform, but a dark mode would really help when working late at night. Are there any plans to add this?",
    status: TicketStatus.open,
    category: null,
    senderName: "Tom Hollander",
    senderEmail: "tomh@studio.com",
    createdAt: new Date("2026-06-03T20:30:00Z"),
  },
  {
    subject: "API Rate limits exceeded?",
    body: "Our dashboard is throwing 429 Too Many Requests errors, but our internal tracking shows we are well below the 10,000 req/hour limit.",
    status: TicketStatus.open,
    category: TicketCategory.technical_question,
    senderName: "Wei Chen",
    senderEmail: "wei.c@datacorp.io",
    createdAt: new Date("2026-06-12T08:15:00Z"),
  },
  {
    subject: "Forgot to cancel before trial ended",
    body: "I meant to cancel my trial yesterday but totally forgot. I haven't used the product since day 1. Can I get a refund please?",
    status: TicketStatus.resolved,
    category: TicketCategory.refund_request,
    senderName: "Anita Rossi",
    senderEmail: "anita.rossi@outlook.com",
    createdAt: new Date("2026-06-18T14:40:00Z"),
  },
  {
    subject: "Dashboard analytics not updating",
    body: "The numbers on my overview dashboard haven't changed since yesterday afternoon. Is there a delay in the data pipeline?",
    status: TicketStatus.open,
    category: TicketCategory.technical_question,
    senderName: "James McMillan",
    senderEmail: "jamesm@marketingpro.com",
    createdAt: new Date("2026-06-25T09:50:00Z"),
  },
  {
    subject: "Can I pay via wire transfer?",
    body: "Our accounting department requires us to pay via wire transfer for annual plans. Is this something you support?",
    status: TicketStatus.open,
    category: TicketCategory.general_question,
    senderName: "Sophie Bennett",
    senderEmail: "s.bennett@enterprise.uk",
    createdAt: new Date("2026-07-01T13:10:00Z"),
  },
  {
    subject: "Exporting data to CSV",
    body: "I need to generate a quarterly report. Is there a way to export all my project data to a CSV file?",
    status: TicketStatus.closed,
    category: TicketCategory.general_question,
    senderName: "Omar Farooq",
    senderEmail: "omar@logistics.ae",
    createdAt: new Date("2026-07-05T11:25:00Z"),
  },
  {
    subject: "Login page spins forever on Safari",
    body: "Since the update this morning, I can't log in using Safari on my Mac. It just shows a spinning loading icon. Works fine on Chrome.",
    status: TicketStatus.open,
    category: TicketCategory.technical_question,
    senderName: "Rachel Kim",
    senderEmail: "rachel.kim@designco.com",
    createdAt: new Date("2026-07-10T15:00:00Z"),
  },
  {
    subject: "Incorrect tax applied to invoice",
    body: "My company is exempt from VAT, but my latest invoice included a 20% VAT charge. Could you please correct the invoice and refund the difference?",
    status: TicketStatus.open,
    category: TicketCategory.refund_request,
    senderName: "Lars Jensen",
    senderEmail: "lars@nordictech.se",
    createdAt: new Date("2026-07-11T09:30:00Z"),
  },
  {
    subject: "Requesting SOC2 compliance report",
    body: "We are doing an internal security audit and require a copy of your most recent SOC2 Type II report. Please let me know if you need an NDA signed.",
    status: TicketStatus.open,
    category: null,
    senderName: "Grace O'Connor",
    senderEmail: "grace.o@finsec.com",
    createdAt: new Date("2026-07-12T16:45:00Z"),
  },
  {
    subject: "URGENT: Application completely down",
    body: "Our production environment cannot connect to your API. We are getting 503 Service Unavailable across the board. Please advise ASAP.",
    status: TicketStatus.open,
    category: TicketCategory.technical_question,
    senderName: "Michael Chang",
    senderEmail: "mchang@globalapp.net",
    createdAt: new Date("2026-07-13T08:20:00Z"),
  }
];

async function main() {
  // Clear existing tickets
  await prisma.ticket.deleteMany();

  // Insert all tickets
  await prisma.ticket.createMany({ data: tickets });

  console.log(`Seeded ${tickets.length} realistic tickets successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
