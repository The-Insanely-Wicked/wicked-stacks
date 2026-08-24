// ---------------------------------------------------------------------------
// Wicked Stacks blog. One place to edit every post.
//
// Body lines starting with "## " render as subheadings; everything else is a
// paragraph. Each post points at one product (its CTA box) via productSlug.
// ---------------------------------------------------------------------------

export interface Post {
  slug: string;
  title: string;
  date: string; // ISO, used for sorting + display
  category: string;
  excerpt: string;
  body: string[];
  productSlug: string; // CTA at the end of the post
  videoUrl?: string; // optional YouTube link featured in the post
}

export const POSTS: Post[] = [
  {
    slug: "why-motivation-follows-action",
    title: "Why Motivation Follows Action (Not the Other Way Around)",
    date: "2026-08-21",
    category: "Mind & Life",
    excerpt:
      "You're waiting to feel like it. You're going to be waiting forever — because the feeling shows up AFTER you start, not before.",
    body: [
      "Here's the lie almost everybody believes: first you get motivated, then you take action. So you wait. You watch the videos, you make the vision board, you psych yourself up — and maybe you feel a little surge. Then the surge fades, because feelings fade, and you're right back on the couch wondering what's wrong with you.",
      "Nothing is wrong with you. You've just got the machine backwards.",
      "## Action first, feeling second",
      "Motivation is not a prerequisite. It's a result. You don't feel like going for a run and then go — you go, and somewhere around the corner your body says, huh, this isn't terrible, and the next run gets easier to start. You don't wait for inspiration to write; you write a bad paragraph, and the act of writing shakes the next one loose.",
      "Waiting to feel like it is like waiting for perfect weather before starting a journey. Some days the weather never comes. You go anyway, or you don't go at all.",
      "## Make the first step insultingly small",
      "The trick that actually works is shrinking the first action until it's too small to argue with. Not \"work out\" — put on the shoes. Not \"clean the house\" — carry one cup to the sink. Not \"fix my life\" — drink a glass of water and make the bed. Your brain can talk you out of a transformation. It cannot be bothered to talk you out of a glass of water.",
      "Small actions don't feel like they count. They count double. Every one is a vote for the version of you that follows through, and enough votes change the election.",
      "This is one idea out of fourteen chapters on getting unstuck — the shame spirals, the harsh inner voice, the routines that hold when everything else falls apart. If you've been stalled longer than you'd like to admit, the whole map is in the book.",
    ],
    productSlug: "stuck-no-more",
  },
  {
    slug: "four-funding-paths-and-founder-psychology",
    title: "The Four Ways to Fund a Business — and What Each One Does to Your Head",
    date: "2026-08-21",
    category: "Business",
    excerpt:
      "Bootstrapping, borrowing, investors, or customers — where the money comes from changes what you build AND who you become while building it.",
    body: [
      "Ask most people how to fund a business and they'll talk spreadsheets: interest rates, equity percentages, runway. All real. All secondary. The first-order effect of funding isn't financial — it's psychological. Where your money comes from decides who you answer to, what you're afraid of, and what \"success\" is even allowed to mean.",
      "## The four paths, honestly",
      "Bootstrapping keeps you free and keeps you scared — every decision is your money burning. Debt buys speed and sells sleep; the bank doesn't care that you had a slow quarter. Investors hand you fuel and take the steering wheel's margins — you now run a company that must grow, whether or not growing serves you. And funding from customers — actually selling things early — is the slowest-looking path that's secretly the fastest, because every dollar arrives attached to proof that somebody wants what you make.",
      "There's no universally right answer. There is a right answer for your situation, your risk tolerance, and your head. Choosing without knowing yourself is how rational people end up making destructive decisions.",
      "## Hear it argued out loud",
      "I put out a free 12-minute audio deep-dive on exactly this — Four Funding Paths and Founder Psychology — built from the book. Listen on the way to work and you'll know which path fits you by the time you park.",
      "The full book goes a lot further: market sizing three ways, unit economics with the math shown, sales systems, hiring, automation ROI — seventeen chapters, plus the Resource Pack of templates and four bonus audio deep-dives now included.",
    ],
    productSlug: "complete-business-mastery",
    videoUrl: "https://youtu.be/9HCru9FA6VE",
  },
  {
    slug: "how-algorithms-decide-what-you-see",
    title: "How Algorithms Decide What You See (and What That's Costing You)",
    date: "2026-08-21",
    category: "Mind & Life",
    excerpt:
      "Your feed isn't a window into the world. It's a mirror maze built by a machine whose only job is keeping you inside it.",
    body: [
      "Nobody sat you down and asked what you wanted to care about this year. A recommendation system decided, one scroll at a time, by watching what makes you pause, what makes you mad, and what makes you stay. The feed isn't showing you the world — it's showing you whatever keeps you looking at the feed.",
      "## The machine isn't evil. It's obedient.",
      "That's the uncomfortable part. The algorithm isn't out to get you; it's out to serve its actual customer, and its actual customer is the advertiser buying your attention. You're not being persecuted. You're being farmed — politely, efficiently, and with your own enthusiastic participation every time you open the app \"for a second.\"",
      "The costs show up quietly: opinions you absorbed instead of formed, hours that evaporated without memories, a low hum of comparison that makes your real life feel like the off-brand version of everyone else's highlight reel.",
      "## Using it without being used",
      "The answer isn't throwing your phone in a lake. It's understanding the machine well enough that you stop being its raw material — knowing why the feed shows you what it shows you, and choosing on purpose instead of scrolling on autopilot. Attention is the only currency you can't earn back. Spend it like that's true.",
      "The Digital Tapestry digs through all of it — the history, the psychology, the influencer economy, the misinformation machinery — sharp and funny instead of preachy, with the full audiobook included so you can take your brain back on your commute.",
    ],
    productSlug: "the-digital-tapestry",
  },
  {
    slug: "the-50-true-fans-math",
    title: "The 50 True Fans Math: Why You Don't Need to Go Viral",
    date: "2026-08-21",
    category: "Business",
    excerpt:
      "You don't need a million followers. You need fifty people who genuinely want what you make. Here's the arithmetic nobody shows you.",
    body: [
      "Every beginner thinks the goal is going viral. A million views, a flood of customers, the screenshot income. And because that's the goal, most people never start — a million of anything sounds impossible from zero, because it is.",
      "So run the real numbers instead. Say you make something genuinely useful and price it at $20. Fifty true fans — fifty actual humans who trust you — is $1,000. A hundred is $2,000. A product a season and a slowly growing list of people who like your work beats a lottery ticket every single time, because it compounds and lottery tickets don't.",
      "## Where the first fifty come from",
      "Not from ads. Not from hacks. From being findable and being useful: answering real questions where your people already gather, publishing things worth reading, and asking for the sale plainly when you've earned the right. It's slower than the guru promises and faster than staying stuck at zero forever.",
      "## The honest path",
      "From Zero to Online Income is the no-hype version of this whole journey — thirteen chapters from picking an idea you can actually execute to your first sales without an audience, with a workbook that turns each chapter into something you did instead of something you read. No rented Lamborghinis anywhere in it.",
    ],
    productSlug: "from-zero-to-online-income",
  },
  {
    slug: "teaching-kids-money-without-making-it-weird",
    title: "Teaching Kids About Money Without Making It Weird",
    date: "2026-08-21",
    category: "Kids' Corner",
    excerpt:
      "Kids learn money habits by age seven — mostly by watching you. Here's how to make the lessons stick without a single lecture.",
    body: [
      "Researchers say most kids have their core money habits by around age seven. Which is inconvenient, because most parents plan to have \"the money talk\" sometime around never. The good news: kids don't need a lecture. They need a story, a jar, and a grown-up who doesn't panic when they ask what a credit card is.",
      "## Three jars beat one piggy bank",
      "Save, spend, share. When money comes in — birthday, allowance, tooth fairy — it gets split. The split is the lesson: money isn't one thing you hoard or blow, it's a resource you direct. A five-year-old who divides three dollars into jars is doing the same thing a CFO does with a budget, just with stickier hands.",
      "## Let them buy the wrong thing",
      "The five-dollar toy that breaks in an hour teaches more than any speech. Small regrets now are cheap tuition; the same lesson at 25 costs a credit score. Your job isn't preventing every bad purchase — it's making sure the first ones are small and the conversation afterward is kind.",
      "And stories do the heavy lifting best. Penny's Piggy Bank walks little ones through saving, sharing, and smart choices inside a warm, giggly story — with the professionally narrated audiobook included, for car rides and bedtimes when your voice is spent. Read it together; the jars will make sense on their own.",
    ],
    productSlug: "pennys-piggy-bank",
  },
  {
    slug: "nobody-gets-the-high-horse",
    title: "Nobody Gets the High Horse: What My Dog Taught Me About Judgment",
    date: "2026-08-21",
    category: "Mind & Life",
    excerpt:
      "My dog Frankie has never once judged another dog. Humans can't get through breakfast without judging somebody. That gap is the whole story.",
    body: [
      "Frankie — my dog, co-host, and the only member of this household with the moral high ground — has never once judged another dog for how it eats, where it sleeps, or what it rolls in. Humans? We judge strangers in traffic, relatives at dinner, and ourselves in the mirror, all before lunch.",
      "That gap between dog logic and human moralizing is where Your Shit Stinks Too lives. It started as a podcast, me and Frankie, about the one thing people hate admitting: everybody's shit stinks. Including mine. Especially mine. The high horse everyone's trying to ride doesn't actually exist — there's just people standing in the same mess, pointing at each other's shoes.",
      "## Why judgment feels so good (and costs so much)",
      "Judging is cheap superiority. For one free moment, you're the better person — no effort required. But the habit corrodes: it makes honesty with yourself impossible, because the judge can never afford to be a defendant. The people who grow are the ones who can say \"I do that too\" without flinching.",
      "## Start with the free episode",
      "The trailer episode — Frankie's Food Bowl: Dog Logic vs. Human Moralizing — is free on YouTube, four minutes, and it'll tell you whether this series is your kind of uncomfortable. The full collection is about two hours of deep-dives, twelve bucks, price locked forever, and every new episode I make gets added free.",
    ],
    productSlug: "your-shit-stinks-too",
    videoUrl: "https://youtu.be/cyz0DfuaF0k",
  },
  {
    slug: "when-a-kid-says-i-cant-do-it",
    title: "When a Kid Says \"I Can't Do It\"",
    date: "2026-08-24",
    category: "Kids' Corner",
    excerpt:
      "It's almost never about the thing they're looking at. It's about the size of it — and size is the one part you can actually fix.",
    body: [
      "A kid stares at a jigsaw puzzle, a messy bedroom, or a page of homework, and out it comes: I can't do it. Said flatly, like a fact about the world. And the reflex — every parent has it — is to argue. Yes you can. It's easy. You did one just like it last week.",
      "That argument has never worked in the history of children, and there's a reason. You're disagreeing with the wrong sentence.",
      "## They're not describing ability. They're describing size.",
      "What a kid means by \"I can't do it\" is almost never a verdict on their own competence. It's a description of what's in front of them. The thing looks big. It has no edges they can find. There's no obvious place to put a hand.",
      "Adults get this feeling too — we just have politer words for it. We say a project is overwhelming, or that we don't know where to start, or we quietly do something else for three days. Nobody thinks less of us for it. A seven-year-old says the shorter version and gets told they're being difficult.",
      "So arguing about whether they *can* misses it entirely. They're not wrong about being stuck. They're wrong about why.",
      "## The only useful question",
      "Instead of \"yes you can,\" try: what's the very first small piece?",
      "Not the plan. Not the whole approach. One piece, small enough to be boring. For the puzzle: find all the flat edges. For the bedroom: everything that's a book goes on the bed. For the homework: read just the first question out loud, don't answer it yet.",
      "What happens next is the part worth watching. The kid does the boring small thing — and the big thing quietly gets smaller. Not because you gave a speech about perseverance, but because it now has an edge they can hold onto.",
      "Do that four or five times and something better than a tidy bedroom happens: they start doing it without you. You've handed over a move they can make on their own, which is the whole job.",
      "## Don't take the pencil",
      "The hard part isn't the technique. It's sitting on your hands.",
      "When a kid is stuck and you're tired, doing it yourself takes ninety seconds and doing it their way takes twenty minutes. Every parent has made that trade, and sometimes it's the right one — dinner is burning, you have to leave, fine.",
      "But the twenty-minute version is where the learning is. If you always take the pencil, the lesson they get isn't \"puzzles are doable.\" It's \"when things get hard, someone else finishes them.\" That one is expensive later.",
      "## Say the word out loud",
      "One small addition that costs nothing: name it while it's happening. \"That was a big problem, so you made it into small ones.\"",
      "Kids can do a thing long before they can describe it, and the describing is what makes it portable. A kid who can say what they did to the puzzle has a chance of doing it to a school project in four years. A kid who just got a tidy room has a tidy room.",
      "That's the whole idea behind Princess Penny's Problem-Solving Party — a big problem shows up, everybody panics for a page, and then Penny does the unglamorous thing and cuts it into pieces small enough to carry. It's a story rather than a lesson, which is the only way this goes down at bedtime. Read it a few times and the phrase starts coming out of them instead of you.",
    ],
    productSlug: "princess-pennys-problem-solving-party",
  },
];

export const postBySlug = (slug: string) => POSTS.find((p) => p.slug === slug);

export const sortedPosts = () =>
  [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
