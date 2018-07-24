import _ from "lodash";
import produce from "immer";

declare const _DEV_: boolean;

export interface IRouteRule {
  path: string;
  name?: string;
  router?: IRouteRule[];
}

export interface IRouteParseResult {
  matches: boolean;
  name: string;
  data: any;
  restPath: string[];
  basePath: string[];
  next?: IRouteParseResult;
  rules?: IRouteRule[];
  params?: any;
}

let parseRuleIterate = (
  data: any,
  segments: string[],
  ruleSteps: string[],
  ruleName: string,
  basePath: string[]
): IRouteParseResult => {
  if (_.isEmpty(ruleSteps)) {
    return { name: ruleName, matches: true, restPath: segments, basePath: basePath, data: data };
  }

  let s0 = _.first(segments);
  let r0 = _.first(ruleSteps);

  if (r0[0] === ":") {
    let newData = produce(data, draft => {
      draft[r0.slice(1)] = s0;
    });
    return parseRuleIterate(newData, segments.slice(1), ruleSteps.slice(1), ruleName, basePath.concat([s0]));
  } else if (s0 === r0) {
    return parseRuleIterate(data, segments.slice(1), ruleSteps.slice(1), ruleName, basePath.concat([s0]));
  } else {
    return {
      name: ruleName,
      matches: false,
      restPath: segments,
      basePath: basePath,
      data: null
    };
  }
};

let parseWithRule = (rule: IRouteRule, segments: string[], basePath: string[]): IRouteParseResult => {
  let ruleName = rule.name || _.first(rule.path.split("/"));

  if (rule.path === "") {
    return {
      name: ruleName,
      matches: true,
      restPath: segments,
      basePath: basePath,
      data: null
    };
  }

  let ruleSteps = rule.path.split("/");

  if (segments.length < ruleSteps.length) {
    return { name: ruleName, matches: false, restPath: segments, basePath: basePath, data: null };
  }

  return parseRuleIterate({}, segments, ruleSteps, ruleName, basePath);
};

var segmentsParsingCaches = {};
if (_DEV_) {
  (window as any).devSegmentsParsingCaches = segmentsParsingCaches;
}

let parseSegments = (
  segments: string[],
  rules: IRouteRule[],
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

  if (_.isEmpty(rules)) {
    if (_.isEmpty(segments)) {
      return null;
    } else {
      let result = {
        matches: false,
        name: "404",
        data: null,
        params: params,
        restPath: segments,
        basePath: basePath,
        rules: originalRules
      };

      console.warn("No rule found for the path", result);

      return result;
    }
  } else {
    let rule0 = _.first(rules);
    let parseResult = parseWithRule(rule0, segments, basePath);
    let nextParams = produce(params, draft => {
      _.assign(draft, parseResult.data);
    });
    let parseResultWithParams = produce(parseResult, draft => {
      draft.params = nextParams;
    });

    if (parseResult.matches) {
      let toReturn = produce(parseResultWithParams, (draft: IRouteParseResult) => {
        draft.next = parseSegments(parseResult.restPath, rule0.router, parseResult.basePath, rule0.router, nextParams);
      });
      // console.log("To return", toReturn);
      segmentsParsingCaches[cacheKey] = toReturn;
      return toReturn;
    } else {
      return parseSegments(segments, rules.slice(1), basePath, originalRules, nextParams);
    }
  }
};

export let parseRoutePath = (pathString: string, rules: IRouteRule[]): IRouteParseResult => {
  let segments = pathString.split("/").filter(x => x !== "");

  return parseSegments(segments, rules, [], rules, {});
};
