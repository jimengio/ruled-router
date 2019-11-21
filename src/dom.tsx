import React, { FC, useEffect, useRef } from "react";

export let HashLink: FC<{
  to: string;
  text?: string;
  className?: string;
}> = props => {
  return (
    <a
      onClick={event => {
        event.preventDefault();
        window.location.hash = props.to;
      }}
      className={props.className}
    >
      {props.text || props.children}
    </a>
  );
};

export let HashRedirect: FC<{
  to: string;
  delay?: number;
  noDelay?: boolean;
  className?: string;
}> = props => {
  let timing = useRef(null as NodeJS.Timeout);
  let delay = props.noDelay ? 0 : (props.delay != null ? props.delay : 0.4) * 1000;

  useEffect(() => {
    // in case there is an old timer
    clearInterval(timing.current);

    timing.current = setTimeout(() => {
      window.location.replace(`${window.location.origin}${location.pathname}#${props.to}`);
    }, delay);

    return () => {
      if (timing.current) {
        clearInterval(timing.current);
      }
    };
  }, [props.to]);

  return <div className={props.className}>{props.children}</div>;
};

interface FakeRouteOperator {
  name: string;
  raw: string;
  path: (...xs: string[]) => string;
  go: (...xs: string[]) => void;
}

/** find a route target dynamically,
 * @param branch refers to parent branch of candidate route items.
 * since it's dynamic, types does not ensure correctness.
 */
export let findRouteTarget = (branch: { [name: string]: any }, path: string): FakeRouteOperator => {
  for (let k in branch) {
    let item: FakeRouteOperator = branch[k];
    if (item != null && item.name != null && item.go != null) {
      if (item.name === path) {
        return item;
      }
    }
  }
  console.warn("Found no matching route item:", path, "in", branch);
  return null;
};
