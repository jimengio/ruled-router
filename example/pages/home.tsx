import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { fullscreen, column, row, expand, Space, rowMiddle } from "@jimengio/flex-styles";
import { JimoButton } from "@jimengio/jimo-basics";
import { parseRoutePath, IRouteParseResult } from "../../src/path-parser";
import { routerRules } from "../models/router-rules";

let Home: FC<{}> = React.memo(props => {
  let [rulesCode, setRulesCode] = useState(JSON.stringify(routerRules, null, 2));
  let [pathString, setPathString] = useState("");
  let [parseResult, setParseResult] = useState(null);
  let [slimMode, setSlimMode] = useState(true);

  /** Methods */
  /** Effects */
  /** Renderers */

  let tree: string;
  if (slimMode) {
    tree = JSON.stringify(simplifyResult(parseResult), null, 2);
  } else {
    tree = JSON.stringify(parseResult, null, 2);
  }

  return (
    <div className={cx(fullscreen, row, styleContainer)}>
      <textarea
        className={cx(expand, styleTextarea)}
        value={rulesCode}
        onChange={event => setRulesCode(event.target.value)}
        placeholder={"Router rules in JSON..."}
      />
      <Space width={8} />
      <div className={cx(expand, column)}>
        <div className={rowMiddle}>
          <input
            className={cx(expand, stylePath)}
            placeholder="Url path..."
            value={pathString}
            onChange={event => {
              let path = event.target.value;
              setPathString(path);

              let result = parseRoutePath(path, JSON.parse(rulesCode));
              setParseResult(result);
            }}
          />
          <Space width={8} />
          <input
            type="checkbox"
            checked={slimMode}
            onClick={event => {
              setSlimMode((event.target as any).checked);
            }}
          />
          <span>Slim mode</span>
        </div>
        <Space height={16} />
        <textarea className={cx(expand, styleTextarea)} value={tree} />
      </div>
    </div>
  );
});

export default Home;

let simplifyResult = (result: IRouteParseResult) => {
  if (result == null) {
    return null;
  }
  let cloned = { ...result };
  cloned.restPath = undefined;
  cloned.basePath = undefined;
  cloned.data = undefined;
  cloned.rule = undefined;
  cloned.identityPath = undefined;
  cloned.next = simplifyResult(cloned.next);
  return cloned;
};

let styleContainer = css`
  padding: 16px;
`;

let styleTextarea = css`
  border: 1px solid hsl(0, 0%, 90%);
  font-family: Source Code Pro, Menlo, "Courier New", Courier, monospace;
  padding: 8px;
  font-size: 14px;
`;

let stylePath = css`
  padding: 0 8px;
  font-family: Source Code Pro, Menlo, "Courier New", Courier, monospace;
  font-size: 14px;
`;
