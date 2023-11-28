import { Fragment, h } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";

import { Session } from "../session";
import { useStoredString, getRandomColour, randomName } from "../utils";

import ClipboardButton from "./clipboard-button";
import Editor from "./editor";
import MermaidRenderer from "./mermaid-renderer";

export default function App({ session }: { session: Session }) {
  const [contents, setContents] = useState("");

  // TODO: Allow changing.
  const [username] = useStoredString("username", randomName());

  const badgeColour = useMemo(getRandomColour, [username]);

  useEffect(() => {
    const handler = () => {
      setContents(session.contents());
    };
    handler();
    session.doc.on("update", handler);
    return () => session.doc.off("update", handler);
  }, [session, setContents]);

  useEffect(() => {
    session.provider.awareness.setLocalStateField("user", {
      name: username,
      color: badgeColour.color,
      colorLight: badgeColour.light,
    });
  }, [username, badgeColour, session]);

  return (
    <Fragment>
      <div className="vh-100 d-flex flex-column">
        <header className="navbar-light bg-light">
          <nav className="container-fluid d-flex flex-wrap align-items-baseline justify-content-between border-bottom">
            <div className="d-flex flex-wrap py-2">
              <a href="#" className="navbar-brand fw-bold">
                SirenChorus
              </a>
            </div>
            <div className="d-flex flex-wrap py-2">
              <button className="btn btn-default btn-sm font-monospace me-2">
                {session.room}
              </button>
              <ClipboardButton
                getContents={() => session.url().toString()}
                className="btn btn-primary btn-sm me-2"
              >
                Copy session URL
              </ClipboardButton>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => session.refresh()}
              >
                New session
              </button>
            </div>
          </nav>
        </header>
        <main className="d-flex h-100 flex-fill">
          <section style={{ width: 480 }}>
            <div className="border-end h-100 overflow-auto">
              {session.provider ? (
                <Editor text={session.text} provider={session.provider} />
              ) : (
                "Loading"
              )}
            </div>
          </section>
          <section className="flex-fill">
            <div className="h-100">
              <MermaidRenderer enableZoom showZoomControls data={contents} />
            </div>
          </section>
        </main>
      </div>
    </Fragment>
  );
}
