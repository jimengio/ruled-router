export interface IRouteRule {
    path: string;
    name?: string;
    next?: IRouteRule[];
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
export declare let parseRoutePath: (pathString: string, rules: IRouteRule[]) => IRouteParseResult;
