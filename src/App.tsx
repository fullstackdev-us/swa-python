import { useState } from "react";

function App() {
  const [result1, setResult1] = useState<string>();
  const [result2, setResult2] = useState<string>();

  async function callHttpTrigger1() {
    try {
      const response = await fetch("/api/trigger1?user=Your Name");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.text();
      setResult1(data);
    } catch (error) {
      console.error("Error calling httpTrigger1:", error);
      setResult1("Error calling httpTrigger1");
    }
  }

  async function callHttpTrigger2() {
    try {
      const response = await fetch("/api/trigger2?name=World");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.text();
      setResult2(data);
    } catch (error) {
      console.error("Error calling httpTrigger2:", error);
      setResult2("Error calling httpTrigger2");
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
        width: "100%",
      }}
    >
      <button style={{ marginBottom: "1rem" }} onClick={callHttpTrigger1}>
        Test httpTrigger1
      </button>
      <div style={{ marginBottom: "1rem" }}>
        {result1 ? <p>Result from httpTrigger1: {result1}</p> : null}
      </div>
      <button style={{ marginBottom: "1rem" }} onClick={callHttpTrigger2}>
        Test httpTrigger2
      </button>
      <div>{result2 ? <p>Result from httpTrigger2: {result2}</p> : null}</div>
    </div>
  );
}

export default App;
