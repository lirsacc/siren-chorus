import { h, Fragment } from "preact";

// TODO: Check about using MDX for this.
const Help = () => (
  <Fragment>
    <p className="alert alert-warning">
      🚧 This is very much a work in progress. Expect rough edges and paper
      cuts. 🚧
    </p>
    <h3 className="h5">What is this?</h3>
    <p>
      This is a collaborative live editor for{" "}
      <a href="https://mermaid.js.org">Mermaid</a> diagrams. If you don't care
      about multiplayer, the existing{" "}
      <a href="https://mermaid.live">live editor</a> is probably a better option
      for a single user.
    </p>
    <h3 className="h5">How do I collaborate?</h3>
    <ul>
      <li>
        If you share the current URL with someone you'll be able to edit the
        diagram concurrently with live rendering.
      </li>
      <li>All diagrams supported by Mermaid v10+ should be supported as is.</li>
      <li>
        There is no persistence, when the last user leaves a room the document
        will be lost. This is primarily aimed at live collaboration sessions
        after which the diagram can be copy-pasted in a document.
      </li>
    </ul>
    <h3 className="h5">Security / privacy</h3>
    <p>
      This tool currently relies on a WebSocket sharing server which sees the
      document updates. It's not recording anything but you generally shouldn't
      use it for anything sensitive.
      <br />
      Work is in progress to support peer to peer through WEB RTC and encrypted
      collaboration.
    </p>
    <hr />
    <p>
      Find more details on{" "}
      <a href="https://github.com/lirsacc/siren-chorus">GitHub</a>
    </p>
  </Fragment>
);

export default Help;
