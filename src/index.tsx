import { h, render } from "preact";

import mermaid from "mermaid";

import App from "./components/app";
import { getSessionFromURL } from "./session";

function init(fn: () => Promise<void>) {
  if (document.readyState !== "loading") {
    void fn();
  } else {
    document.addEventListener("DOMContentLoaded", () => void fn());
  }
}

declare const process: {
  env: {
    NODE_ENV: "development" | "production";
  };
};

const developmentSetup = async () => {
  if (process.env.NODE_ENV === "development") {
    await import("preact/devtools");
  }
  localStorage.log = "true";
};

init(async () => {
  await developmentSetup();
  mermaid.initialize({ startOnLoad: false, securityLevel: "antiscript" });
  const session = getSessionFromURL();
  render(<App session={session} />, document.body);
});
