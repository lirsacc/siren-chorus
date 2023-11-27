import { useEffect, useState, useMemo, useRef } from "preact/hooks";

import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";

import { randomIshId } from "./utils";

const USER_COLOURS = [
  { bg: "#0a93af", text: "#000000" },
  { bg: "#1663d0", text: "#ffffff" },
  { bg: "#3945da", text: "#ffffff" },
  { bg: "#703bd7", text: "#ffffff" },
  { bg: "#b13bc8", text: "#ffffff" },
  { bg: "#ffe154", text: "#000000" },
  { bg: "#c7ea63", text: "#000000" },
  { bg: "#88e198", text: "#000000" },
  { bg: "#52dba3", text: "#000000" },
  { bg: "#55e0e1", text: "#000000" },
  { bg: "#4500ff", text: "#ffffff" },
  { bg: "#bd03f4", text: "#ffffff" },
  { bg: "#fc087b", text: "#000000" },
  { bg: "#ff0f08", text: "#000000" },
  { bg: "#ff7000", text: "#000000" },
];

function useStoredState(
  key: string,
  fallback: string,
): [string, (value: string) => void] {
  const stored = localStorage.getItem(key);
  const [value, setValue] = useState(stored != null ? stored : fallback);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored != null) {
      setValue(stored);
    }
  }, [key]);

  return [value, setValue];
}

export interface SettingsState {
  name: string;
  setName: (value: string) => void;
  room: string;
  setRoom: (value: string) => void;
}

export function useAppState() {
  const [contents, setContents] = useStoredState("sirenChorus:contents", "");

  const [name, setName] = useStoredState(
    "sirenChorus:name",
    `Anonymouse (${randomIshId(4)})`,
  );

  const [room, setRoom] = useStoredState("sirenChorus:room", randomIshId(20));

  // Reset colour if either room or username is changed.
  const badgeColour: { bg: string; text: string } = useMemo(
    () => USER_COLOURS[Math.round(Math.random() * 100) % USER_COLOURS.length],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [room, name],
  );

  const doc = useRef(new Y.Doc());
  const text = useRef(doc.current.getText());

  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const textString = (): string => text.current.toString();

  // useEffect(() => {
  //   console.debug("INIT", { contents, existing: textString() });
  //   if (contents && !textString()) {
  //     console.debug("INSERT");
  //     text.current.insert(0, contents);
  //   }
  // }, [contents]);

  doc.current.on("update", () => {
    setContents(textString());
  });

  const [provider, setProvider] = useState<WebrtcProvider | null>(null);

  useEffect(() => {
    if (provider?.roomName === room) {
      return;
    }

    provider?.disconnect();

    setProvider(
      new WebrtcProvider(room, doc.current, {
        // TODO: Make configurable
        signaling: ["ws://localhost:4444"],
        filterBcConns: false,
      }),
    );
  }, [room, provider]);

  useEffect(
    () =>
      provider?.awareness.setLocalStateField("user", {
        name: name,
        color: badgeColour.bg,
        colorLight: badgeColour.text,
      }),
    [provider, name, badgeColour],
  );

  return {
    yText: text.current,
    contents,
    provider,
    settings: { name, setName, room, setRoom },
  };
}
