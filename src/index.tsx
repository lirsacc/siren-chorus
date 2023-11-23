import { h, render } from "preact";

import App from "./components/app";

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
};

init(async () => {
  await developmentSetup();
  render(<App />, document.body);
});
