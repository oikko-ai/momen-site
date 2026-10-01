import Link from "next/link";
import { getNotes, getProjects, getSite } from "@/lib/cms";
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
import ProjectView from "@/components/ProjectView";
import Preview from "@/components/Preview";

export async function HomeView() {
  const [site, projects] = await Promise.all([getSite(), getProjects()]);
  const featured = projects.filter((p) => p.featured);
  return (
    <>
      <section className="px-5 pb-14 pt-16 md:px-7 md:pb-20 md:pt-24">
        <h1 className="rise max-w-[20ch] whitespace-pre-line text-[44px] font-light leading-[1.06] tracking-[-0.03em] md:text-[76px]">{site.tagline}</h1>
      </section>

      <Rail items={featured} />

      <div className="mx-auto max-w-[1200px] px-5 md:px-7">
        <section className="mt-32 grid items-start gap-10 md:grid-cols-[minmax(0,480px)_1fr] md:gap-16" data-inview>
          <Portrait src={site.portrait?.url} className="aspect-[4/5] w-full" />
          <div>
            <h2 className="whitespace-pre-line text-[34px] font-light leading-[1.12] tracking-[-0.02em] md:text-[46px]">{site.aboutHeading}</h2>
            <div className="mt-7 space-y-5 text-[18px] leading-relaxed text-soft md:text-[21px]">
              {site.aboutBody.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <Link href="/about" className="mt-7 inline-block text-[16px] text-soft transition-colors hover:text-ink">
              Read more →
            </Link>
          </div>
        </section>

        {site.approach.length > 0 && (
          <section className="mt-32">
            <h2 className="text-[34px] font-light tracking-[-0.02em] md:text-[52px]" data-inview>
              Approach
            </h2>
            <ol className="mt-8">
              {site.approach.map((a, i) => (
                <li
                  key={a.title}
                  className="grid gap-2 border-t border-rule py-8 md:grid-cols-[40px_320px_1fr] md:gap-6"
                  data-inview
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <span className="text-[16px] text-faint">{i + 1}</span>
                  <h3 className="text-[22px] font-light md:text-[26px]">{a.title}</h3>
                  <p className="text-[18px] leading-relaxed text-soft md:text-[20px]">{a.body}</p>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>

      <section className="mt-32">
        <div className="mx-auto flex max-w-[1200px] items-baseline justify-between px-5 md:px-7" data-inview>
          <h2 className="text-[34px] font-light tracking-[-0.02em] md:text-[52px]">Work</h2>
          <Link href="/work" className="text-[16px] text-soft hover:text-ink">
            See all →
          </Link>
        </div>
        <div className="mt-8" data-inview>
          <WorkStrip items={projects} />
        </div>
      </section>

      <section id="contact" className="mx-auto mt-40 max-w-[760px] px-5 text-center">
        <h2 className="whitespace-pre-line text-[40px] font-light leading-[1.08] tracking-[-0.03em] md:text-[64px]" data-inview>
          {site.contactHeading}
        </h2>
        <div className="mt-10 text-left" data-inview>
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
