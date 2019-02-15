import { first, isEmpty, assign } from "lodash";
import produce from "immer";

let _DEV_: boolean = false;

export interface IRouteRule<T = { [k: string]: any }> {
  path: string;
  name?: string;
  next?: IRouteRule[];
  extra?: T;
}

export interface IRouteParseResult {
  matches: boolean;
  name: string;
  raw: string;
  data: any;
  restPath: string[];
  basePath: string[];
  next?: IRouteParseResult;
  rule?: IRouteRule;
  definedRules?: IRouteRule[];
  params?: any;
}

let parseRuleIterate = (
  data: any,
  segments: string[],
  ruleSteps: string[],
  rule: IRouteRule,
  basePath: string[]
): IRouteParseResult => {
  let ruleName = rule.name || first(rule.path.split("/"));

  if (isEmpty(ruleSteps)) {
    return {
      name: ruleName,
      raw: rule.path,
      matches: true,
      restPath: segments,
      basePath: basePath,
      data: data,
      rule: rule
    };
  }

  let s0 = first(segments);
  let r0 = first(ruleSteps);

  if (r0[0] === ":") {
    let newData = produce(data, draft => {
      draft[r0.slice(1)] = s0;
    });
    return parseRuleIterate(newData, segments.slice(1), ruleSteps.slice(1), rule, basePath.concat([s0]));
  } else if (s0 === r0) {
    return parseRuleIterate(data, segments.slice(1), ruleSteps.slice(1), rule, basePath.concat([s0]));
  } else {
    return {
      name: ruleName,
      raw: rule.path,
      matches: false,
      restPath: segments,
      basePath: basePath,
      data: null
    };
  }
};

let parseWithRule = (rule: IRouteRule, segments: string[], basePath: string[]): IRouteParseResult => {
  let ruleName = rule.name || first(rule.path.split("/"));

  if (rule.path === "") {
    return {
      name: ruleName,
      raw: rule.path,
      matches: true,
      restPath: segments,
      basePath: basePath,
      data: null,
      rule: rule
    };
  }

  let ruleSteps = rule.path.split("/");

  if (segments.length < ruleSteps.length) {
    return { name: ruleName, raw: rule.path, matches: false, restPath: segments, basePath: basePath, data: null };
  }

  return parseRuleIterate({}, segments, ruleSteps, rule, basePath);
};

var segmentsParsingCaches = {};
if (_DEV_) {
  (window as any).devSegmentsParsingCaches = segmentsParsingCaches;
}

let parseSegments = (
  segments: string[],
  usingRules: IRouteRule[],
  basePath: string[],
  originalRules: IRouteRule[],
  params: any
): IRouteParseResult => {
  let cacheKey = `${segments.join("/")}+${basePath.join("/")}`;

  if (_DEV_) {
    // console.warn('Ignoring parsing caches during DEV')
  } else {
    if (segmentsParsingCaches[cacheKey] != null) {
      // console.log("Parser:  reusing cache", cacheKey);
      return segmentsParsingCaches[cacheKey];
    }
  }

  if (isEmpty(usingRules)) {
    if (isEmpty(segments)) {
      return null;
    } else {
      let result: IRouteParseResult = {
        matches: false,
        name: "404",
        raw: null,
        data: null,
        params: params,
        restPath: segments,
        basePath: basePath,
        definedRules: originalRules
      };

      console.warn("No rule found for the path", result);

      return result;
    }
  } else {
    let rule0: IRouteRule = first(usingRules);
    let parseResult = parseWithRule(rule0, segments, basePath);
    let nextParams = produce(params, draft => {
      assign(draft, parseResult.data);
    });
    let parseResultWithParams = produce(parseResult, draft => {
      draft.params = nextParams;
    });

    if (parseResult.matches) {
      let toReturn = produce(parseResultWithParams, (draft: IRouteParseResult) => {
        draft.next = parseSegments(parseResult.restPath, rule0.next, parseResult.basePath, rule0.next, nextParams);
      });
      // console.log("To return", toReturn);
      segmentsParsingCaches[cacheKey] = toReturn;
      return toReturn;
    } else {
      return parseSegments(segments, usingRules.slice(1), basePath, originalRules, nextParams);
    }
  }
};

export let parseRoutePath = (pathString: string, definedrules: IRouteRule[]): IRouteParseResult => {
  let segments = pathString.split("/").filter(x => x !== "");

  return parseSegments(segments, definedrules, [], definedrules, {});
};
