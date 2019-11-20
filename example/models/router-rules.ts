import { IRouteRule } from "../../src/path-parser";

export const routerRules: IRouteRule[] = [
  { path: "parser" },
  { path: "dom", next: [{ path: "redirected" }] },
  { path: "", name: "parser" }
];
