### Types

Type for rules:

```ts
export interface IRouteRule {
  path: string;
  name?: string;
  next?: IRouteRule[];
}

export let parseRoutePath = (pathString: string, rules: IRouteRule[]): IRouteParseResult => {};

export interface IRouteParseResult {
  matches: boolean;
  name: string;
  data: any;
  restPath: string[];
  basePath: string[];
  next?: IRouteParseResult;
  rules?: IRouteRule[];
  params?: any;
  query: { [k: string]: string };
}
```

Not quite useful but you can specify types for `params` and `query`,

```ts
IRouteParseResult<IParams, IQuery>
```

Type interface for data parsed from url path:

```ts
export interface IRouteParseResult {
  matches: boolean;
  /** an aliased name defined in rules. you can also skip name and use path */
  name: string;
  /** parsed result from sub router */
  next?: IRouteParseResult;

  /** parameters parsed in current piece of router */
  params?: any;
  /** all parameters parsed, including data from parents level */
  data: any;
  query: { [k: string]: string };

  /** returns the path defined in rule, it's more accurate than rule.name field  */
  raw: string;
  /** a formatted string representation of the path, can be used in React.memo or shouldComponentUpdate */
  identityPath: string;

  /** mostly debug information */
  restPath: string[];
  basePath: string[];
  rule?: IRouteRule;
  definedRules?: IRouteRule[];
}
```
