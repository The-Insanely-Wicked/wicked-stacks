// ---------------------------------------------------------------------------
// Wicked Stacks catalog. One place to edit everything the store sells.
//
// TO WIRE UP CHECKOUT: create a Stripe Payment Link for each product
// (dashboard.stripe.com → Payment Links → New), then paste it into `buyUrl`.
// Until a buyUrl is set, the buy button shows "Coming soon" automatically.
// ---------------------------------------------------------------------------

export type Category = "business" | "mindset" | "kids" | "stack" | "courses";

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
  image?: string; // optional cover art (path under /public)
  courses?: string[]; // course titles inside a course stack
  previews?: { src: string; caption: string }[]; // real lesson frames
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
  // The free-updates promise. Shown on every book page (not the licensed
  // video courses, which aren't ours to add to). Worded carefully — this is
  // a commitment to buyers, so don't loosen it without meaning to.
  updatesPromise:
    "Buy it once and you keep getting more. Everything added to this book in the twelve months after you buy — new audio, new videos, workbooks, updated editions — is emailed to you free. No upgrade fee, no buying it again.",
  updatesFootnote:
    "Anything released free on YouTube or social media isn't part of this — that's already free for everybody.",
};

export const PRODUCTS: Product[] = [
  {
    slug: "complete-business-mastery",
    buyUrl: "https://buy.stripe.com/28E7sL2u960HcrTbFXcQU0u",
    title: "Complete Business Mastery",
    subtitle: "The Ultimate (and Slightly Sarcastic) Guide to Building, Running, and Growing Any Business",
    category: "business",
    image: "/covers/complete-business-mastery.png",
    price: 49,
    formats: [
      "Ebook (PDF + EPUB)",
      "Resource Pack (PDF)",
      "7 audio deep-dives (M4A) · over 3 hours",
      "3 videos (MP4)",
    ],
    badge: "Flagship",
    blurb:
      "17 chapters of real frameworks, real numbers, and zero guru fluff — plus a full toolkit of templates, scripts, and scorecards.",
    description: [
      "This is not a motivational poster stretched into a book. Complete Business Mastery walks through the entire life of a business — mindset, unit economics, market research, branding, sales systems, operations, hiring, automation, and scaling — with the numbers shown and the nonsense called out.",
      "It took a year and a half to write because it doesn't skip the hard parts: how to size a market three different ways, when automation actually pays for itself (with the math), and why the butcher always gets paid.",
      "The included Resource Pack turns the book into action: fill-in-the-blank financial templates, cold email and call scripts, objection-handling lines, hiring scorecards, 30-60-90 plans, SOP templates, and go-to-market checklists — each cross-referenced to the chapter that explains it.",
      "Seven bonus audio deep-dives are included free — Why Rational Leaders Make Destructive Decisions, The Brutal Math of Strategic Sacrifice, Why Profitable Companies Go Bankrupt, Four Funding Paths and Founder Psychology, Bootstrapping versus Venture Capital, Turn Sales Rejections into Product Moats, and Bulletproofing Your Business Against Legal Disasters. Over three hours of the book's hardest ideas, argued out loud for your commute.",
      "Three short videos come with it too: The Physics of Profit, Strategy is Sacrifice, and The 13-Week Cash Flow Rule — the arguments that are easier to watch than to read.",
    ],
    bullets: [
      "17 chapters, ~130 pages, written by a founder — not a content farm",
      "Market sizing, unit economics, cash flow, and pricing — with worked examples",
      "Sales scripts, objection handling, and closing systems",
      "Hiring scorecards, 30-60-90 plans, and SOP templates in the Resource Pack",
      "Automation ROI math you can actually run on your own business",
      "7 bonus audio deep-dives (over 3 hours) — the big ideas argued out",
      "3 videos on profit, strategic sacrifice, and the 13-week cash flow rule",
    ],
  },
  {
    slug: "from-zero-to-online-income",
    buyUrl: "https://buy.stripe.com/00w28rc4Jdt92Rj6lDcQU01",
    title: "From Zero to Online Income",
    subtitle: "A Beginner's Guide to Building a One-Person Business",
    category: "business",
    image: "/covers/from-zero-to-online-income.png",
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
    buyUrl: "https://buy.stripe.com/cNi9AT4Chcp5fE5h0hcQU0n",
    title: "Stuck No More",
    subtitle: "A Simple Guide to Rebuilding Motivation, Confidence, and Direction",
    category: "mindset",
    image: "/covers/stuck-no-more.png",
    price: 37,
    formats: [
      "Ebook (PDF + EPUB)",
      "Audiobook (MP3)",
      "The Restart Kit (PDF)",
      "3 videos (MP4) · 25 min",
    ],
    blurb:
      "For anyone who feels stalled: how shame and paralysis actually work, and the small, doable steps that get you moving again.",
    description: [
      "Stuck No More is for the season where everything feels heavy and nothing feels possible. It takes the mechanics of feeling stuck — shame, paralysis, lost direction — and breaks them into pieces small enough to actually deal with.",
      "It covers rebuilding habits without self-punishment, finding purpose without a lightning-bolt moment, and treating yourself like someone worth helping. No toxic positivity, no 5 AM cold plunges required.",
      "The full audiobook edition is now included with every copy — read it, listen to it, or both.",
      "Three short videos come with it now as well: Reclaiming the Mirror, The Autonomy of Avoidance and Overcoming, and The Architecture of Paralysis — twenty-five minutes on the hardest parts of getting moving again.",
      "And every copy now comes with The Restart Kit: a printable companion workbook with a tool for all fourteen chapters — the Stuck Inventory, the Roadblock Identifier, the Small Promise Tracker, the Restart Protocol — finishing with an Emergency Restart Card built for the day it all falls apart. Read the chapter, spend fifteen minutes with its worksheet, and the ideas turn into motion.",
    ],
    bullets: [
      "The longest, most personal book in the catalog (~37,000 words)",
      "Why motivation follows action — and how to start when you can't start",
      "Self-compassion that isn't self-indulgence",
      "Ends with a plan, not a pep talk",
      "Full audiobook edition included free",
      "The Restart Kit: 14 printable worksheets + the Emergency Restart Card",
      "3 videos (25 min) on paralysis, avoidance, and facing yourself again",
      "Price locked at purchase — anything added later is yours free",
    ],
  },
  {
    slug: "the-digital-tapestry",
    buyUrl: "https://buy.stripe.com/cNi4gzgkZ60H77zh0hcQU03",
    title: "The Digital Tapestry",
    subtitle: "Navigating Social Media, Influence, and the Future of Connection",
    category: "mindset",
    image: "/covers/the-digital-tapestry.png",
    price: 29,
    formats: [
      "Ebook (PDF)",
      "Audiobook (MP3)",
      "3 videos (MP4) · 23 min",
    ],
    blurb:
      "A sharp, funny deep-dive into what social media is actually doing to our brains, identities, and culture — and how to use it without being used.",
    description: [
      "From BBS boards to algorithmic feeds, The Digital Tapestry traces how we got here and what it's costing us: identity performance, influencer culture, the attention economy, misinformation, and the quiet rewiring of how we connect.",
      "Nine chapters plus case studies and reflection exercises, written by a slightly sarcastic, overly caffeinated guide who has read the research and refuses to be boring about it.",
      "The full audiobook edition is included with every copy — read it, listen to it, or both.",
      "Three short videos come with it now as well: The Digital Tapestry, Digital Funhouse Mirror, and The Hijacking of the Public Sphere — twenty-three minutes on the book's sharpest arguments, for when watching beats reading.",
    ],
    bullets: [
      "9 chapters + case studies + reflection prompts",
      "The real history of social media, minus the nostalgia filter",
      "How algorithms shape identity, culture, and what you buy",
      "Practical strategies for authentic engagement — or graceful exit",
      "Full audiobook included — the whole book, read aloud",
      "3 videos (23 min) on identity, the funhouse mirror, and the public sphere",
    ],
  },
  {
    slug: "the-overwhelm-detox",
    buyUrl: "https://buy.stripe.com/3cI3cvfgVagX8bD11jcQU0r",
    title: "The Overwhelm Detox",
    subtitle: "Reclaim Your Time, Attention, and Peace from Digital Burnout",
    category: "mindset",
    image: "/covers/the-overwhelm-detox.png",
    price: 29,
    formats: [
      "Ebook (PDF)",
      "3 audio deep-dives (M4A) · ~1 hr 18 min",
      "4 videos (MP4) · ~21 min",
    ],
    blurb:
      "A funny, unsparing eleven-chapter plan for getting your attention back from your phone — plus nearly an hour and forty minutes of audio and video built from the book itself.",
    description: [
      "If your average Tuesday feels less like a ship sailing smoothly and more like patching seventeen leaks on a rubber dinghy during a hurricane, this one is for you. The Overwhelm Detox is about the specific modern exhaustion that comes from a device engineered to interrupt you, and it treats that as a design problem rather than a personal failing.",
      "It starts by working out what the overwhelm is actually costing you, then gets specific: silencing the notification machine, setting boundaries that survive contact with other people, rebuilding a focus muscle that has not been used in a while, designing rooms and screens that leave you alone, and handling the inner critic that gets loud the moment things go quiet.",
      "Eleven chapters, roughly 22,000 words, written by someone who is clearly enjoying himself. Nobody is asked to delete their accounts, move to a cabin, or feel guilty about liking the internet.",
      "It now comes with its own library. Three audio deep-dives — a two-host conversation, a head-to-head debate, and a critique that pushes back on the book's own arguments — run about an hour and twenty minutes between them. Four short videos cover the core ideas in about twenty more: the itemized bill of burnout, counter-engineering the attention economy, the focus fortress protocol, and an explainer that walks through the whole thing.",
      "All of it is built from the book's own material, so it works on a commute, over the washing up, or in the ten minutes before bed when reading is too much like hard work.",
    ],
    bullets: [
      "11 chapters on notifications, boundaries, focus, environment and the inner critic",
      "Work out your own flavor of overwhelm before trying to fix it",
      "Boundaries that hold up when your boss messages at 4:53pm",
      "Sustainable strategies, not a 30-day digital fast you will abandon",
      "Funny throughout, which is the only way anyone finishes a book like this",
      "3 audio deep-dives (~1 hr 18 min) — a conversation, a debate, and a critique",
      "4 videos (~21 min) on the book's biggest ideas",
    ],
  },
  {
    slug: "tapestry-debates",
    buyUrl: "https://buy.stripe.com/3cIdR9gkZgFl3VnbFXcQU0b",
    title: "The Tapestry Debates",
    subtitle: "Two head-to-head debates on the big questions from The Digital Tapestry",
    category: "mindset",
    image: "/covers/tapestry-debates.png",
    price: 7,
    formats: ["2 audio debates (M4A) · ~50 minutes"],
    blurb:
      "Two lively two-host debates that take the sharpest questions from The Digital Tapestry and argue both sides — smart, fast, and surprisingly fun to disagree with.",
    description: [
      "How Algorithms Hijack Your Brain: are recommendation feeds a tool you use, or a slot machine using you? Both sides get their best shot.",
      "Digital Connection or Psychological Trap?: is social media genuinely connecting us, or performing connection while collecting us? A real argument, not a lecture.",
      "Built entirely from the book's own research and ideas — a different way into the material, perfect for a commute. Read the book, then hear it argued.",
    ],
    bullets: [
      "Two full debates, ~25 minutes each",
      "Both sides argued properly — no strawmen",
      "Built from The Digital Tapestry's research",
      "Great companion listen to the book (sold separately, $19)",
    ],
  },
  {
    slug: "your-shit-stinks-too",
    buyUrl: "https://buy.stripe.com/4gM3cv1q54WD77zaBTcQU0p",
    title: "Your Shit Stinks Too",
    subtitle: "Nobody Gets the High Horse",
    category: "mindset",
    image: "/covers/your-shit-stinks-too.png",
    price: 29,
    badge: "Growing collection",
    formats: [
      "Ebook (PDF)",
      "3 audio deep-dives (M4A) · ~2 hours",
      "3 videos (MP4) · 26 min",
      "Everything added for 12 months, free",
    ],
    blurb:
      "Nobody gets to ride the high horse. The book, two hours of audio deep-dives, and three short videos on hypocrisy, bias, and the mess we're all standing in. Born as a podcast, starring Michael and his dog Frankie.",
    description: [
      "Your Shit Stinks Too started as a podcast with an unlikely duo: Michael and his dog Frankie, calling out the one thing humans hate admitting — everybody's shit stinks, including yours, including his.",
      "This collection turns that story into deep-dive conversations that dig into the big uncomfortable stuff: The High Horse of Human Hypocrisy (~40 min), Why Our Brains Defend Systemic Inequality (~43 min), and Shared Fallibility and Systemic Racism (~38 min).",
      "It's a book now too. The whole argument, written down and expanded — so you can read it, listen to it, or watch it, whichever suits the day. Three short videos come with it as well: Judgment and Hypocrisy, Human Competence, and The Paradox of Equality Hypocrisy — twenty-six minutes in total.",
      "It's a living collection. Everything released in the twelve months after you buy is emailed to you free — episodes, videos, workbooks, whatever gets added — and the price climbs as the collection grows. The earlier you buy, the more you get and the less you pay for it.",
    ],
    bullets: [
      "The full book (PDF) — the whole argument, written down",
      "3 deep-dive episodes, ~2 hours of audio",
      "3 videos (26 min) on judgment, competence, and equality hypocrisy",
      "Honest, funny, and uncomfortable in the good way",
      "Everything added for the next 12 months — audio, video, workbooks — emailed free",
      "Price goes up as the collection grows — lock in today's",
      "Listen anywhere — it's yours, no app required",
    ],
  },
  {
    slug: "pennys-piggy-bank",
    buyUrl: "https://buy.stripe.com/00wbJ17Ot3SzgI9eS9cQU04",
    title: "Penny's Piggy Bank",
    subtitle: "Learning to Save and Share",
    category: "kids",
    image: "/covers/pennys-piggy-bank.png",
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
    image: "/covers/princess-pennys-problem-solving-party.png",
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
  // ---------------------------- VIDEO COURSES ----------------------------
  {
    slug: "project-management-stack",
    buyUrl: "https://buy.stripe.com/28EdR90m174LcrTbFXcQU0i",
    title: "The Project Management Stack",
    subtitle: "Five complete video courses, start to finish",
    category: "courses",
    price: 49,
    badge: "Video courses",
    previews: [
      { src: "/previews/pm-what-is-project-management.jpg", caption: "What Is Project Management?" },
      { src: "/previews/pm-create-a-project-plan.jpg", caption: "How to Create a Project Plan" },
      { src: "/previews/pm-mistakes-to-avoid.jpg", caption: "5 Project Management Mistakes to Avoid" },
    ],
    image: "/courses/project-management.png",
    formats: ["26 video lessons", "3 PDF guides", "Stream or download"],
    courses: [
      "Getting Started with Project Management — 6 video lessons",
      "Improving Your Project Management Skills — 4 video lessons",
      "Project Management Scheduling — 5 video lessons + PDF guide",
      "Mastering Project Management Frameworks — 5 video lessons + PDF guide",
      "Secrets to Successful Reporting for Project Managers — 6 video lessons + PDF guide",
    ],
    blurb:
      "Everything from your first project plan to reporting that executives actually read — five full courses, 26 video lessons, professionally produced.",
    description: [
      "Project management is one of those skills nobody formally teaches you — you get handed a project and everyone assumes you know what a Gantt chart is. This stack fixes that, properly.",
      "Five complete video courses take you from fundamentals through scheduling, frameworks, and the reporting skills that make the difference between a project manager people trust and one they route around.",
      "Every course is video-based with companion PDF materials. Stream them or download them and keep them forever — no platform login, no expiring access, no subscription.",
    ],
    bullets: [
      "5 complete courses — 26 video lessons in total",
      "Fundamentals → scheduling → frameworks → reporting",
      "3 companion PDF guides included",
      "Yours forever — download and keep, no subscription",
    ],
  },
  {
    slug: "communication-stack",
    buyUrl: "https://buy.stripe.com/3cI28rd8N3SzfE539rcQU0j",
    title: "The Communication Stack",
    subtitle: "Write better, speak better, negotiate better",
    category: "courses",
    price: 39,
    previews: [
      { src: "/previews/comm-negotiation-vs-persuasion.jpg", caption: "Negotiation vs. Persuasion" },
      { src: "/previews/comm-persuasion-tactics.jpg", caption: "Persuasion Tactics" },
      { src: "/previews/comm-three-types-of-negotiation.jpg", caption: "The Three Types of Negotiation" },
    ],
    image: "/courses/communication.png",
    formats: ["19 video lessons", "2 PDF guides", "Stream or download"],
    courses: [
      "Write Like A Boss — 6 video lessons + PDF guide",
      "Master the Art of Verbal Communication — 7 video lessons + PDF guide",
      "Guide to Negotiation and Persuasion — 5 video lessons",
      "Chatters: Everyday Conversation Skills — one full-length session",
    ],
    blurb:
      "The skills that decide whether your good ideas get heard — writing, speaking, negotiating, and holding a room.",
    description: [
      "Most careers stall on communication, not competence. The person who explains the idea clearly gets the budget; the person who can't gets overlooked, no matter how good the idea was.",
      "Four complete video courses cover the whole range: writing that gets read, speaking that holds attention, negotiating without being a jerk about it, and the everyday conversation skills nobody thinks to teach.",
      "Video lessons plus companion PDFs. Download them and they're yours — no subscription, no expiring access.",
    ],
    bullets: [
      "4 complete courses — 19 video lessons in total",
      "Writing, speaking, negotiation, and everyday conversation",
      "2 companion PDF guides included",
      "Yours forever — download and keep, no subscription",
    ],
  },
  {
    slug: "focus-resilience-stack",
    buyUrl: "https://buy.stripe.com/fZu6oHecR2OvbnP8tLcQU0k",
    title: "The Focus & Resilience Stack",
    subtitle: "Five video courses on stress, focus, and holding steady",
    category: "courses",
    price: 39,
    previews: [
      { src: "/previews/change-fundamentals.jpg", caption: "The Fundamentals of Leading Through Change" },
      { src: "/previews/change-5-tips-for-leading-teams.jpg", caption: "5 Tips for Leading Teams Through Change" },
      { src: "/previews/change-empowering-employees.jpg", caption: "Empowering Employees to Navigate Change" },
    ],
    image: "/courses/focus-resilience.png",
    formats: ["16 video lessons", "2 PDF guides", "Stream or download"],
    courses: [
      "Dealing With Stress — 3 video lessons",
      "How to Manage Stress and Increase Mental Focus — 5 video lessons",
      "Workplace Distractions — 4 video lessons + PDF guide",
      "Strategies for Working Remotely — full course + the Remote Work Survival Guide",
      "Leading Through Change — 3 video lessons",
    ],
    blurb:
      "Stress, distraction, remote-work drift, and change you didn't ask for — five courses on staying functional when work gets loud.",
    description: [
      "Nobody's productivity problem is really a productivity problem. It's stress you're carrying, distractions you can't escape, or change nobody prepared you for.",
      "Five complete video courses work on the actual causes: managing stress instead of powering through it, rebuilding focus in an environment designed to break it, making remote work sustainable, and leading a team through change without losing them.",
      "Pairs naturally with Stuck No More if you're rebuilding on the personal side too.",
    ],
    bullets: [
      "5 complete courses — 16 video lessons in total",
      "Stress, focus, distraction, remote work, and change",
      "2 companion PDF guides included",
      "Yours forever — download and keep, no subscription",
    ],
  },
  {
    slug: "career-growth-stack",
    buyUrl: "https://buy.stripe.com/28E3cvgkZ9cTdvXcK1cQU0l",
    title: "The Career Growth Stack",
    subtitle: "Three video courses for building a career on purpose",
    category: "courses",
    price: 39,
    previews: [
      { src: "/previews/career-asking-for-a-raise.jpg", caption: "Asking for a Raise" },
      { src: "/previews/newpro-first-week-on-the-job.jpg", caption: "6 Tips for Your First Week on the Job" },
      { src: "/previews/solve-complicated-vs-complex.jpg", caption: "Managing Complicated vs. Complex Problems" },
    ],
    image: "/courses/career-growth.png",
    formats: ["22 video lessons", "3 PDF guides", "Stream or download"],
    courses: [
      "Take Control of Your Future: Career Development 101 — 9 video lessons + PDF guide",
      "The Complete Guide for New Professionals — 8 video lessons + PDF guide",
      "Problem Solving Fundamentals — 5 video lessons + PDF guide",
    ],
    blurb:
      "For anyone starting out or starting over — career direction, professional footing, and the problem-solving skills every job actually tests.",
    description: [
      "Careers don't build themselves, and nobody hands you a map. These three courses are the map: how to steer your own development instead of waiting to be noticed, how to find your footing as a new professional, and how to solve problems in a way people remember.",
      "Video lessons throughout, with companion PDF materials. Perfect alongside From Zero to Online Income if you're building something on the side.",
    ],
    bullets: [
      "3 complete courses — 22 video lessons in total",
      "Career development, professional skills, problem solving",
      "3 companion PDF guides included",
      "Yours forever — download and keep, no subscription",
    ],
  },
  {
    slug: "complete-course-library",
    buyUrl: "https://buy.stripe.com/6oUdR95GlgFl1NfdO5cQU0m",
    title: "The Complete Course Library",
    subtitle: "All 17 video courses, one price",
    category: "courses",
    price: 99,
    compareAt: 166,
    badge: "Best value",
    previews: [
      { src: "/previews/pm-four-phases.jpg", caption: "The Four Phases of Project Management" },
      { src: "/previews/comm-negotiation-tactics.jpg", caption: "Negotiation Tactics" },
      { src: "/previews/change-fundamentals.jpg", caption: "The Fundamentals of Leading Through Change" },
    ],
    image: "/courses/complete-library.png",
    formats: ["83 video lessons", "10 PDF guides", "Stream or download"],
    includes: [
      "project-management-stack",
      "communication-stack",
      "focus-resilience-stack",
      "career-growth-stack",
    ],
    blurb:
      "Every course we've got — project management, communication, focus, and career growth. Seventeen courses, 83 video lessons, for less than the price of two.",
    description: [
      "All four course stacks in one purchase: seventeen complete video courses — 83 lessons and 10 companion PDF guides — covering project management, communication, focus and resilience, and career growth.",
      "This is the professional-skills shelf — the stuff your job assumes you already know and never taught you. Video lessons with companion PDFs throughout.",
      "Buy once and it's yours: download everything, keep it forever, and new courses added to the library are yours free.",
    ],
    bullets: [
      "All 17 courses across four stacks — 83 video lessons",
      "All 10 companion PDF guides included",
      "New courses added to the library, free",
      "Yours forever — download and keep, no subscription",
    ],
  },
  // ------------------------------- STACKS -------------------------------
  {
    slug: "business-starter-stack",
    buyUrl: "https://buy.stripe.com/bJecN55GlfBh63v25ncQU0v",
    title: "The Business Starter Stack",
    subtitle: "From your first idea to a business that runs",
    category: "stack",
    image: "/covers/business-starter-stack.png",
    price: 56,
    compareAt: 66,
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
      "Complete Business Mastery + Resource Pack + 4 audio deep-dives",
      "From Zero to Online Income + Workbook",
      "The full beginner-to-operator path, in order",
    ],
  },
  {
    slug: "clear-head-stack",
    buyUrl: "https://buy.stripe.com/8x25kD2u92OvbnPeS9cQU0o",
    title: "The Clear Head Stack",
    subtitle: "Get unstuck. Get your attention back.",
    category: "stack",
    image: "/covers/clear-head-stack.png",
    price: 49,
    compareAt: 56,
    formats: ["2 ebooks + 2 audiobooks + The Restart Kit + 3 videos"],
    includes: ["stuck-no-more", "the-digital-tapestry"],
    blurb:
      "Stuck No More to get you moving, The Digital Tapestry to take your brain back from the feed.",
    description: [
      "Two books that work on the same problem from both ends: Stuck No More rebuilds your motivation and direction, while The Digital Tapestry untangles the digital noise that drained them in the first place.",
    ],
    bullets: [
      "Stuck No More (~37,000 words of practical self-help)",
      "The Digital Tapestry (9 chapters on reclaiming your attention)",
      "Both audiobooks now included — Stuck No More and The Digital Tapestry",
      "The Restart Kit workbook — 14 worksheets + the Emergency Restart Card",
      "Price locked at purchase — future upgrades to both books are free",
    ],
  },
  {
    slug: "pennys-story-stack",
    buyUrl: "https://buy.stripe.com/8x29AT5GlfBh0Jb4dvcQU07",
    title: "Penny's Story Stack",
    subtitle: "Both Penny adventures, one bundle",
    category: "stack",
    image: "/covers/pennys-story-stack.png",
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
    buyUrl: "https://buy.stripe.com/dRmaEXfgV9cTdvXaBTcQU0w",
    title: "The Everything Stack",
    subtitle: "Every book and every audio collection",
    category: "stack",
    image: "/covers/everything-stack.png",
    price: 156,
    compareAt: 201,
    formats: ["7 books + 3 workbooks + 3 audiobooks", "Both audio collections", "Audio and video deep-dives"],
    badge: "The whole stack",
    includes: [
      "complete-business-mastery",
      "from-zero-to-online-income",
      "stuck-no-more",
      "the-digital-tapestry",
      "the-overwhelm-detox",
      "your-shit-stinks-too",
      "tapestry-debates",
      "pennys-piggy-bank",
      "princess-pennys-problem-solving-party",
    ],
    blurb:
      "Every book, every workbook, every audiobook and both audio collections — one price, and future format upgrades included.",
    description: [
      "All seven titles, all companion workbooks and resource packs, all audio — three full audiobooks, CBM's bonus deep-dives, and The Overwhelm Detox's audio and video library included. The library keeps growing and the price climbs with it: buy once, lock it in, and every future format upgrade lands in your library free.",
    ],
    bullets: [
      "All 5 adult titles + all 3 workbooks and resource packs",
      "CBM's 4 bonus audio deep-dives included",
      "Both Penny kids' books + audiobook",
      "Your Shit Stinks Too and The Tapestry Debates included in full",
      "Video courses are separate — see The Complete Course Library",
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
  courses: "Video Courses",
};
