import { h } from "preact";

import { Session } from "../session";

import ClipboardButton from "./clipboard-button";

const Header = ({
  session,
  showHelp,
}: {
  session: Session;
  showHelp?: () => void;
}) => {
  return (
    <header className="navbar-light bg-light">
      <nav className="container-fluid d-flex flex-wrap align-items-baseline justify-content-between border-bottom">
        <div className="d-flex flex-wrap py-2">
          <a href="#" className="navbar-brand fw-bold">
            SirenChorus
          </a>
        </div>
        <div className="d-flex flex-wrap py-2">
          <button className="btn btn-default btn-sm font-monospace me-2">
            {session.room}
          </button>
          <ClipboardButton
            getContents={() => session.url().toString()}
            className="btn btn-primary btn-sm me-2"
          >
            Copy session URL
          </ClipboardButton>
          <button
            className="btn btn-danger btn-sm me-2"
            onClick={() => session.refresh()}
          >
            New session
          </button>
          {showHelp && (
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={showHelp}
            >
              Help
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
