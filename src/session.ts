import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";

import { randomIshId } from "./utils";

export function resetSession(
  room: string | null = null,
  password: string | null = null,
) {
  const newRoom = room || randomIshId(20);
  const newPassword = password || randomIshId(20);
  const url = getRoomURL(newRoom, newPassword);
  window.location.href = url.toString();
}

function getRoomURL(room: string, password: string): URL {
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("room", room);
  url.searchParams.set("password", password);
  return url;
}

export function getRoomAndPasswordFromURL(): [string, string] {
  const params = new URLSearchParams(window.location.search);
  const room = params.get("room");
  const password = params.get("password");
  if (!room || !password) {
    resetSession(room, password);
  }
  return [room || "", password || ""];
}

export function getSessionFromURL(): Session {
  const [room, password] = getRoomAndPasswordFromURL();
  return new Session(room, password);
}

export function getSignalingServerURL(): string {
  const url = new URL(window.location.href);
  url.port = "4444";
  return `ws://${url.host}`;
}

export class Session {
  room: string;
  password: string;
  doc: Y.Doc;
  text: Y.Text;
  provider: WebrtcProvider;

  constructor(room: string, password: string) {
    this.room = room;
    this.password = password;
    this.doc = new Y.Doc();
    this.text = this.doc.getText();

    this.provider = new WebrtcProvider(room, this.doc, {
      // TODO: Make configurable
      signaling: [getSignalingServerURL()],
      filterBcConns: false,
      password: password,
    });
  }

  contents(): string {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return this.text.toString();
  }

  url(): URL {
    return getRoomURL(this.room, this.password);
  }

  refresh(): void {
    resetSession();
  }
}
