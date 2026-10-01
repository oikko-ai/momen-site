// Starting content. It seeds the CMS on first run; after that, edit everything at /admin.
// Items marked PLACEHOLDER need real content (photos, notes) before launch.

export const me = {
  name: "Abdul Momen",
  short: "Momen",
  email: "abdulmomen.official@gmail.com",
  city: "Dhaka",
  tagline: "I build AI products that work outside the demo.",
  available: true,
  availableText: "Open to new projects",
  intro:
    "AI engineer and founder of Oikko AI. I help teams turn a promising model into a product people rely on every day.",
  socials: [
    { label: "LinkedIn", href: "https://linkedin.com/in/abdulmomen01" },
    { label: "GitHub", href: "https://github.com/AbdulMomen2" },
    { label: "Oikko AI", href: "https://www.oikkoai.com" },
  ],
};

// Header menu. Items marked "more" sit under the More button; the rest show in the bar.
export const menu = [
  { label: "Home", href: "/", more: false },
  { label: "About", href: "/about", more: false },
  { label: "Work", href: "/work", more: false },
  { label: "Notes", href: "/notes", more: false },
  { label: "Photos", href: "/photos", more: true },
  { label: "Clients", href: "/clients", more: true },
  { label: "People", href: "/people", more: true },
  { label: "Colophon", href: "/colophon", more: true },
];
export const footerLinks = [
  { label: "Activity", href: "/activity" },
  { label: "Chat", href: "/chat" },
  { label: "Colophon", href: "/colophon" },
];

export type Cover = "voice" | "grid" | "doc" | "stream" | "market" | "graph" | "ledger" | "fusion";

export type Project = {
  slug: string;
  code: string;
  title: string;
  subtitle: string;
  year: string;
  featured?: boolean;
  services: string[];
  team: string;
  cover: Cover;
  device?: "phone" | "tablet" | "laptop" | "none";
  credit?: string;
  intro: string;
  sections: { heading?: string; body?: string; cover: Cover; gallery?: GalleryItem[] }[];
  people?: string[];
  client?: string;
};
type GalleryItem = {
  cover: Cover;
  caption?: string;
  width: "full" | "twoThirds" | "half" | "third" | "quarter";
  source?: "upload" | "url" | "placeholder";
  url?: string;
  aspect?: string;
  fit?: "cover" | "contain";
  background?: "none" | "dark" | "light";
  frame?: "none" | "browser" | "phone";
  likes?: number;
};

export const projects: Project[] = [
  {
    slug: "noteai",
    client: "Genuine Technology & Research",
    code: "na",
    title: "NoteAI",
    subtitle: "Meetings that write their own follow-ups",
    year: "2025",
    featured: true,
    services: ["AI engineering", "Speech", "Backend"],
    team: "GTR product team",
    cover: "voice",
    intro:
      "A meeting assistant that joins the call, listens in Bengali and English, and hands back a summary, tasks and CRM updates before everyone has left the room.",
    device: "laptop",
    people: ["Abdul Momen", "Nadia Karim", "Rafi Hasan"],
    credit: "Built with the GTR product team. Screens shown here are placeholders until the real ones are uploaded in the CMS.",
    sections: [
      {
        heading: "Joining the call",
        body: "A bot joins Meet, Zoom or Teams and records each meeting on its own track, so nothing leaks between sessions.",
        cover: "voice",
        gallery: [
          { cover: "voice", width: "full", caption: "The assistant joins as a guest and shows everyone it is recording." },
          { cover: "grid", width: "half", caption: "Each meeting gets its own isolated recorder." },
          { cover: "stream", width: "half", caption: "Recordings land in storage the moment a call ends." },
        ],
      },
      {
        heading: "Hearing Bengali properly",
        body: "Off-the-shelf speech models struggled with Bengali, so I tuned one on speech we recorded ourselves.",
        cover: "stream",
        gallery: [
          { cover: "stream", width: "full", caption: "Transcripts switch between Bengali and English mid-sentence without losing the thread." },
          { cover: "graph", width: "half", caption: "Word error rate before and after tuning." },
          { cover: "doc", width: "half", caption: "Speaker labels a reviewer can correct in place." },
        ],
      },
      {
        heading: "From transcript to action",
        body: "An agent reads the conversation and turns it into decisions, owners and CRM entries a person can approve.",
        cover: "ledger",
        gallery: [
          { cover: "ledger", width: "full", caption: "Tasks and owners, ready to approve before they reach the CRM." },
          { cover: "fusion", width: "full", caption: "The summary arrives while people are still saying goodbye." },
        ],
      },
    ],
  },
  {
    slug: "clausis",
    client: "Clausis",
    code: "cl",
    title: "Clausis",
    subtitle: "Legal drafting you can trace back to the source",
    year: "2026",
    featured: true,
    services: ["Oikko AI", "RAG", "API design"],
    team: "Oikko AI",
    cover: "doc",
    intro:
      "For legal teams, a clever sentence is useless if nobody can prove where it came from. We built drafting where every clause points back to the document it was drawn from.",
    sections: [
      { heading: "Reading scanned files", body: "Contracts arrive as scans. The system reads them and pulls out the facts a lawyer actually needs.", cover: "doc" },
      { heading: "Every clause has a source", body: "Each generated line links to its evidence, so a reviewer can check it in one click.", cover: "graph" },
    ],
  },
  {
    slug: "chitra",
    client: "Genuine Technology & Research",
    code: "ch",
    title: "Chitra",
    subtitle: "One front door for a family of products",
    year: "2025",
    featured: true,
    services: ["Platform", "Identity", "Billing"],
    team: "GTR platform team",
    cover: "grid",
    intro:
      "Every product in the company needed sign-in, permissions and billing. Chitra gives them one shared place to get it right.",
    sections: [
      { heading: "Who can see what", body: "Access rules are set per company and per attribute, so each customer controls their own data.", cover: "grid" },
      { heading: "Plans and payments", body: "Packages, subscriptions and payments work the same way across every product.", cover: "ledger" },
    ],
  },
  {
    slug: "oikko-marketplace",
    client: "Oikko Marketplace",
    code: "om",
    title: "Oikko Marketplace",
    subtitle: "Helping local manufacturers find buyers",
    year: "2026",
    featured: true,
    services: ["Product design", "AI engineering", "Strategy"],
    team: "Oikko AI",
    cover: "market",
    device: "phone",
    people: ["Abdul Momen", "Shuvo Saha", "Apon Roy", "Arnob Dey", "Tithi Biswas"],
    intro:
      "A B2B marketplace that connects buyers with manufacturers across Bangladesh, starting with packaging, plastics, light engineering and garment accessories. Instead of chasing suppliers through phone calls and word of mouth, a buyer describes what they need and gets a short list of factories that can actually make it.",
    credit: "Demo content: the text and media on this page are samples to show the layout. Replace them in the CMS.",
    sections: [
      {
        cover: "market",
        gallery: [{ cover: "market", width: "full", aspect: "16/9", source: "url", url: "/demo/marketplace-hero.mp4", likes: 24 }],
      },
      {
        heading: "Two sides, one place",
        body: "Buyers search by what they need made, not by company name. Manufacturers describe their machines, materials and minimum orders once, and the marketplace does the matching. Both sides see the same facts, so the first conversation starts with a quote instead of a cold call.",
        cover: "market",
        gallery: [
          { cover: "grid", width: "full", aspect: "16/10", fit: "contain", background: "dark", frame: "browser", caption: "Search by product, material or process.", likes: 12 },
          { cover: "doc", width: "third", aspect: "1/1", background: "dark" },
          { cover: "ledger", width: "twoThirds", aspect: "2/1", background: "dark", caption: "A request turns into a structured brief both sides can read." },
        ],
      },
      {
        heading: "Matching that explains itself",
        body: "An AI model reads each request and each factory profile, then ranks suppliers by fit. Every match comes with its reasons, like capacity, past orders and distance, so a buyer can trust the list and a manufacturer can see why they were picked.",
        cover: "graph",
        gallery: [
          { cover: "graph", width: "full", aspect: "4/3", source: "url", url: "/demo/marketplace-matching.mp4", caption: "Requests and suppliers finding each other over a week of demo traffic.", likes: 18 },
          { cover: "stream", width: "third", aspect: "4/5" },
          { cover: "fusion", width: "third", aspect: "4/5", likes: 7 },
          { cover: "voice", width: "third", aspect: "4/5" },
        ],
      },
      {
        heading: "A factory floor in your pocket",
        body: "Most manufacturers run their business from a phone. The supplier app keeps things simple: new requests, quotes to send and orders in progress, with Bengali and English side by side.",
        cover: "grid",
        gallery: [
          { cover: "grid", width: "third", aspect: "9/16", frame: "phone", background: "dark", caption: "New requests" },
          { cover: "doc", width: "third", aspect: "9/16", frame: "phone", background: "dark", caption: "Sending a quote", likes: 10 },
          { cover: "ledger", width: "third", aspect: "9/16", frame: "phone", background: "dark", caption: "Orders in progress" },
        ],
      },
      {
        heading: "Photography",
        body: "Real factories, real people. The visual language uses workshop photography with warm light, so buyers see the hands and machines behind every listing. Photos here are placeholders until the shoot is done.",
        cover: "fusion",
        gallery: [
          { cover: "market", width: "half", aspect: "4/3" },
          { cover: "fusion", width: "half", aspect: "4/3", likes: 9 },
          { cover: "doc", width: "half", aspect: "4/3" },
          { cover: "stream", width: "half", aspect: "4/3" },
        ],
      },
    ],
  },
  {
    slug: "jogajog",
    client: "Genuine Technology & Research",
    code: "jj",
    title: "Jogajog",
    subtitle: "A CRM that retired the sales spreadsheet",
    year: "2025",
    services: ["Backend", "AI agents"],
    team: "GTR product team",
    cover: "ledger",
    intro: "A multi-tenant CRM for pipelines, contacts and companies, with agents that research prospects and draft the first email.",
    sections: [
      { heading: "Research, drafted", body: "Agents gather what a salesperson would look up by hand and prepare an outreach draft for review.", cover: "graph" },
    ],
  },
  {
    slug: "private-inference",
    code: "pi",
    title: "Private Inference",
    subtitle: "Running open models like a real service",
    year: "2025",
    services: ["LLMOps", "Open source"],
    team: "Personal project",
    cover: "stream",
    intro: "A self-hosted setup for open models with queues, usage billing, dashboards and logs, all on a single GPU.",
    sections: [
      { heading: "Watching it run", body: "Every request is queued, metered and visible on a dashboard, so problems show up before users notice.", cover: "stream" },
    ],
  },
  {
    slug: "document-search",
    code: "ds",
    title: "Document Search",
    subtitle: "Finding answers in tables and images, too",
    year: "2025",
    services: ["Retrieval", "Evaluation"],
    team: "Personal project",
    cover: "graph",
    intro: "Search over PDFs that understands text, tables and images, measured on every change instead of eyeballed.",
    sections: [
      { heading: "Measured, not guessed", body: "Each change to retrieval runs through the same evaluation set before it ships.", cover: "graph" },
    ],
  },
  {
    slug: "civa-net",
    code: "cv",
    title: "CIVA-Net",
    subtitle: "Spotting AI-generated content",
    year: "2026",
    services: ["Research"],
    team: "Solo paper, ICECTE 2026",
    cover: "fusion",
    intro: "A research model that looks at text and images together to tell whether content was made by a person or a machine.",
    sections: [
      { heading: "Two signals, one answer", body: "Attention across both kinds of input catches cues that either one misses alone.", cover: "fusion" },
    ],
  },
];

export const approach = [
  { title: "Start from the workflow", body: "I sit with the people who will use it first. The model comes second." },
  { title: "Ship something small", body: "A working slice in real hands beats a perfect plan on a slide." },
  { title: "Measure everything", body: "Traces, evals and costs are visible from day one, so we argue with data." },
  { title: "Stay after launch", body: "Real use teaches the most. I keep improving what we shipped." },
];

// Mirrors the "talks / interviews / patents / playground" rhythm of the reference, with Momen's own record.
export const papers = [
  { title: "CIVA-Net: cross-modal attention for detecting AI-generated content", venue: "ICECTE", year: "2026", status: "Accepted" },
  { title: "Reducing heuristic bias in natural language inference", venue: "IEEE QPAIN", year: "2026", status: "Under review" },
];

export const awards = [
  { title: "Silver medal", where: "World Invention Competition & Exhibition, national round", year: "2025" },
  { title: "Top 3", where: "Harvard HSIL Hackathon, Dhaka hub", year: "2025" },
  { title: "2nd runner-up", where: "AI Hackathon, BRAC University", year: "" },
];

export const playground = [
  { title: "Phone Advisor", body: "Ask about phones in plain language; an agent looks up the specs.", href: "https://github.com/AbdulMomen2/langgraph-phone-advisor" },
  { title: "Golden Cross", body: "A small trading bot that follows one simple rule, for learning.", href: "https://github.com/AbdulMomen2/golden-cross-trading-bot" },
  { title: "LangGraph, zero to advanced", body: "My notebooks from learning agent graphs, shared for others.", href: "https://github.com/AbdulMomen2/langgraph-zero-to-advance" },
];

export const clients: { name: string; note: string; tags: string[]; href?: string }[] = [
  { name: "Clausis", note: "Legal drafting with sources", tags: ["AI", "Legal"] },
  { name: "Genuine Technology & Research", note: "Enterprise AI products", tags: ["AI", "Enterprise"], href: "https://gtrbd.com" },
  { name: "Horse riding company (UK)", note: "Booking and online store", tags: ["Commerce"] },
  { name: "Oikko Marketplace", note: "B2B sourcing for manufacturers", tags: ["Marketplace"], href: "https://www.oikkoai.com/products" },
  { name: "Shadin Food", note: "Online ordering", tags: ["Commerce"] },
];

// PLACEHOLDER: add colleagues and collaborators; tags drive the filter.
export const people: { name: string; role: string; bio?: string; tags: string[]; href?: string; demo?: boolean }[] = [
  {
    name: "Abdul Momen",
    role: "Founder, AI engineer",
    bio: "Builds the AI systems behind the product, from models to the plumbing that keeps them honest.",
    tags: ["Oikko AI", "Engineering"],
    href: "https://linkedin.com/in/abdulmomen01",
  },
  { name: "Shuvo Saha", role: "Co-founder, Oikko AI", tags: ["Oikko AI", "Product"] },
  { name: "Apon Roy", role: "Co-founder, Oikko AI", tags: ["Oikko AI", "Engineering"] },
  { name: "Arnob Dey", role: "Co-founder, Oikko AI", tags: ["Oikko AI", "Engineering"] },
  { name: "Tithi Biswas", role: "Co-founder, Oikko AI", tags: ["Oikko AI", "Product"] },
  // Demo personas: sample content for the NoteAI page. Replace with the real team in the CMS.
  { name: "Nadia Karim", role: "Product designer (demo persona)", bio: "Sample persona. Shaped the meeting summary and the approval flow.", tags: ["Product"], demo: true },
  { name: "Rafi Hasan", role: "Backend engineer (demo persona)", bio: "Sample persona. Built the recording bots and the speech pipeline.", tags: ["Engineering"], demo: true },
];

export const homeAbout = {
  heading: "I help teams get AI out of the prototype and into the hands of the people it was meant for.",
  body: [
    "I'm an AI engineer and the founder of Oikko AI. Most of my days go to the unglamorous middle of AI work: shaping the problem, wiring models into real systems, and making sure the result is fast, measured and trusted.",
    "I work with enterprise teams that need something dependable, and with founders who need a builder who can move quickly without cutting the corners that matter.",
  ],
};

export const contactHeading = "Got an idea for AI?\nLet's build it.";

export const aboutPage = {
  heading: "I turn promising AI ideas into products people rely on every day.",
  body: [
    "I'm an AI engineer and the founder of Oikko AI. I grew up in Bangladesh and learned to program by breaking things until they worked. Somewhere along the way I realised the interesting part of AI isn't the model. It's everything around it that makes a person trust it.",
    "For enterprise teams, I build the systems that sit behind the demo: assistants that join meetings, search that reads contracts, and platforms that many products share. I care about the unglamorous parts, like evaluation, logging and cost, because that is where AI products succeed or quietly fail.",
    "With Oikko AI, four friends and I make software for businesses that usually get it last, starting with a marketplace for local manufacturers and legal tools that always show their sources.",
    "I work best with people who are honest about what they don't know yet and want to learn it quickly with real users. If that sounds like your team, I'd like to hear from you.",
  ],
};

// Titles and short texts for the list pages. Editable in the CMS under "Other pages".
export const pages = {
  home: {
    aboutLink: "More about me",
    approachTitle: "Approach",
    workTitle: "Selected work",
    seeAllLabel: "See all",
    clientsTitle: "Teams I've built with",
    testimonialsTitle: "Kind words",
    stats: [
      { count: "projects", label: "Projects" },
      { count: "clients", label: "Clients and partners" },
      { count: "people", label: "Collaborators" },
      { count: "notes", label: "Notes written" },
    ],
  },
  work: { title: "Work", intro: "", nextLabel: "Next project", clientLabel: "Client", relatedNotesLabel: "Writing about this" },
  notes: {
    title: "Notes",
    intro: "",
    emptyText: "The first notes are on their way.\nOn shipping AI that people trust, research, and building a company in Dhaka.",
    signupTitle: "Get new notes by email",
    signupText: "I write about AI engineering, research, and what I'm learning while building Oikko AI.",
    rssLabel: "Subscribe via RSS",
    signupPlaceholder: "Enter your email",
    signupButton: "Sign up",
    signedUpText: "Thanks, you're on the list.",
    allLabel: "All notes",
    nextLabel: "Next note",
    relatedLabel: "Related work",
  },
  photos: { title: "Photos", intro: "" },
  activity: {
    title: "Activity",
    intro: "What readers like, highlight and ask about, as it happens.",
    someoneFrom: "Someone from",
    someone: "Someone",
    times: "times",
    thisWeek: "This week",
    earlier: "Earlier",
    likedNote: "liked the note",
    likedImage: "liked an image in",
    likedVideo: "liked a video in",
    highlighted: "highlighted a passage in",
    startedChat: "started a chat",
    emptyText: "Nothing yet. Likes, highlights and chats will show up here.",
    sampleText: "Sample activity, shown until real visitors arrive.",
  },
  about: {
    title: "About",
    researchTitle: "Research",
    recognitionTitle: "Recognition",
    playgroundTitle: "Playground",
    githubLabel: "View all on GitHub",
  },
  contact: {
    toLabel: "To",
    fromLabel: "From",
    fromPlaceholder: "you@company.com",
    subjectLabel: "Subject",
    subjectPlaceholder: "What should we build?",
    messagePlaceholder: "A few lines about the product, the team and the timeline.",
    hint: "Goes straight to my inbox.",
    sendLabel: "Send",
    sendingLabel: "Sending…",
    sentText: "Thanks. I'll reply to {email}.",
    mailText: "Couldn't send from here, so your mail app should open with this draft.",
  },
  labels: {
    moreLabel: "More",
    menuLabel: "Menu",
    allLabel: "All",
    profileLabel: "Profile",
    viewProfileLabel: "View profile",
    teamLabel: "Team",
    servicesLabel: "Services",
    dateLabel: "Date",
    sampleLabel: "Sample",
    placeholderLabel: "Placeholder",
    demoPersonaLabel: "Demo persona",
    portraitPlaceholder: "Portrait placeholder",
    highlightsTitle: "Highlights",
    highlightsHint: "Select any sentence in the note to highlight it.",
    highlightsEmpty: "No highlights yet.",
    youLabel: "You",
    othersLabel: "Others",
    notFoundTitle: "Not here.",
    notFoundLink: "Back home",
  },
  clients: { title: "Clients", intro: "", visitLabel: "Visit" },
  people: { title: "People", intro: "Good work is never solo. These are the people I build with, learn from and would happily work with again.", projectsLabel: "Worked on" },
  colophon: {
    title: "Colophon",
    intro: "Built by hand, with thanks to the open-source community.",
    rows: [
      { label: "Design and words", value: "Abdul Momen" },
      { label: "Framework", value: "Next.js" },
      { label: "Content", value: "Payload CMS" },
      { label: "Styling", value: "Tailwind CSS" },
      { label: "Type", value: "Inter" },
      { label: "Covers", value: "Drawn in code" },
      { label: "Language", value: "TypeScript" },
      { label: "Made in", value: "Dhaka" },
    ],
  },
};

// PLACEHOLDER testimonials. They mark where real quotes go and are shown with a Placeholder badge.
// Replace each one with words a real client or teammate agreed to share, then untick "Placeholder".
export const testimonials: { quote: string; name: string; role: string; client?: string; project?: string }[] = [
  {
    quote: "Placeholder. A client's few sentences on what changed for their team after the work shipped, ideally with one concrete result.",
    name: "Client name",
    role: "Role, company",
    client: "Oikko Marketplace",
    project: "oikko-marketplace",
  },
  {
    quote: "Placeholder. A product lead's words on what it was like to build with Momen, and why they would do it again.",
    name: "Product lead",
    role: "Role, company",
    client: "Genuine Technology & Research",
    project: "noteai",
  },
  {
    quote: "Placeholder. A short line from a mentor, judge or collaborator who has seen Momen's work up close.",
    name: "Mentor or collaborator",
    role: "Role, organisation",
  },
];
