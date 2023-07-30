import Head from "next/head";
import Image from "next/image";
import Logo from "../assets/logo.png";
import { useState } from "react";
import APIInteraction from "@components/api-interaction";

const Home = () => {
  const [userInput, setUserInput] = useState("");
  const [apiOutput, setApiOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  };

  return (
    <div className="root">
      <Head>
        <title>GPT-4 ChatGAAP</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Crypto drama writer</h1>
          </div>
          <div className="header-subtitle">
            <h2>
              Tell us the plot of your short fiction story about crypto and we
              will generate the rest.
            </h2>
          </div>
        </div>
        <div className="prompt-container">
          <textarea
            placeholder="start typing here"
            className="prompt-box"
            value={userInput}
            onChange={onUserChangedText}
          />
          <div className="prompt-buttons">
            <APIInteraction
              path="/api/ratelimitcheck"
              userInput={userInput}
              setLoading={setLoading}
              setIsGenerating={setIsGenerating}
              setApiOutput={setApiOutput}
            />
          </div>
          {apiOutput && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Output</h3>
                </div>
              </div>
              <div className="output-content">
                <p>{apiOutput}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={Logo} alt="logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
