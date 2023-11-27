import { h } from "preact";

import { useAppState } from "../state";

import ClipboardButton from "./clipboard-button";
import Editor from "./editor";
import MermaidRenderer from "./mermaid-renderer";

export default function App() {
  const state = useAppState();

  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-between p-4 bg-slate-900 text-white items-baseline">
        <nav>
          <div className="font-bold">SirenChorus</div>
        </nav>
        <div>
          <ClipboardButton className="font-mono rounded-full bg-slate-700 hover:bg-slate-500 py-2 px-4">
            {state.settings.room}
          </ClipboardButton>
        </div>
      </header>
      <main className="flex justify-between flex-1">
        <section className="flex flex-col w-auto" style={{ minWidth: 480 }}>
          <div className="flex-1">
            {state.provider ? (
              <Editor text={state.yText} provider={state.provider} />
            ) : (
              "Loading"
            )}
          </div>
        </section>
        <section className="flex-1">
          <MermaidRenderer data={state.contents} />
        </section>
      </main>
    </div>
  );
}
