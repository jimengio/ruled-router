export interface IRouteRule<T = {
    [k: string]: any;
}> {
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
export declare let parseRoutePath: (pathString: string, definedrules: IRouteRule<{
    [k: string]: any;
}>[]) => IRouteParseResult;
