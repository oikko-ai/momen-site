import type { Metadata } from "next";
import { getChat, getConversations, getSite } from "@/lib/cms";
import { nav } from "@/content";
import ChatApp from "./ChatApp";

export const metadata: Metadata = { title: "Chat" };

export default async function ChatPage() {
  const [settings, conversations, site] = await Promise.all([getChat(), getConversations(), getSite()]);
  return <ChatApp settings={settings} initial={settings.showConversations ? conversations : []} owner={{ name: site.name, portrait: site.portrait?.url }} nav={nav} />;
}
