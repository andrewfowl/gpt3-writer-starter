import { useState } from "react";

const APIInteraction = ({
  path,
  children,
  userInput,
  setLoading,
  setIsGenerating,
  setApiOutput,
}) => {
  const [state, setState] = useState({
    path,
    latency: null,
    status: null,
    headers: {
      "X-RateLimit-Limit": "",
      "X-RateLimit-Remaining": "",
      "X-RateLimit-Reset": "",
    },
    data: null,
  });

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);
    console.log("Calling OpenAI...");
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text);

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  };

  const handleFetch = async () => {
    const start = Date.now();
    setLoading(true);

    try {
      const res = await fetch(path);
      setState({
        path,
        latency: `~${Math.round(Date.now() - start)}ms`,
        status: `${res.status}`,
        headers: {
          "X-RateLimit-Limit": res.headers.get("X-RateLimit-Limit"),
          "X-RateLimit-Remaining": res.headers.get("x-RateLimit-Remaining"),
          "X-RateLimit-Reset": res.headers.get("x-RateLimit-Reset"),
        },
        data: res.headers.get("Content-Type")?.includes("application/json")
          ? await res.json()
          : null,
      });
    } finally {
      setLoading(false);
    }
  };

  const callWithRateLimitCheck = async () => {
    // Check rate limits first
    await handleFetch(path); // Assumes "/api/ratelimitcheck" returns rate limit headers

    try {
      if (
        state.headers["X-RateLimit-Remaining"] &&
        Number(state.headers["X-RateLimit-Remaining"]) > 0
      ) {
        // If we have remaining quota, call the API
        await callGenerateEndpoint();
      } else {
        console.warn("API rate limit exceeded. Wait for reset.");
        alert("Rate limit exceeded. Please wait and try again."); // Notify the user
      }
    } catch (error) {
      console.log("Error message received: ", error);
    }
  };

  let loadingIndicator = loading || isGenerating;

  return (
    <div className="mb-4">
      <button
        className={
          loadingIndicator ? "generate-button loading" : "generate-button"
        }
        onClick={callWithRateLimitCheck}
        aria-label="Generate text"
      >
        <div className="generate">
          {children}
          {loadingIndicator ? (
            <span className="loader"></span>
          ) : (
            <p>Generate</p>
          )}
        </div>
      </button>
      <pre
        className={`border border-accents-2 rounded-md bg-white overflow-x-auto p-6 transition-all ${
          loadingIndicator ? ` opacity-50` : ""
        }`}
      >
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
};

export default APIInteraction;
