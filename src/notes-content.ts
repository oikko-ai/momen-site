// Demo notes written as sample content in Momen's voice. Replace or edit them in the CMS.
// Body lines: "## " heading, "> " quote, "- " list item, "[media](url|caption|wide)" image or video, anything else a paragraph.
// *text* is italic and **text** is bold.

export type StartNote = {
  title: string;
  slug: string;
  date: string;
  summary: string;
  likes: number;
  views: number;
  highlights: { text: string; count: number }[];
  projects?: string[];
  body: string[];
};

export const startNotes: StartNote[] = [
  {
    title: "Evals before features",
    slug: "evals-before-features",
    date: "2026-09-18",
    summary: "Why the first thing I build on an AI project is the test, not the feature.",
    likes: 64,
    views: 512,
    highlights: [
      { text: "A demo proves that something can work once. An eval tells you how often it works", count: 14 },
      { text: "the number that goes up when the product gets better", count: 6 },
    ],
    body: [
      "Every AI project I join starts the same way. Someone shows a demo that looks magical, everyone gets excited, and the next three months go into making the magic happen on purpose. The demo was never the hard part.",
      "A demo proves that something can work once. An eval tells you how often it works, for whom, and when it quietly fails. Until you have the second, you are guessing, and guessing gets expensive once real people depend on the answer.",
      "## Start with fifty examples",
      "The first thing I write on a new project is not a prompt. It is a small set of real inputs with the answers a careful person would give. Fifty is enough to start. They come from the people who will use the product, not from my imagination, because my imagination is much kinder to the model than reality is.",
      "Then I write the simplest possible check for each one. Sometimes it is an exact match. Sometimes it is a rubric another model grades. Sometimes it is a human with a spreadsheet for an afternoon. The method matters less than having one number that goes up when the product gets better.",
      "> If you can't tell whether yesterday's change made things better, you are not iterating. You are wandering.",
      "## What it changes",
      "With evals in place, arguments get shorter. A new model comes out and we know within an hour whether it helps. A clever prompt trick either moves the number or it doesn't. Cost and speed sit on the same dashboard, so we stop paying for quality nobody can see.",
      "It also changes what I say to clients. Instead of promising that the assistant is accurate, I can show them where it is accurate, where it isn't yet, and what we are doing about the gap. That conversation builds more trust than any demo.",
      "The features still come. They just arrive on top of something we can measure, which means they stay working after the excitement wears off.",
    ],
  },
  {
    title: "Teaching a model to hear Bengali",
    slug: "teaching-a-model-to-hear-bengali",
    projects: ["noteai"],
    date: "2026-07-02",
    summary: "What speech recognition taught me about data, accents and humility.",
    likes: 41,
    views: 388,
    highlights: [{ text: "the model was not bad at Bengali. It was bad at us", count: 9 }],
    body: [
      "When we started building a meeting assistant, the plan assumed speech recognition was a solved problem. For English, mostly, it is. For the way people in Dhaka actually talk in meetings, switching between Bengali and English inside a single sentence, it was not.",
      "The first transcripts were humbling. Names turned into random words, numbers drifted, and whole sentences vanished whenever someone switched languages. After a week of reading them, I realised the model was not bad at Bengali. It was bad at us: our accents, our office vocabulary, our habit of mixing languages without noticing.",
      "[media](/demo/note-speech.jpg|Placeholder image. Replace it with a real screenshot or photo in the CMS.|wide)",
      "## Recording our own data",
      "So we recorded our own. Colleagues read scripts, then had ordinary conversations, then argued about lunch. Every clip was checked by a person. It was slow, and it was the most valuable thing we did on the project.",
      "- Short clips beat long ones, because mistakes are easier to find and fix.",
      "- Variety of speakers mattered more than hours of audio.",
      "- The test set came from different people than the training set, always.",
      "## The humble part",
      "Tuning the model on that data made a big difference, but the bigger lesson was about attitude. A model trained on the world's data still needs to be introduced to your corner of it. The teams that do well with AI are the ones willing to sit down and do that introduction carefully.",
    ],
  },
  {
    title: "Why we built Oikko AI together",
    slug: "why-we-built-oikko-ai-together",
    projects: ["oikko-marketplace"],
    date: "2026-05-11",
    summary: "On starting a company with friends, and building for businesses that usually get software last.",
    likes: 87,
    views: 703,
    highlights: [
      { text: "the businesses that keep a country running are often the last to get good software", count: 21 },
      { text: "Friendship is not a business plan, but it is a very good way to survive one.", count: 11 },
    ],
    body: [
      "Oikko means unity. We picked the name before we had a product, because it described the one thing we were sure about: we wanted to build this together.",
      "In Bangladesh, the businesses that keep a country running are often the last to get good software. Small manufacturers, workshops and suppliers run on phone calls, paper and trust. They are not short of skill. They are short of tools built for the way they actually work.",
      "## Starting with a marketplace",
      "Our first product connects buyers with local manufacturers. It sounds simple, and the hard part is everything around the match: understanding what a buyer really needs, knowing what a factory can really make, and helping both sides trust a stranger enough to start.",
      "AI helps with the reading and the ranking. People still make the decisions, and the product is designed so they can see why a match was suggested.",
      "> Build for the person who will use it on a busy afternoon, not for the person watching the demo.",
      "## Working with friends",
      "People warned us about starting a company with friends. They were right that it is hard. Disagreements feel personal and there is nowhere to hide. But we also get to be honest with each other faster than most teams ever do. Friendship is not a business plan, but it is a very good way to survive one.",
    ],
  },
  {
    title: "Sources or it didn't happen",
    slug: "sources-or-it-didnt-happen",
    projects: ["clausis"],
    date: "2026-02-20",
    summary: "Building AI drafting that legal teams can check in one click.",
    likes: 38,
    views: 296,
    highlights: [{ text: "a clever sentence is worthless if nobody can say where it came from", count: 8 }],
    body: [
      "In legal work, a clever sentence is worthless if nobody can say where it came from. That one idea shaped everything we built for drafting.",
      "Every generated clause carries a link to the passage it was based on. A reviewer clicks once and sees the source. If there is no source, the system says so instead of inventing one.",
      "[media](/demo/marketplace-matching.mp4|Demo video placeholder. Swap in a screen recording from the CMS.|text)",
      "The surprising part was how much the links changed behaviour. Lawyers who did not trust AI started using it, not because it got smarter, but because checking it became cheap.",
    ],
  },
  {
    title: "The boring parts are the product",
    slug: "the-boring-parts-are-the-product",
    projects: ["private-inference"],
    date: "2025-11-04",
    summary: "Logging, cost and latency decide whether an AI feature survives.",
    likes: 29,
    views: 241,
    highlights: [],
    body: [
      "Nobody shows logging in a launch video. Yet most AI features I have seen fail did not fail because the model was wrong. They failed because nobody noticed when it started being wrong, or because each answer quietly cost more than it earned.",
      "## Three questions before launch",
      "- Can we see every request and answer, with the version of the prompt that produced it?",
      "- Do we know what one answer costs, and what it will cost at ten times the traffic?",
      "- Is it fast enough that people wait for it instead of working around it?",
      "If any answer is no, the feature is not ready, however good the demo looks.",
    ],
  },
  {
    title: "What a weekend hackathon teaches",
    slug: "what-a-weekend-hackathon-teaches",
    date: "2025-04-27",
    summary: "Small notes on building something useful in forty-eight hours.",
    likes: 22,
    views: 187,
    highlights: [],
    body: [
      "Hackathons reward the same thing real projects do, just faster: picking one problem small enough to finish and talking to the people who have it.",
      "The teams that do well rarely have the most advanced model. They have the clearest story about who they are helping and a demo that works every time they press the button.",
      "> Scope is a feature. Cut until it fits, then cut once more.",
    ],
  },
];
