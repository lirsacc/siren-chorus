import { WebrtcProvider } from "y-webrtc";
import { WebsocketProvider } from "y-websocket";
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

// TODO: Make this configurable.
export function getServerURL(): string {
  const url = new URL(window.location.href);
  if (process.env.WS_PORT) {
    url.port = process.env.WS_PORT;
  }
  const scheme = url.protocol.includes("https") ? "wss" : "ws";
  return `${scheme}://${url.host}`;
}

const MODE: "rtc" | "ws" = "ws";

export type Provider = WebsocketProvider | WebrtcProvider;

export class Session {
  room: string;
  password: string;
  doc: Y.Doc;
  text: Y.Text;
  provider: Provider;

  constructor(room: string, password: string) {
    this.room = room;
    this.password = password;
    this.doc = new Y.Doc();
    this.text = this.doc.getText();

    if (MODE == "ws") {
      this.provider = new WebsocketProvider(
        getServerURL(),
        this.room,
        this.doc,
      );
    } else {
      this.provider = new WebrtcProvider(room, this.doc, {
        signaling: [getServerURL()],
        filterBcConns: false,
        password: password,
      });
    }
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
