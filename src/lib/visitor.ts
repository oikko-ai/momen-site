// An anonymous id kept in this browser, so repeat likes from one visitor are counted together
// and a visitor can continue their own chats. It names no one; the server only stores a hash of it.
export function visitorId() {
  try {
    let id = localStorage.getItem("visitor");
    if (!id) localStorage.setItem("visitor", (id = crypto.randomUUID()));
    return id;
  } catch {
    return "";
  }
}
