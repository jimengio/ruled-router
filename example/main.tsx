import ReactDOM from "react-dom";
import React from "react";

import "main.css";

import { parseRoutePath } from "../src/path-parser";

import { routerRules } from "./models/router-rules";

import Container from "./pages/container";
import { GenRouterTypeTree } from "./controller/generated-router";

const renderApp = () => {
  let routerTree = parseRoutePath(window.location.hash.slice(1), routerRules);

  console.log("tree", routerTree);

  ReactDOM.render(<Container router={routerTree as any} />, document.querySelector(".app"));
};

window.onload = renderApp;

window.addEventListener("hashchange", () => {
  renderApp();
});

declare var module: any;

if (module.hot) {
  module.hot.accept(["./pages/container"], () => {
    renderApp();
  });
}
