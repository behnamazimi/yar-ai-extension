import "./Content.css";

function Content() {
  return (
    <div className="App">
      <div>
        <img src={chrome.runtime.getURL("./vite.svg")} className="logo" alt="Vite logo" />
      </div>
      <h1>YarAI Content</h1>
      <p>Under construction...</p>
    </div>
  );
}

export default Content;
