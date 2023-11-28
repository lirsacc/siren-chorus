import { h, Fragment } from "preact";
import { useEffect, useRef, useState, useMemo } from "preact/hooks";

import classNames from "classnames";

import { clamp } from "../utils";

const Resizable = (props: {
  children: h.JSX.Element;
  initialWidth: number;
  minWidth?: number;
  maxWidth?: number;
}) => {
  const minWidth = useMemo(
    () =>
      props.minWidth
        ? Math.min(props.minWidth, props.initialWidth)
        : props.initialWidth,
    [props.minWidth, props.initialWidth],
  );

  const maxWidth = useMemo(() => props.maxWidth || Infinity, [props.maxWidth]);

  const [width, setWidth] = useState(props.initialWidth);
  const [dragging, setDragging] = useState(false);

  const paneRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dividerRef.current || !paneRef.current) return;

    const divider = dividerRef.current;
    const pane = paneRef.current;

    const onResize = (evt: MouseEvent) => {
      const updateWidth = evt.pageX - pane.getBoundingClientRect().left;
      setWidth(clamp(updateWidth, minWidth, maxWidth));
    };

    const startResize = (evt: MouseEvent) => {
      evt.preventDefault();
      setDragging(true);
      window.addEventListener("mousemove", onResize);
      window.addEventListener("mouseup", stopResize);
    };

    const stopResize = () => {
      setDragging(false);
      window.removeEventListener("mousemove", onResize);
      window.removeEventListener("mouseup", stopResize);
    };

    divider.addEventListener("mousedown", startResize);
    return () => divider.removeEventListener("mousedown", startResize);
  }, [minWidth, maxWidth]);

  return (
    <Fragment>
      <div ref={paneRef} style={{ width: width }}>
        {props.children}
      </div>
      <div
        ref={dividerRef}
        className={classNames("panels-divider", { "is-held": dragging })}
      />
    </Fragment>
  );
};

export default Resizable;
