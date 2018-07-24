
Ruled Router
----

This router is designed for apps in jimeng.io . Code ideas in this router url address should be parsed before page rendering. To make it happen, we feed rules to the parser so it knows how the url path is structured.

### Types

```ts
export interface IRouteRule {
  path: string;
  name?: string;
  router?: IRouteRule[];
}

export let parseRoutePath = (pathString: string, rules: IRouteRule[]): IRouteParseResult => {}

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
```

### Usage

A simple example of this parser looks like:

```ts
let pageRules = [
  {
    path: "idleAnalysis",
    router: [
      { name: "components", path: "components/:componentId", },
    ],
  },
  {
    path: "flowControlAnalysis",
    router: [
      { name: "processes", path: "components/:componentId/processes/:processId", },
    ],
  }
]
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
  "basePath": ["plants","152883204915","qualityManagement","measurementData","components","21712526851768321","processes","39125230470234114"
  ],
  "data": {
    "plantId": "152883204915"
  },
  "next": {
    "name": "qualityManagement",
    "matches": true,
    "restPath": null,
    "basePath": ["qualityManagement","measurementData","components","21712526851768321","processes","39125230470234114"
    ],
    "data": {},
    "next": {
      "name": "measurementData",
      "matches": true,
      "restPath": null,
      "basePath": ["measurementData","components","21712526851768321","processes","39125230470234114"
      ],
      "data": {
        "componentId": "21712526851768321",
        "processId": "39125230470234114"
      },
      "next": null
    }
  }
}
```

Some further explanations can be found at https://github.com/beego/fi/pull/731 .

### License

MIT
