import React, { SFC, useEffect, useRef } from "react";

export let HashLink: SFC<{
  to: string;
  text?: string;
  className?: string;
}> = props => {
  return (
    <a
      onClick={() => {
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
  placeholder?: string;
}> = props => {
  let timing = useRef(null);
  let delay = (props.delay || 0.8) * 1000;

  useEffect(() => {
    timing.current = setTimeout(() => {
      window.location.hash = props.to;
    }, delay);

    return () => {
      if (timing.current) {
        clearInterval(timing.current);
      }
    };
  }, [props.to]);

  return <span className={props.className}>{props.children || props.placeholder}</span>;
};
