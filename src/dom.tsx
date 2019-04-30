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
  timeout?: number;
  className?: string;
  placeholder?: string;
}> = props => {
  let timeout = useRef(null);
  let duration = (props.timeout || 0.8) * 1000;

  useEffect(() => {
    timeout.current = setTimeout(() => {
      window.location.hash = props.to;
    }, duration);

    return () => {
      if (timeout.current) {
        clearInterval(timeout.current);
      }
    };
  }, []);

  return <span className={props.className}>{props.placeholder}</span>;
};
