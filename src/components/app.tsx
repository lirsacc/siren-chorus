import { h } from "preact";

export default function App() {
  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-between p-4 bg-slate-900 text-white">
        <nav className="">
          <div className="font-bold">SirenChorus</div>
        </nav>
      </header>
      <main className="flex justify-between flex-1">
        <section className="flex-1">EDIT</section>
        <section className="flex-1">SHOW</section>
      </main>
    </div>
  );
}
