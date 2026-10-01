import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { getChat, getConversations, getPages, getSite } from "@/lib/cms";
import ChatApp from "./ChatApp";

export async function generateMetadata(): Promise<Metadata> {
  const [chat, site] = await Promise.all([getChat(), getSite()]);
  return pageMeta({ title: chat.chatLabel, description: `Ask an AI that knows ${site.name}'s work, projects and notes. ${chat.greeting}`, path: "/chat", seo: chat.seo });
}

export default async function ChatPage() {
  const [settings, conversations, site, pages] = await Promise.all([getChat(), getConversations(), getSite(), getPages()]);
  return <ChatApp settings={settings} initial={settings.showConversations ? conversations : []} owner={{ name: site.name, portrait: site.portrait?.url }} nav={site.menu.filter((n) => !n.more)} sampleLabel={pages.labels.sampleLabel} />;
}
