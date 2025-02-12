import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import "./App.css";

function App() {
  const [code, setCode] = useState(`function sum(a, b) {\n  return a + b;\n}`);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  async function reviewCode() {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/ai/get-response",
        { code }
      );
      setReview(response.data);
    } catch (error) {
      setReview("Error: Unable to fetch review. Please try again.");
    }
    setLoading(false);
  }

  return (
    <main>
      <div className="left">
        <Editor
          value={code}
          onValueChange={(newCode) => setCode(newCode)}
          highlight={(code) =>
            Prism.highlight(code, Prism.languages.javascript, "javascript")
          }
          padding={12}
          className="code-editor"
        />
        <button
          onClick={reviewCode}
          className="review-button"
          disabled={loading}
        >
          {loading ? "Reviewing..." : "Review Code"}
        </button>
      </div>
      <div className="right">
        <Markdown rehypePlugins={[rehypeHighlight]}>
          {review || "*Code review will appear here...*"}
        </Markdown>
      </div>
    </main>
  );
}

export default App;
