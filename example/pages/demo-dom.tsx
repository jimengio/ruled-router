import React, { FC } from "react";
import { css } from "emotion";
import { DocDemo, DocSnippet } from "@jimengio/doc-frame";
import { HashLink, HashRedirect } from "../../src/dom";

let code = `
<HashLink to="a" text={"fake link to #/a"} />
`;

let codeRedirect = `
<HashRedirect to="/dom/redirected" delay={2}>
  Redirecting in 2s...
</HashRedirect>
`;

let DemoDOM: FC<{}> = React.memo(props => {
  /** Methods */
  /** Effects */
  /** Renderers */
  return (
    <div>
      <DocDemo title="Link" link={"https://github.com/jimengio/ruled-router/tree/master/example/pages/demo-dom.tsx"}>
        <DocSnippet code={code} />
        <HashLink to="a" text={"fake link to #/a"} />
      </DocDemo>

      <DocDemo title="Link" link={"https://github.com/jimengio/ruled-router/tree/master/example/pages/demo-dom.tsx"}>
        <DocSnippet code={codeRedirect} />
        <HashRedirect to="/dom/redirected" delay={2}>
          Redirecting in 2s...
        </HashRedirect>
      </DocDemo>
    </div>
  );
});

export default DemoDOM;
