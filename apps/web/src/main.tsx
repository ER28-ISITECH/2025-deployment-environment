import { render } from "preact";
import { App } from "./app.tsx";
import "./styles.css";

const element = document.getElementById("app");

if (!element) {
  throw new Error("Root element not found");
}

render(<App />, element);
