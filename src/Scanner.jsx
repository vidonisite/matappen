import "./Scanner.css";

function Scanner() {
  return (
    <main className="scanner-page">
      <div className="scanner-container">
        <div className="camera-view">
          <div className="scanner-frame"></div>
        </div>

        <p className="scanner-text">
          Rikta kameran mot streckkoden
        </p>
      </div>
    </main>
  );
}

export default Scanner;
