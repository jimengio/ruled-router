import { first, isEmpty, assign } from "lodash-es";
import produce from "immer";
import * as queryString from "query-string";

let _DEV_: boolean = false;

export interface IRouteRule<T = { [k: string]: any }> {
  path: string;
  name?: string;
  title?: string;
  next?: IRouteRule[];
  queries?: string[];
  extra?: T;
}

interface ISimpleObject {
  [k: string]: string;
}

interface IQueryObject {
  [k: string]: string | string[];
}

export interface IRouteParseResult<IParams = ISimpleObject, IQuery = IQueryObject> {
  matches: boolean;
  name: string;
  raw: string;
  restPath: string[];
  basePath: string[];
  identityPath: string;
  next?: IRouteParseResult;
  rule?: IRouteRule;
  definedRules?: IRouteRule[];
  data: ISimpleObject;
  params: IParams;
  query: IQuery;
}

let parseRuleIterate = (
  data: Record<string, string>,
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
      identityPath: null,
      data: data,
      params: {},
      rule: rule,
      query: null,
    };
  }

  let s0 = first(segments);
  let r0 = first(ruleSteps);

  if (r0[0] === ":") {
    let newData = produce(data, (draft: Record<string, string>) => {
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
      identityPath: null,
      data: null,
      params: {},
      query: null,
    };
  }
};

let parseWithRule = (rule: IRouteRule, segments: string[], basePath: string[]): IRouteParseResult => {
  let ruleName = rule.name || first(rule.path.split("/"));

  if (rule.path === "") {
    return {
      name: ruleName,
      raw: rule.path,
      identityPath: null,
      matches: true,
      restPath: segments,
      basePath: basePath,
      data: null,
      params: {},
      rule: rule,
      query: null,
    };
  }

  let ruleSteps = rule.path.split("/");

  if (segments.length < ruleSteps.length) {
    return {
      name: ruleName,
      raw: rule.path,
      matches: false,
      restPath: segments,
      basePath: basePath,
      identityPath: null,
      data: null,
      params: {},
      query: null,
    };
  }

  return parseRuleIterate({}, segments, ruleSteps, rule, basePath);
};

var segmentsParsingCaches: Record<string, any> = {};
if (_DEV_) {
  (window as any).devSegmentsParsingCaches = segmentsParsingCaches;
}

export let dangerouslyResetCaches = () => {
  console.warn("Rules changed. Resetting parser caches!");
  segmentsParsingCaches = {};
};

let parseSegments = (
  segments: string[],
  usingRules: IRouteRule[],
  basePath: string[],
  originalRules: IRouteRule[],
  params: any,
  query: { [k: string]: string | string[] }
): IRouteParseResult => {
  let cacheKey = `${segments.join("/")}+${basePath.join("/")}+?${queryString.stringify(query, {
    arrayFormat: "bracket",
  })}`;

  let identityPath: string = `/${segments.join("/")}`;
  if (Object.keys(query).length > 0) {
    identityPath = `${identityPath}?${queryString.stringify(query, { arrayFormat: "bracket" })}`;
  }

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
        identityPath,
        definedRules: originalRules,
        query,
      };

      console.warn("No rule found for the path", result);

      return result;
    }
  } else {
    let rule0: IRouteRule = first(usingRules);
    let parseResult = parseWithRule(rule0, segments, basePath);
    let nextParams = produce(params, (draft: Record<string, string>) => {
      assign(draft, parseResult.data);
    });
    let parseResultWithParams = produce(parseResult, (draft) => {
      draft.params = nextParams as any;
    });

    if (parseResult.matches) {
      if (rule0.path === "" && usingRules.length > 1) {
        console.warn("Caution: rules found after empty rule, it might be a bug, check your router rules!", usingRules);
      }
      if (rule0.path[0] === ":" && usingRules.length > 1) {
        console.warn("Caution: rules found after variable, it might be a bug, check yout router rules!", usingRules);
      }

      let toReturn = produce(parseResultWithParams, (draft: IRouteParseResult) => {
        draft.next = parseSegments(
          parseResult.restPath,
          rule0.next,
          parseResult.basePath,
          rule0.next,
          nextParams,
          query
        );
        draft.query = query;
        draft.identityPath = identityPath;
      });
      // console.log("To return", toReturn);
      segmentsParsingCaches[cacheKey] = toReturn;
      return toReturn;
    } else {
      return parseSegments(segments, usingRules.slice(1), basePath, originalRules, nextParams, query);
    }
  }
};

export let parseRoutePath = (pathString: string, definedrules: IRouteRule[]): IRouteParseResult => {
  let [pathPart, queryPart] = pathString.split("?");
  let segments = pathPart.split("/").filter((x) => x !== "");

  return parseSegments(
    segments,
    definedrules,
    [],
    definedrules,
    {},
    queryString.parse(queryPart, {
      arrayFormat: "bracket",
    }) as {
      [k: string]: string | string[];
    }
  );
};
