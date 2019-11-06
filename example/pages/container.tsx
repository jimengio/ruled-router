import React, { FC } from "react";
import { css } from "emotion";

import Home from "./home";
import { HashRedirect } from "../../src/dom";
import { genRouter, GenRouterTypeMain } from "../controller/generated-router";

const renderChildPage = (routerTree: GenRouterTypeMain) => {
  if (routerTree != null) {
    switch (routerTree.name) {
      case "home":
        return <Home />;
      default:
        return (
          <HashRedirect to={genRouter.home.name} delay={2}>
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
  return <div className={styleContainer}>{renderChildPage(props.router)}</div>;
});

export default Container;

const styleContainer = css``;

const styleTitle = css`
  margin-bottom: 16px;
`;
