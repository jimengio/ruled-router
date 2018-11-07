import { parseRoutePath, IRouteRule, IRouteParseResult } from "./path-parser";

interface ISimplifiedResult {
  name: string;
  params: { [k: string]: string };
  next?: ISimplifiedResult;
}

let simplifyResult = (r: IRouteParseResult): ISimplifiedResult => {
  return {
    name: r.name,
    params: r.params,
    next: r.next != null ? simplifyResult(r.next) : null
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
  let goal: ISimplifiedResult = { name: "a", next: null, params: {} };
  expect(actual).toEqual(goal);
});

test("test parsing nested path", () => {
  let actual = simplifyResult(parseRoutePath("/a/b", rules));
  let goal: ISimplifiedResult = { name: "a", next: { name: "b", next: null, params: {} }, params: {} };
  expect(actual).toEqual(goal);
});

test("test parsing path with variables", () => {
  let actual = simplifyResult(parseRoutePath("/a/c/10", rules));
  let goal: ISimplifiedResult = { name: "a", next: { name: "c", next: null, params: { x: "10" } }, params: {} };
  expect(actual).toEqual(goal);
});

test("test parsing path with multiple variables", () => {
  let actual = simplifyResult(parseRoutePath("/a/c/10/d/22", rules));
  let goal: ISimplifiedResult = {
    name: "a",
    next: { name: "c", next: { name: "d", next: null, params: { x: "10", y: "22" } }, params: { x: "10" } },
    params: {}
  };
  expect(actual).toEqual(goal);
});

test("test parsing nested params", () => {
  let actual = simplifyResult(parseRoutePath("/e/44/f/55", rules));
  let goal: ISimplifiedResult = {
    name: "e",
    next: { name: "f", next: null, params: { x: "44", y: "55" } },
    params: { x: "44" }
  };
  expect(actual).toEqual(goal);
});

test("test parsing dynamic path", () => {
  let actual = simplifyResult(parseRoutePath("/a/33", rules));
  let goal: ISimplifiedResult = { name: "a", next: { name: ":z", next: null, params: { z: "33" } }, params: {} };
  expect(actual).toEqual(goal);
});

test("test parsing path with no rules", () => {
  let actual = simplifyResult(parseRoutePath("/m", rules));
  let goal: ISimplifiedResult = { name: "404", next: null, params: {} };
  expect(actual).toEqual(goal);
});
