
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

export function parseRoutePath (pathString: string, rules: IRouteRule[]): IRouteParseResult
