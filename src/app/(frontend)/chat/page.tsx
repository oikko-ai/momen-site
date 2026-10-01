import type { Metadata } from "next";
import { getChat, getConversations, getPages, getSite } from "@/lib/cms";
import ChatApp from "./ChatApp";

export const metadata: Metadata = { title: "Chat" };

export default async function ChatPage() {
  const [settings, conversations, site, pages] = await Promise.all([getChat(), getConversations(), getSite(), getPages()]);
  return <ChatApp settings={settings} initial={settings.showConversations ? conversations : []} owner={{ name: site.name, portrait: site.portrait?.url }} nav={site.menu.filter((n) => !n.more)} sampleLabel={pages.labels.sampleLabel} />;
}
