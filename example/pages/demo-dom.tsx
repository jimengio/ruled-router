import React, { FC, useState } from "react";
import { css } from "emotion";
import { DocDemo, DocSnippet, DocBlock } from "@jimengio/doc-frame";
import { HashLink, HashRedirect } from "../../src/dom";
import { GenRouterTypeMain, GenRouterTypeTree, genRouter } from "../controller/generated-router";
import { JimoButton } from "@jimengio/jimo-basics";
import { attachRuledRouterThemeVariables } from "../../src/theme";
import { Space } from "@jimengio/flex-styles";

let code = `
import { HashLink } from "@jimengio/ruled-router";

<HashLink to="a" text={"fake link to #/a"} />
`;

let codeRedirect = `
import { HashRedirect } from "@jimengio/ruled-router";

<HashRedirect to="/dom/redirected" delay={2}>
  Redirecting in 2s...
</HashRedirect>
`;

let content = `跳转的默认时间是 0.4s, 设置 \`delay={0}\` 关闭跳转时间. 或者通过 \`noDelay\` 关闭延时`;

let DemoDOM: FC<{
  router: GenRouterTypeTree["dom"]["next"];
}> = React.memo((props) => {
  let [loop, forceLoop] = useState();

  /** Methods */
  /** Effects */
  /** Renderers */
  return (
    <div>
      <DocDemo
        title="HashLink"
        link={"https://github.com/jimengio/ruled-router/tree/master/example/pages/demo-dom.tsx"}
      >
        <DocSnippet code={code} />
        <HashLink to="a" text={"fake link to #/a"} />

        <Space height={40} />
        <div>
          <DocBlock content={contentTheme} />
          <JimoButton
            text={"调整主题"}
            onClick={() => {
              attachRuledRouterThemeVariables({
                link: styleRedLink,
              });
              forceLoop(null);
            }}
          />
          <DocSnippet code={codeTheme} />
        </div>
      </DocDemo>

      <DocDemo
        title="HashRedirect"
        link={"https://github.com/jimengio/ruled-router/tree/master/example/pages/demo-dom.tsx"}
      >
        <HashRedirect to="/dom/redirected" delay={2}>
          Redirecting in 2s...
        </HashRedirect>
        <DocSnippet code={codeRedirect} />
        <DocBlock content={content} />
        <DocSnippet code={JSON.stringify(props.router, null, 2)} />
      </DocDemo>
    </div>
  );
});

export default DemoDOM;

let styleRedLink = css`
  color: hsl(0, 80%, 70%);

  &:hover {
    color: hsl(0, 80%, 80%);
  }
`;

let codeTheme = `
attachRuledRouterThemeVariables({
  link: styleRedLink,
});  
`;

let contentTheme = `
链接支持样式的定制.
`;
