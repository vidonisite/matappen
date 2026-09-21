import "./BottomNav.css";

function BottomNav({ currentPage, setCurrentPage }) {
  return (
    <nav className="bottom-nav">
      <div className="nav-items">

        {/* TOM VÄNSTER */}
        <div className="nav-item decorative"></div>

        {/* HEM */}
        <button
          className={`nav-item ${currentPage === "hem" ? "active" : ""}`}
          aria-label="Hem"
          onClick={() => setCurrentPage("hem")}
        >
          <div className="nav-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={28}
              height={28}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12l-2 0l9-9l9 9l-2 0" />
              <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
              <path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6" />
            </svg>
          </div>
        </button>

        {/* KAMERA */}
        <button
          className={`nav-item ${currentPage === "kamera" ? "active" : ""}`}
          aria-label="Kamera"
          onClick={() => setCurrentPage("kamera")}
        >
          <div className="nav-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={28}
              height={28}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 7h1a2 2 0 0 0 2-2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-14a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2" />
              <path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0-6 0" />
            </svg>
          </div>
        </button>

        {/* HANDLINGSLISTA */}
        <button
          className={`nav-item ${
            currentPage === "handling" ? "active" : ""
          }`}
          aria-label="Handlingslista"
          onClick={() => setCurrentPage("handling")}
        >
          <div className="nav-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={28}
              height={28}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 5h-2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-12a2 2 0 0 0-2-2h-2" />
              <path d="M9 3h6v4h-6z" />
              <path d="M9 12h6" />
              <path d="M9 16h6" />
            </svg>
          </div>
        </button>

        {/* TOM HÖGER */}
        <div className="nav-item decorative"></div>

      </div>
    </nav>
  );
}

export default BottomNav;
