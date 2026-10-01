import Link from "next/link";
import { getAwards, getClients, getNotes, getPages, getPapers, getPeople, getProjects, getSite, getTestimonials } from "@/lib/cms";
import Rail from "@/components/Rail";
import WorkStrip from "@/components/WorkStrip";
import ContactForm from "@/components/ContactForm";
import Portrait from "@/components/Portrait";
import AboutPage from "./about/page";
import WorkPage from "./work/page";
import NotesPage from "./notes/page";
import NoteView from "@/components/NoteView";
import PhotosPage from "./photos/page";
import ClientsPage from "./clients/page";
import PeoplePage from "./people/page";
import ColophonPage from "./colophon/page";
import ActivityPage from "./activity/page";
import ChatPage from "./chat/page";
import ProjectView from "@/components/ProjectView";
import Preview from "@/components/Preview";
import Words from "@/components/Words";
import Available from "@/components/Available";
import Stats from "@/components/Stats";
import ClientStrip from "@/components/ClientStrip";
import Testimonials from "@/components/Testimonials";

export async function HomeView() {
  const [site, projects, pages, clients, people, notes, testimonials, papers, awards] = await Promise.all([
    getSite(),
    getProjects(),
    getPages(),
    getClients(),
    getPeople(),
    getNotes(),
    getTestimonials(),
    getPapers(),
    getAwards(),
  ]);
  const h = pages.home;
  const featured = projects.filter((p) => p.featured);
  const counts: Record<string, number> = {
    projects: projects.length,
    clients: clients.length,
    people: people.filter((p) => p.name !== site.name).length,
    notes: notes.length,
    papers: papers.length,
    awards: awards.length,
  };
  const stats = h.stats.filter((s) => counts[s.count]).map((s) => ({ value: counts[s.count], label: s.label }));
  return (
    <>
      <section className="wrap pb-block pt-page">
        <Words text={site.tagline} className="max-w-[17ch] whitespace-pre-line text-h1 font-light" />
        <div className="rise mt-8 flex flex-col items-start gap-5 md:mt-10 md:flex-row md:items-center md:gap-8" style={{ ["--i" as string]: 4 }}>
          {site.intro && <p className="max-w-[52ch] text-lead text-soft">{site.intro}</p>}
          {site.available && site.availableText && (
            <span className="shrink-0 lg:hidden">
              <Available text={site.availableText} />
            </span>
          )}
        </div>
      </section>

      <Rail items={featured} />

      {stats.length > 0 && (
        <section className="wrap mt-section">
          <Stats items={stats} />
        </section>
      )}

      <section className="wrap mt-section grid items-start gap-block md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]" data-inview>
        <Portrait src={site.portrait?.url} name={site.name} className="aspect-[4/5] w-full" />
        <div className="md:pt-4">
          <h2 className="whitespace-pre-line text-h2 font-light">{site.aboutHeading}</h2>
          <div className="mt-8 max-w-[60ch] space-y-5 text-lead text-soft">
            {site.aboutBody.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <Link href="/about" className="group mt-8 inline-flex items-center gap-2 text-body">
            <span className="u">{h.aboutLink}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </section>

      {site.approach.length > 0 && (
        <section className="wrap mt-section">
          <h2 className="text-h2 font-light" data-inview>
            {h.approachTitle}
          </h2>
          <ol className="mt-block">
            {site.approach.map((a, i) => (
              <li
                key={a.title}
                className="grid gap-3 border-t border-rule py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,4fr)_minmax(0,6fr)] md:gap-8 md:py-10"
                data-inview
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <span className="font-mono text-label text-faint">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-h3 font-light">{a.title}</h3>
                <p className="max-w-[52ch] text-lead text-soft">{a.body}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="mt-section">
        <div className="wrap flex items-baseline justify-between" data-inview>
          <h2 className="text-h2 font-light">{h.workTitle}</h2>
          <Link href="/work" className="group inline-flex items-center gap-2 text-body text-soft transition-colors hover:text-ink">
            {h.seeAllLabel} <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
        <div className="mt-block" data-inview>
          <WorkStrip items={projects} />
        </div>
      </section>

      {clients.length > 0 && (
        <section className="mt-section">
          <p className="wrap eyebrow" data-inview>
            {h.clientsTitle}
          </p>
          <div className="mt-8" data-inview>
            <ClientStrip clients={clients} />
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="wrap mt-section" data-inview>
          <Testimonials items={testimonials} title={h.testimonialsTitle} />
        </section>
      )}

      <section id="contact" className="wrap mt-section">
        <h2 className="whitespace-pre-line text-center text-h1 font-light" data-inview>
          {site.contactHeading}
        </h2>
        <div className="mx-auto mt-block max-w-[800px]" data-inview>
          <ContactForm to={site.email} />
        </div>
      </section>
    </>
  );
}

// PREVIEW=1 builds one self-contained page holding every route, switched by the URL hash.
// Used for the hosted preview, which can only serve a single page.
export default async function Home() {
  if (process.env.NEXT_PUBLIC_PREVIEW !== "1") return <HomeView />;
  const [projects, notes] = await Promise.all([getProjects(), getNotes()]);
  const views: [string, React.ReactNode][] = [
    ["/", <HomeView key="home" />],
    ["/about", <AboutPage key="about" />],
    ["/work", <WorkPage key="work" />],
    ...projects.map((p): [string, React.ReactNode] => [`/work/${p.slug}`, <ProjectView key={p.slug} slug={p.slug} />]),
    ["/notes", <NotesPage key="notes" />],
    ...notes.filter((n) => !n.href).map((n): [string, React.ReactNode] => [`/notes/${n.slug}`, <NoteView key={n.slug} slug={n.slug} />]),
    ["/photos", <PhotosPage key="photos" />],
    ["/clients", <ClientsPage key="clients" />],
    ["/people", <PeoplePage key="people" />],
    ["/colophon", <ColophonPage key="colophon" />],
    ["/activity", <ActivityPage key="activity" />],
    ["/chat", <ChatPage key="chat" />],
  ];
  return (
    <>
      <Preview />
      {views.map(([path, view]) => (
        <div key={path} data-route-view={path} hidden={path !== "/"}>
          {view}
        </div>
      ))}
    </>
  );
}
