import * as React from "react";
import { render } from "react-dom";
import App from "./App";
import "./styles/index.css";

export function canvasSketch(
  sketch: (d: ISketch) => (arg0: ISketch) => any,
  settings: ISettings
) {
  function renderApp() {
    render(
      React.createElement(App, { sketch, settings }),
      document.getElementById("root")
    );
  }
  renderApp();
}
