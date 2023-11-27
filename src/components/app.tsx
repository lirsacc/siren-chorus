import { Fragment, h } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";

import { Session } from "../session";
import { useStoredString, randomIshId, getRandomColour } from "../utils";

import ClipboardButton from "./clipboard-button";
import Editor from "./editor";
import MermaidRenderer from "./mermaid-renderer";

export default function App({ session }: { session: Session }) {
  const [contents, setContents] = useState("");

  // TODO: Allow changing.
  const [username] = useStoredString(
    "siren-chorus:username",
    `Anonymouse (${randomIshId(4)})`,
  );

  const badgeColour = useMemo(getRandomColour, [username]);

  useEffect(() => {
    const handler = () => {
      setContents(session.contents());
    };
    session.doc.on("update", handler);
    return () => session.doc.off("update", handler);
  }, [session, setContents]);

  useEffect(() => {
    session.provider.awareness.setLocalStateField("user", {
      name: username,
      color: badgeColour.bg,
      colorLight: badgeColour.text,
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
              <button className="btn btn-default btn-sm font-monospace">
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
        <main className="d-flex flex-fill">
          <section className="d-flex flex-column" style={{ minWidth: 480 }}>
            <div className="flex-fill">
              {session.provider ? (
                <Editor text={session.text} provider={session.provider} />
              ) : (
                "Loading"
              )}
            </div>
          </section>
          <section className="flex-fill">
            <MermaidRenderer data={contents} />
          </section>
        </main>
      </div>
    </Fragment>
  );
}
