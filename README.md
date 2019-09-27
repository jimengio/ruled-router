## Ruled Router

![](https://img.shields.io/npm/v/@jimengio/ruled-router.svg?style=flat-square)

This router is designed for apps in jimeng.io . Code ideas in this router url address should be parsed before page rendering. To make it happen, we feed rules to the parser so it knows how the url path is structured.

### Rationale

![ruled-router explained](./diagram/ruled-router.png)

Router is part of a GUI application so definitely it is explained by MVC. Popular router library for React chases better syntax and seamless integration of JSX, thus shadows its nature of MVC. In data-driven applications today, it would be clearer to have model part extracted out and placed as the role of store. And the data parsed from string-based address will be further used by view part for UI rendering.

So steps is slightly different of using the router:

- address changes and we have the new address,
- parse address from rul string to JSON data, based of pre-defined rules,
- view rendering with store and JSON data from router.

React as well as other data-driven architecture prefers "Single source of truth". Normally store is supposed to be all the truth. But since browsers does not handle controls of address bar to developers totally, it still holds a small part of truth inside.

### Usage

Say the path is:

```url
/home/plant/123/shop/456/789
```

parsed it like:

```ts
let router: IRouteParseResult = parseRoutePath(this.props.location.pathname, pageRules);
```

A simple example of this parser looks like:

```ts
let pageRules = [
  {
    path: "home",
    next: [
      {
        path: "plant/:plantId",
        next: [
          {
            path: "shop/:shopId/:corner"
          }
        ]
      }
    ]
  }
];
```

After parsing you will get:

<details>
<summary>A piece of JSON data...</summary>

```json
{
  "raw": "home",
  "name": "home",
  "matches": true,
  "restPath": ["plant", "123", "shop", "456", "789"],
  "params": {},
  "data": {},
  "next": {
    "raw": "plant/:plantId",
    "name": "plant",
    "matches": true,
    "restPath": ["shop", "456", "789"],
    "params": {
      "plantId": "123"
    },
    "data": {
      "plantId": "123"
    },
    "next": {
      "raw": "shop/:shopId/:corner",
      "name": "shop",
      "matches": true,
      "next": null,
      "restPath": [],
      "data": {
        "shopId": "456",
        "corner": "789"
      },
      "params": {
        "plantId": "123",
        "shopId": "456",
        "corner": "789"
      }
    }
  }
}
```

Or in a more intuitive syntax:

```edn
{:raw "home",
 :name "home",
 :matches true,
 :restPath ["plant" "123" "shop" "456" "789"],
 :params {},
 :data {},
 :next {:raw "plant/:plantId",
        :name "plant",
        :matches true,
        :restPath ["shop" "456" "789"],
        :params {:plantId "123"},
        :data {:plantId "123"},
        :next {:raw "shop/:shopId/:corner",
               :name "shop",
               :matches true,
               :next nil,
               :restPath [],
               :data {:shopId "456", :corner "789"},
               :params {:plantId "123", :shopId "456", :corner "789"}}}}
```

</details>

The you may use the data as `props.router` paired with `switch/case`:

```tsx
let Container: FC<{ router: IRouteParseResult }> = props => {
  switch (props.router.name) {
    case "home":
      return <Home router={props.router.next} />;
    default:
      return "Other pages";
  }
};
```

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

### Controller

components for triggering path change:

```tsx
<HashLink to="/" text="DEMO" />

// delay in seconds
<HashRedirect to="/" delay={1.2} />
```

Normally the path can be long and writing by hand is erroneous. Our solution is generating methods from the rules defined above with the library [router-code-generator](https://github.com/jimengio/router-code-generator/).

### Helpers

Find a target route operator from generated router methods:

```tsx
findRouteTarget(genRouter.a.b, "c");
```

### License

MIT
