## Ruled Router

This router is designed for apps in jimeng.io . Code ideas in this router url address should be parsed before page rendering. To make it happen, we feed rules to the parser so it knows how the url path is structured.

### Types

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

### Usage

A simple example of this parser looks like:

```ts
let pageRules = [
  {
    path: "idleAnalysis",
    next: [{ name: "components", path: "components/:componentId" }]
  },
  {
    path: "flowControlAnalysis",
    next: [{ name: "processes", path: "components/:componentId/processes/:processId" }]
  }
];
```

And it can be parsed like:

```ts
let router: IRouteParseResult = parseRoutePath(this.props.location.pathname, pageRules);
```

With a lot more complicated list of rules, we are able to parse url of:

```url
/plants/152883204915/qualityManagement/measurementData/components/21712526851768321/processes/39125230470234114
```

into a JSON tree:

```json
{
  "name": "plants",
  "matches": true,
  "restPath": null,
  "basePath": [
    "plants",
    "152883204915",
    "qualityManagement",
    "measurementData",
    "components",
    "21712526851768321",
    "processes",
    "39125230470234114"
  ],
  "data": {
    "plantId": "152883204915"
  },
  "query": {},
  "identityPath": "/plants/152883204915/qualityManagement/measurementData/components/21712526851768321/processes/39125230470234114?",
  "next": {
    "name": "qualityManagement",
    "matches": true,
    "restPath": null,
    "basePath": [
      "qualityManagement",
      "measurementData",
      "components",
      "21712526851768321",
      "processes",
      "39125230470234114"
    ],
    "data": {},
    "query": {},
    "identityPath": "/qualityManagement/measurementData/components/21712526851768321/processes/39125230470234114?",
    "next": {
      "name": "measurementData",
      "matches": true,
      "restPath": null,
      "basePath": ["measurementData", "components", "21712526851768321", "processes", "39125230470234114"],
      "data": {
        "componentId": "21712526851768321",
        "processId": "39125230470234114"
      },
      "query": {},
      "identityPath": "/measurementData/components/21712526851768321/processes/39125230470234114?",
      "next": null
    }
  }
}
```

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

Also several helper components:

```tsx
<HashLink to="/" />
<HashRedirect to="/" />
```

### License

MIT
