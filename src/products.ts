// ---------------------------------------------------------------------------
// Wicked Stacks catalog. One place to edit everything the store sells.
//
// TO WIRE UP CHECKOUT: create a Stripe Payment Link for each product
// (dashboard.stripe.com → Payment Links → New), then paste it into `buyUrl`.
// Until a buyUrl is set, the buy button shows "Coming soon" automatically.
// ---------------------------------------------------------------------------

export type Category = "business" | "mindset" | "kids" | "stack";

export interface Product {
  slug: string;
  title: string;
  subtitle: string;
  category: Category;
  price: number;
  compareAt?: number; // struck-through price for bundles
  formats: string[];
  blurb: string; // card-length description
  description: string[]; // paragraphs for the product page
  bullets: string[]; // what's inside
  buyUrl?: string; // Stripe Payment Link — leave unset until created
  badge?: string;
  includes?: string[]; // slugs of products inside a stack
}

export const SITE = {
  name: "Wicked Stacks",
  tagline: "Stack your shelf. Stack your skills.",
  parentBrand: "The Insanely Wicked",
  parentUrl: "https://theinsanelywicked.com",
  doodleUrl: "https://doodleai.app",
  // MailerLite embedded-form subscribe endpoint (derived from the form's
  // share URL: preview.mailerlite.io/forms/{account}/{form}/share).
  emailFormAction:
    "https://assets.mailerlite.com/jsonp/2587075/forms/196335778720121922/subscribe",
  contactEmail: "sales@theinsanelywicked.com",
};

export const PRODUCTS: Product[] = [
  {
    slug: "complete-business-mastery",
    buyUrl: "https://buy.stripe.com/00w9AT4Ch0Gn77z25ncQU00",
    title: "Complete Business Mastery",
    subtitle: "The Ultimate (and Slightly Sarcastic) Guide to Building, Running, and Growing Any Business",
    category: "business",
    price: 47,
    formats: ["Ebook (PDF + EPUB)", "Resource Pack (PDF)"],
    badge: "Flagship",
    blurb:
      "17 chapters of real frameworks, real numbers, and zero guru fluff — plus a full toolkit of templates, scripts, and scorecards.",
    description: [
      "This is not a motivational poster stretched into a book. Complete Business Mastery walks through the entire life of a business — mindset, unit economics, market research, branding, sales systems, operations, hiring, automation, and scaling — with the numbers shown and the nonsense called out.",
      "It took a year and a half to write because it doesn't skip the hard parts: how to size a market three different ways, when automation actually pays for itself (with the math), and why the butcher always gets paid.",
      "The included Resource Pack turns the book into action: fill-in-the-blank financial templates, cold email and call scripts, objection-handling lines, hiring scorecards, 30-60-90 plans, SOP templates, and go-to-market checklists — each cross-referenced to the chapter that explains it.",
    ],
    bullets: [
      "17 chapters, ~130 pages, written by a founder — not a content farm",
      "Market sizing, unit economics, cash flow, and pricing — with worked examples",
      "Sales scripts, objection handling, and closing systems",
      "Hiring scorecards, 30-60-90 plans, and SOP templates in the Resource Pack",
      "Automation ROI math you can actually run on your own business",
    ],
  },
  {
    slug: "from-zero-to-online-income",
    buyUrl: "https://buy.stripe.com/00w28rc4Jdt92Rj6lDcQU01",
    title: "From Zero to Online Income",
    subtitle: "A Beginner's Guide to Building a One-Person Business",
    category: "business",
    price: 17,
    formats: ["Ebook (PDF + EPUB)", "Workbook (PDF)"],
    badge: "Start here",
    blurb:
      "The realistic, no-hype path from nothing to your first online income — with a chapter-matched workbook.",
    description: [
      "No screenshots of rented Lamborghinis. From Zero to Online Income is the honest version of starting a one-person business: picking an idea you can actually execute, finding the people it serves, making a simple offer, and getting your first sales without an audience.",
      "Thirteen chapters across three parts — Foundation, Traction, and Growth — each paired with worksheets in the companion workbook: niche selection, offer design, sales conversation scripts, and a scaling decision guide.",
      "Written for the person starting from zero. You're not behind — you're just getting started.",
    ],
    bullets: [
      "13 chapters in 3 parts: Foundation → Traction → Growth",
      "Chapter-matched workbook with fill-in worksheets",
      "Sales conversation scripts with real objection responses",
      "Anti-hype: built around 50 true fans, not viral fantasies",
    ],
  },
  {
    slug: "stuck-no-more",
    buyUrl: "https://buy.stripe.com/7sYcN5gkZbl13VnbFXcQU02",
    title: "Stuck No More",
    subtitle: "A Simple Guide to Rebuilding Motivation, Confidence, and Direction",
    category: "mindset",
    price: 19,
    formats: ["Ebook (PDF + EPUB)"],
    blurb:
      "For anyone who feels stalled: how shame and paralysis actually work, and the small, doable steps that get you moving again.",
    description: [
      "Stuck No More is for the season where everything feels heavy and nothing feels possible. It takes the mechanics of feeling stuck — shame, paralysis, lost direction — and breaks them into pieces small enough to actually deal with.",
      "It covers rebuilding habits without self-punishment, finding purpose without a lightning-bolt moment, and treating yourself like someone worth helping. No toxic positivity, no 5 AM cold plunges required.",
    ],
    bullets: [
      "The longest, most personal book in the catalog (~37,000 words)",
      "Why motivation follows action — and how to start when you can't start",
      "Self-compassion that isn't self-indulgence",
      "Ends with a plan, not a pep talk",
    ],
  },
  {
    slug: "the-digital-tapestry",
    buyUrl: "https://buy.stripe.com/cNi4gzgkZ60H77zh0hcQU03",
    title: "The Digital Tapestry",
    subtitle: "Navigating Social Media, Influence, and the Future of Connection",
    category: "mindset",
    price: 19,
    formats: ["Ebook (PDF)", "Audiobook (MP3)"],
    blurb:
      "A sharp, funny deep-dive into what social media is actually doing to our brains, identities, and culture — and how to use it without being used.",
    description: [
      "From BBS boards to algorithmic feeds, The Digital Tapestry traces how we got here and what it's costing us: identity performance, influencer culture, the attention economy, misinformation, and the quiet rewiring of how we connect.",
      "Nine chapters plus case studies and reflection exercises, written by a slightly sarcastic, overly caffeinated guide who has read the research and refuses to be boring about it.",
      "The full audiobook edition is included with every copy — read it, listen to it, or both.",
    ],
    bullets: [
      "9 chapters + case studies + reflection prompts",
      "The real history of social media, minus the nostalgia filter",
      "How algorithms shape identity, culture, and what you buy",
      "Practical strategies for authentic engagement — or graceful exit",
    ],
  },
  {
    slug: "pennys-piggy-bank",
    buyUrl: "https://buy.stripe.com/00wbJ17Ot3SzgI9eS9cQU04",
    title: "Penny's Piggy Bank",
    subtitle: "Learning to Save and Share",
    category: "kids",
    price: 12,
    formats: ["Ebook (PDF)", "Audiobook (MP3)"],
    badge: "Kids + audio",
    blurb:
      "A warm, giggly introduction to money for young kids — saving, sharing, and smart choices — with the full audiobook included.",
    description: [
      "Penny has a very special piggy bank, and she's learning what every kid should know about money: how saving works, why sharing matters, and how to make choices you're proud of.",
      "Perfect for bedtime or car rides — the professionally narrated audiobook is included with every copy, so kids can listen along while they read.",
    ],
    bullets: [
      "Teaches saving, sharing, and smart money choices",
      "Full audiobook narration included",
      "Great for ages 4–8, at bedtime or on the go",
    ],
  },
  {
    slug: "princess-pennys-problem-solving-party",
    buyUrl: "https://buy.stripe.com/3cI5kD3ydbl163v25ncQU0a",
    title: "Princess Penny's Problem-Solving Party",
    subtitle: "A fully illustrated story about thinking it through",
    category: "kids",
    price: 12,
    formats: ["Illustrated Ebook (PDF)"],
    blurb:
      "Princess Penny tackles problems the royal way: one step at a time. Fully illustrated, chapter by chapter.",
    description: [
      "When problems pop up in the kingdom, Princess Penny doesn't panic — she throws a problem-solving party. A fully illustrated story that teaches kids to break big problems into small steps, ask for help, and celebrate figuring things out.",
      "Every chapter has original full-color illustrations.",
    ],
    bullets: [
      "Fully illustrated, chapter by chapter",
      "Teaches problem-solving steps kids can actually use",
      "Part of the Penny series — collect both adventures",
    ],
  },
  // ------------------------------- STACKS -------------------------------
  {
    slug: "business-starter-stack",
    buyUrl: "https://buy.stripe.com/8x2eVd6Kp4WDbnPeS9cQU05",
    title: "The Business Starter Stack",
    subtitle: "From your first idea to a business that runs",
    category: "stack",
    price: 54,
    compareAt: 64,
    formats: ["2 ebooks + 2 workbooks"],
    badge: "Best value",
    includes: ["from-zero-to-online-income", "complete-business-mastery"],
    blurb:
      "From Zero to Online Income for the launch, Complete Business Mastery for everything after — both with their full workbook/resource packs.",
    description: [
      "The complete path in one stack: start with From Zero to Online Income to get your first sales, then graduate to Complete Business Mastery to build the machine — pricing, sales systems, hiring, automation, and scale.",
      "Both companion workbooks included. This is the stack for someone who's serious.",
    ],
    bullets: [
      "Complete Business Mastery + Resource Pack",
      "From Zero to Online Income + Workbook",
      "The full beginner-to-operator path, in order",
    ],
  },
  {
    slug: "clear-head-stack",
    buyUrl: "https://buy.stripe.com/3cI8wPb0F4WD8bD5hzcQU06",
    title: "The Clear Head Stack",
    subtitle: "Get unstuck. Get your attention back.",
    category: "stack",
    price: 29,
    compareAt: 38,
    formats: ["2 ebooks"],
    includes: ["stuck-no-more", "the-digital-tapestry"],
    blurb:
      "Stuck No More to get you moving, The Digital Tapestry to take your brain back from the feed.",
    description: [
      "Two books that work on the same problem from both ends: Stuck No More rebuilds your motivation and direction, while The Digital Tapestry untangles the digital noise that drained them in the first place.",
    ],
    bullets: [
      "Stuck No More (~37,000 words of practical self-help)",
      "The Digital Tapestry (9 chapters on reclaiming your attention)",
      "Digital Tapestry audiobook now included",
    ],
  },
  {
    slug: "pennys-story-stack",
    buyUrl: "https://buy.stripe.com/8x29AT5GlfBh0Jb4dvcQU07",
    title: "Penny's Story Stack",
    subtitle: "Both Penny adventures, one bundle",
    category: "stack",
    price: 19,
    compareAt: 24,
    formats: ["2 ebooks + audiobook"],
    includes: ["pennys-piggy-bank", "princess-pennys-problem-solving-party"],
    blurb:
      "Penny's Piggy Bank (with audiobook) plus the fully illustrated Princess Penny's Problem-Solving Party.",
    description: [
      "The whole Penny collection: money smarts and problem-solving skills, wrapped in stories kids actually ask for again. Audiobook narration for Penny's Piggy Bank included.",
    ],
    bullets: [
      "Penny's Piggy Bank ebook + full audiobook",
      "Princess Penny's Problem-Solving Party, fully illustrated",
      "Two life skills: money and problem-solving",
    ],
  },
  {
    slug: "everything-stack",
    buyUrl: "https://buy.stripe.com/3cIfZh9WBdt90Jb7pHcQU08",
    title: "The Everything Stack",
    subtitle: "The entire Wicked Stacks library",
    category: "stack",
    price: 79,
    compareAt: 126,
    formats: ["6 books + workbooks + 2 audiobooks"],
    badge: "The whole stack",
    includes: [
      "complete-business-mastery",
      "from-zero-to-online-income",
      "stuck-no-more",
      "the-digital-tapestry",
      "pennys-piggy-bank",
      "princess-pennys-problem-solving-party",
    ],
    blurb:
      "Every book, every workbook, every audiobook we've got — one price, and future format upgrades included.",
    description: [
      "All six titles, all companion workbooks and resource packs, all audio — plus any format upgrades to these titles (like the Digital Tapestry audiobook) added to your library free when they ship.",
    ],
    bullets: [
      "All 4 adult titles + both workbooks/resource packs",
      "Both Penny kids' books + audiobook",
      "Future format upgrades to included titles, free",
    ],
  },
];

export const bySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

export const CATEGORY_LABELS: Record<Category, string> = {
  business: "Business",
  mindset: "Mind & Life",
  kids: "Kids' Corner",
  stack: "Stacks (Bundles)",
};
