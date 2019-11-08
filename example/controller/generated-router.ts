import queryString from "query-string";

type Id = string;

export function switchPath(x: string) {
  location.hash = `#${x}`;
}

function qsStringify(queries: { [k: string]: any }) {
  return queryString.stringify(queries, { arrayFormat: "bracket" });
}

// generated

// Generated with router-code-generator@0.2.5

export let genRouter = {
  parser: {
    name: "parser",
    raw: "parser",
    path: () => `/parser`,
    go: () => switchPath(`/parser`)
  },
  dom: {
    name: "dom",
    raw: "dom",
    path: () => `/dom`,
    go: () => switchPath(`/dom`)
  },
  $: {
    name: "parser",
    raw: "",
    path: () => `/`,
    go: () => switchPath(`/`)
  }
};

export type GenRouterTypeMain = GenRouterTypeTree["parser"] | GenRouterTypeTree["dom"] | GenRouterTypeTree["$"];

export interface GenRouterTypeTree {
  parser: {
    name: "parser";
    params: {};
    query: {};
    next: null;
  };
  dom: {
    name: "dom";
    params: {};
    query: {};
    next: null;
  };
  $: {
    name: "parser";
    params: {};
    query: {};
    next: null;
  };
}
