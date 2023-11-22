import { h, render } from "preact";

import App from "./components/app";

function init(fn: () => void) {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

init(() => render(<App />, document.body));
