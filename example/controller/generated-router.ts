import queryString from "query-string";

type Id = string;

export function switchPath(x: string) {
  location.hash = `#${x}`;
}

function qsStringify(queries: { [k: string]: any }) {
  return queryString.stringify(queries, { arrayFormat: "bracket" });
}

// generated

// Generated with router-code-generator@0.2.7

export let genRouter = {
  parser: {
    name: "parser",
    raw: "parser",
    path: () => `/parser`,
    go: () => switchPath(`/parser`),
  },
  dom: {
    name: "dom",
    raw: "dom",
    path: () => `/dom`,
    go: () => switchPath(`/dom`),
    redirected: {
      name: "redirected",
      raw: "redirected",
      path: () => `/dom/redirected`,
      go: () => switchPath(`/dom/redirected`),
    },
  },
  $: {
    name: "parser",
    raw: "",
    path: () => `/`,
    go: () => switchPath(`/`),
  },
};

/** Deprecating, use GenRouterTypeTree["next"] instead */
export type GenRouterTypeMain = GenRouterTypeTree["next"];

export interface GenRouterTypeTree {
  next: GenRouterTypeTree["parser"] | GenRouterTypeTree["dom"] | GenRouterTypeTree["$"];
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
    next: GenRouterTypeTree["dom"]["redirected"];
    redirected: {
      name: "redirected";
      params: {};
      query: {};
      next: null;
    };
  };
  $: {
    name: "parser";
    params: {};
    query: {};
    next: null;
  };
}
