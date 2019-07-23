import React, { SFC, useEffect, useRef } from "react";

export let HashLink: SFC<{
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

export let HashRedirect: SFC<{
  to: string;
  delay?: number;
  className?: string;
}> = props => {
  let timing = useRef(null as number);
  let delay = (props.delay || 0.8) * 1000;

  useEffect(() => {
    // in case there is an old timer
    clearInterval(timing.current);

    timing.current = setTimeout(() => {
      window.location.hash = props.to;
    }, delay);

    return () => {
      if (timing.current) {
        clearInterval(timing.current);
      }
    };
  }, [props.to]);

  return <div className={props.className}>{props.children}</div>;
};
