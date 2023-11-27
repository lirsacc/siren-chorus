import { h } from "preact";

import { useAppState } from "../state";

import ClipboardButton from "./clipboard-button";
import Editor from "./editor";
import MermaidRenderer from "./mermaid-renderer";

export default function App() {
  const state = useAppState();

  return (
    <div className="vh-100 d-flex flex-column">
      <header className="navbar-light bg-light">
        <nav className="container-fluid d-flex flex-wrap align-items-baseline justify-content-between border-bottom">
          <div className="d-flex flex-wrap py-2">
            <a href="#" className="navbar-brand fw-bold">
              SirenChorus
            </a>
          </div>
          <div className="d-flex flex-wrap py-2">
            <ClipboardButton className="font-monospace btn btn-secondary">
              {state.settings.room}
            </ClipboardButton>
          </div>
        </nav>
      </header>
      <main className="d-flex flex-fill">
        <section className="d-flex flex-column" style={{ minWidth: 480 }}>
          <div className="flex-fill">
            {state.provider ? (
              <Editor text={state.yText} provider={state.provider} />
            ) : (
              "Loading"
            )}
          </div>
        </section>
        <section className="flex-fill">
          <MermaidRenderer data={state.contents} />
        </section>
      </main>
    </div>
  );
}
