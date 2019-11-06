import { IRouteRule } from "../../src/path-parser";

export const routerRules: IRouteRule[] = [
  { path: "home" },
  { path: "content" },
  { path: "else" },
  { path: "", name: "home" }
];
