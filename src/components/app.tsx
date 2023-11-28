import { Fragment, h } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";

import { Session } from "../session";
import { useStoredString, getRandomColour, randomName } from "../utils";

import Editor from "./editor";
import Header from "./header";
import MermaidRenderer from "./mermaid-renderer";
import Resizable from "./resizable";

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
        <Header session={session} />
        <div className="h-100 flex-fill d-flex">
          <Resizable initialWidth={460} minWidth={200}>
            <div className="h-100 overflow-auto">
              {session.provider ? (
                <Editor text={session.text} provider={session.provider} />
              ) : (
                "Loading"
              )}
            </div>
          </Resizable>
          <div className="flex-fill">
            {<MermaidRenderer enableZoom showZoomControls data={contents} />}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
