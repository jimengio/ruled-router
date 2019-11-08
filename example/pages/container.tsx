import React, { FC } from "react";
import { css, cx } from "emotion";
import { DocSidebar, ISidebarEntry } from "@jimengio/doc-frame";

import DemoParser from "./demo-parser";
import { HashRedirect, findRouteTarget } from "../../src/dom";
import { genRouter, GenRouterTypeMain } from "../controller/generated-router";
import { fullscreen, row } from "@jimengio/flex-styles";
import DemoDOM from "./demo-dom";

let onSwitchPage = (path: string) => {
  let target = findRouteTarget(genRouter, path);
  if (target != null) {
    target.go();
  }
};

let items: ISidebarEntry[] = [
  {
    title: "Ruled Router Parser",
    path: genRouter.parser.name
  },
  {
    title: "DOM elements",
    path: genRouter.dom.name
  }
];

const renderChildPage = (routerTree: GenRouterTypeMain) => {
  if (routerTree != null) {
    switch (routerTree.name) {
      case "parser":
        return <DemoParser />;
      case "dom":
        return <DemoDOM />;
      default:
        return (
          <HashRedirect to={genRouter.parser.path()} delay={2}>
            2s to redirect
          </HashRedirect>
        );
    }
  }
  return <div>NOTHING</div>;
};

let Container: FC<{
  router: GenRouterTypeMain;
}> = React.memo(props => {
  /** Methods */
  /** Effects */
  /** Renderers */
  return (
    <div className={cx(fullscreen, row, styleContainer)}>
      <DocSidebar
        title="Ruled Router"
        currentPath={props.router.name}
        onSwitch={item => {
          onSwitchPage(item.path);
        }}
        items={items}
      />
      {renderChildPage(props.router)}
    </div>
  );
});

export default Container;

const styleContainer = css``;
