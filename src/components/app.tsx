import { h } from "preact";
import { useState } from "preact/hooks";

import Editor from "./editor";
import MermaidRenderer from "./mermaid-renderer";

export default function App() {
  const [contents, setContents] = useState("");

  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-between p-4 bg-slate-900 text-white">
        <nav className="">
          <div className="font-bold">SirenChorus</div>
        </nav>
      </header>
      <main className="flex justify-between flex-1">
        <section className="flex flex-col w-auto" style={{ minWidth: 480 }}>
          <div className="flex-1">
            <Editor onUpdate={setContents} />
          </div>
        </section>
        <section className="flex-1">
          <MermaidRenderer data={contents} />
        </section>
      </main>
    </div>
  );
}
