import { parseRoutePath, IRouteRule, IRouteParseResult } from "./path-parser";

interface ISimplifiedResult {
  name: string;
  params: { [k: string]: string };
  query: { [k: string]: string | string[] };
  identityPath: string;
  next?: ISimplifiedResult;
}

let simplifyResult = (r: IRouteParseResult): ISimplifiedResult => {
  return {
    name: r.name,
    params: r.params,
    next: r.next != null ? simplifyResult(r.next) : null,
    query: r.query,
    identityPath: r.identityPath
  };
};

let rules: IRouteRule[] = [
  {
    path: "a",
    next: [{ path: "b" }, { path: "c/:x", next: [{ path: "d/:y" }] }, { path: ":z" }]
  },
  {
    path: "e/:x",
    next: [{ path: "f/:y" }]
  }
];

test("test parsing basic rule", () => {
  let actual = simplifyResult(parseRoutePath("/a", rules));
  let goal: ISimplifiedResult = { name: "a", next: null, params: {}, query: {}, identityPath: "/a" };
  expect(actual).toEqual(goal);
});

test("test parsing basic rule with query", () => {
  let actual = simplifyResult(parseRoutePath("/a?a=1&b=2", rules));
  let goal: ISimplifiedResult = {
    name: "a",
    next: null,
    params: {},
    query: { a: "1", b: "2" },
    identityPath: "/a?a=1&b=2"
  };
  expect(actual).toEqual(goal);
});

test("test parsing basic rule with identityPath", () => {
  let actual = simplifyResult(parseRoutePath("/a", rules));
  let goal: ISimplifiedResult = { name: "a", next: null, params: {}, query: {}, identityPath: "/a" };
  expect(actual).toEqual(goal);
});

test("test parsing nested path", () => {
  let actual = simplifyResult(parseRoutePath("/a/b", rules));
  let goal: ISimplifiedResult = {
    name: "a",
    next: { name: "b", next: null, params: {}, identityPath: "/b", query: {} },
    params: {},
    query: {},
    identityPath: "/a/b"
  };
  expect(actual).toEqual(goal);
});

test("test parsing path with variables", () => {
  let actual = simplifyResult(parseRoutePath("/a/c/10", rules));
  let goal: ISimplifiedResult = {
    name: "a",
    next: { name: "c", next: null, params: { x: "10" }, query: {}, identityPath: "/c/10" },
    params: {},
    query: {},
    identityPath: "/a/c/10"
  };
  expect(actual).toEqual(goal);
});

test("test parsing path with multiple variables", () => {
  let actual = simplifyResult(parseRoutePath("/a/c/10/d/22", rules));
  let goal: ISimplifiedResult = {
    name: "a",
    next: {
      name: "c",
      next: { name: "d", next: null, params: { x: "10", y: "22" }, query: {}, identityPath: "/d/22" },
      params: { x: "10" },
      query: {},
      identityPath: "/c/10/d/22"
    },
    params: {},
    query: {},
    identityPath: "/a/c/10/d/22"
  };
  expect(actual).toEqual(goal);
});

test("test parsing nested params", () => {
  let actual = simplifyResult(parseRoutePath("/e/44/f/55", rules));
  let goal: ISimplifiedResult = {
    name: "e",
    next: { name: "f", next: null, params: { x: "44", y: "55" }, query: {}, identityPath: "/f/55" },
    params: { x: "44" },
    query: {},
    identityPath: "/e/44/f/55"
  };
  expect(actual).toEqual(goal);
});

test("test parsing dynamic path", () => {
  let actual = simplifyResult(parseRoutePath("/a/33", rules));
  let goal: ISimplifiedResult = {
    name: "a",
    next: { name: ":z", next: null, params: { z: "33" }, query: {}, identityPath: "/33" },
    params: {},
    query: {},
    identityPath: "/a/33"
  };
  expect(actual).toEqual(goal);
});

test("test parsing path with no rules", () => {
  let actual = simplifyResult(parseRoutePath("/m", rules));
  let goal: ISimplifiedResult = { name: "404", next: null, params: {}, query: {}, identityPath: "/m" };
  expect(actual).toEqual(goal);
});

test("test array in query", () => {
  let actual = simplifyResult(parseRoutePath("/a?a[]=1", rules));
  let goal: ISimplifiedResult = { name: "a", next: null, params: {}, query: { a: ["1"] }, identityPath: "/a?a[]=1" };
  expect(actual).toEqual(goal);
});
