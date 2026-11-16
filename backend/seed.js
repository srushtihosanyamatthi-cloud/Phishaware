import Quiz from "./models/Quiz.js";
import Lesson from "./models/Lesson.js";

const quizSeed = {
  slug: "phishing-basics",
  title: "Phishing basics",
  description: "A quick set of fictional messages to practice spotting common warning signs.",
  questions: [
    {
      _id: "650000000000000000000001",
      question: "Is this email legitimate or phishing?",
      senderEmail: "security-update@example.test",
      subject: "Urgent! Your account will be blocked",
      message: "Your account will be suspended within 24 hours. Visit the link below to verify your password immediately.",
      suspiciousLink: "https://account-check.example.test/verify",
      options: ["Legitimate email", "Phishing email"],
      correctAnswer: "Phishing email",
      isPhishing: true,
      warningSigns: ["Urgency and threats", "Credential request", "Suspicious URL"],
      explanation: "This fictional sender uses a deadline to pressure you, asks for a password, and links to an unfamiliar domain. Real services should not ask you to verify a password through an email link.",
    },
    {
      _id: "650000000000000000000002",
      question: "Is this email legitimate or phishing?",
      senderEmail: "payroll@northstar-payrol1.example.test",
      subject: "Your payslip is ready",
      message: "Please open the attached payslip.zip and enable macros to view your salary details.",
      suspiciousLink: "",
      options: ["Legitimate email", "Phishing email"],
      correctAnswer: "Phishing email",
      isPhishing: true,
      warningSigns: ["Suspicious sender address", "Unexpected attachment"],
      explanation: "The sender domain substitutes the number 1 for the letter l, and an unexpected archive asking you to enable macros is risky. Confirm payroll messages through a known, separate channel.",
    },
    {
      _id: "650000000000000000000003",
      question: "Is this email legitimate or phishing?",
      senderEmail: "library@campus.example.test",
      subject: "Library hours during the holiday",
      message: "The library will close at 5 p.m. on Friday. The updated hours are posted on the campus notice board.",
      suspiciousLink: "",
      options: ["Legitimate email", "Phishing email"],
      correctAnswer: "Legitimate email",
      isPhishing: false,
      warningSigns: [],
      explanation: "This message shares routine information, has no pressure to act, and does not ask for sensitive information or an unexpected download. Continue to verify messages when something feels unusual.",
    },
    {
      _id: "650000000000000000000004",
      question: "Is this email legitimate or phishing?",
      senderEmail: "support@streaming.example.test",
      subject: "We need your help right now",
      message: "A support agent needs your one-time login code to stop an account closure. Reply to this email with the code.",
      suspiciousLink: "",
      options: ["Legitimate email", "Phishing email"],
      correctAnswer: "Phishing email",
      isPhishing: true,
      warningSigns: ["Urgency and threats", "Credential request", "Social engineering"],
      explanation: "One-time codes are credentials. A legitimate support agent will not ask you to share them. The threat and demand to reply are social-engineering pressure.",
    },
    {
      _id: "650000000000000000000005",
      question: "Is this email legitimate or phishing?",
      senderEmail: "events@community.example.test",
      subject: "Thanks for registering",
      message: "Thanks for signing up for Saturday's workshop. You can review the event details by visiting the community center's website using your usual bookmark.",
      suspiciousLink: "",
      options: ["Legitimate email", "Phishing email"],
      correctAnswer: "Legitimate email",
      isPhishing: false,
      warningSigns: [],
      explanation: "The message follows an expected registration and does not request secrets or ask you to open an attachment. Navigating with a bookmark is a safer habit than following unexpected links.",
    },
  ],
};

const lessonSeed = [
  {
    slug: "sender-addresses",
    title: "Check the sender address",
    description: "Spot look-alike domains and unexpected senders before trusting a message.",
    relatedWarningSigns: ["Suspicious sender address"],
    icon: "at",
    content: [
      "Read the full address, not just the display name. Small substitutions, extra words, or unfamiliar domains can signal impersonation.",
      "Compare the address with a trusted message or the organization's official website. Do not reply to a suspicious email to verify it.",
      "If a request matters, contact the organization using a phone number or address you already know.",
    ],
  },
  {
    slug: "suspicious-links",
    title: "How to identify suspicious links",
    description: "Learn to inspect links safely and recognize look-alike web addresses.",
    relatedWarningSigns: ["Suspicious URL"],
    icon: "link",
    content: [
      "Pause before opening unexpected links. On a computer, you can preview the destination by hovering without clicking.",
      "Look for misspellings, extra subdomains, and domains that do not match the organization. A familiar logo does not prove a site is genuine.",
      "When in doubt, type the known website address yourself or use a saved bookmark instead of the email link.",
    ],
  },
  {
    slug: "urgency",
    title: "Recognizing urgency and threats",
    description: "Resist pressure tactics that try to make you act before you think.",
    relatedWarningSigns: ["Urgency and threats"],
    icon: "clock",
    content: [
      "Messages threatening account closure, fines, or missed rewards are designed to trigger a fast reaction.",
      "A deadline is not proof of fraud, but it is a reason to slow down and verify the request independently.",
      "Check the organization's official app or contact channel instead of using details in the message.",
    ],
  },
  {
    slug: "credential-requests",
    title: "Protect passwords and sign-in codes",
    description: "Know what legitimate support teams should never ask you to share.",
    relatedWarningSigns: ["Credential request"],
    icon: "lock",
    content: [
      "Never send your password, one-time code, recovery phrase, or authentication approval in response to an email.",
      "Open a service through its official app or a bookmark when you need to check your account.",
      "If you already shared a password, change it through the real service and notify its support team.",
    ],
  },
  {
    slug: "unexpected-attachments",
    title: "Handle unexpected attachments safely",
    description: "Treat surprising files and requests to enable content with caution.",
    relatedWarningSigns: ["Unexpected attachment"],
    icon: "file",
    content: [
      "Unexpected archives, executable files, and documents asking you to enable macros deserve extra scrutiny.",
      "Confirm with the sender through a separate trusted channel before opening a file you were not expecting.",
      "Keep your device and security software up to date, and report suspicious attachments to your IT or security team.",
    ],
  },
  {
    slug: "social-engineering",
    title: "Recognize social engineering",
    description: "Identify messages that exploit trust, fear, curiosity, or authority.",
    relatedWarningSigns: ["Social engineering"],
    icon: "people",
    content: [
      "Attackers may impersonate a manager, coworker, delivery service, or support agent to make an unusual request seem normal.",
      "Be cautious with requests to bypass routine checks, keep a secret, share codes, or move a conversation to a new channel.",
      "Verify unusual requests with the person using contact information you already trust.",
    ],
  },
];

export async function seedDatabase() {
  await Quiz.updateOne({ slug: quizSeed.slug }, { $set: quizSeed }, { upsert: true });
  for (const lesson of lessonSeed) {
    await Lesson.updateOne({ slug: lesson.slug }, { $set: lesson }, { upsert: true });
  }
}
