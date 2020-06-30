import { css } from "emotion";

let emptyStyle = css``;

/** 全局主题配置入口, 通过 emotion 方式修改, 基于 mutable reference */
export let GlobalThemeVariables = {
  link: emptyStyle,
};

/** 定制 ruled-router 链接的样式 */
export let attachRuledRouterThemeVariables = (customVariables: Partial<typeof GlobalThemeVariables>): void => {
  Object.assign(GlobalThemeVariables, customVariables);
};
