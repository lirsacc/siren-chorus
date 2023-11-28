import { h } from "preact";
import { useEffect, useMemo, useState, useRef } from "preact/hooks";

import Panzoom, { PanzoomObject } from "@panzoom/panzoom";
import classNames from "classnames";
import mermaid from "mermaid";

import { randomIshId } from "../utils";

interface MermaidRendererProps {
  data: string;
  id?: string;
  enableZoom?: boolean;
  showZoomControls?: boolean;
}

interface ControlProps {
  onClick: (evt: h.JSX.TargetedMouseEvent<HTMLButtonElement>) => void;
  children: string;
  className?: string;
}

const Control = ({ onClick, children, className }: ControlProps) => (
  <button
    type="button"
    className={classNames(className, "btn btn-sm btn-primary")}
    onClick={onClick}
  >
    {children}
  </button>
);

const MermaidRenderer = ({
  data,
  id,
  showZoomControls,
  enableZoom,
}: MermaidRendererProps) => {
  const _id = useMemo(() => id || `renderer-${randomIshId()}`, [id]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const panzoomRef = useRef<PanzoomObject | null>(null);

  const [rendered, setRendered] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderGraph = async () => {
      if (!data) {
        setRendered(null);
        setError(null);
        return;
      }

      try {
        const { svg } = await mermaid.render(_id, data);
        setRendered(svg);
        setError(null);
      } catch (err) {
        setRendered(null);
        if (err instanceof Error) {
          setError(err?.message);
        } else {
          setError("Something went wrong.'");
        }
      }
    };

    void renderGraph();
  }, [data, _id]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!enableZoom) return;
    const instance = Panzoom(containerRef.current, {
      maxScale: 5,
      // disablePan: true,
    });

    panzoomRef.current = instance;

    const handleWheel = (evt: WheelEvent) => {
      evt.preventDefault();
      if (evt.metaKey) {
        instance.zoomWithWheel(evt);
      } else {
        // TODO: Test this but on my machine if I hold shift the deltaX is set
        // instead of deltaY so no need for manual handling.
        // TODO: Test on trackpad.
        // TODO: Test whether this can be done without the JS and simple
        // scrolling the container.
        const sensitivity = 0.3;
        const { x, y } = instance.getPan();
        instance.pan(
          x - evt.deltaX * sensitivity,
          y - evt.deltaY * sensitivity,
        );
      }
    };

    const node = containerRef.current.parentElement || containerRef.current;
    node.addEventListener("wheel", handleWheel);
    return () => {
      node.removeEventListener("wheel", handleWheel);
      instance.destroy();
    };
  }, [enableZoom]);

  const _controlHandler =
    (fn: (x: PanzoomObject) => void) =>
    (evt: h.JSX.TargetedMouseEvent<HTMLButtonElement>) => {
      evt.preventDefault();
      if (!containerRef.current || !panzoomRef.current) return;
      fn(panzoomRef.current);
    };

  const zoomIn = _controlHandler((x) => x.zoomIn());
  const zoomOut = _controlHandler((x) => x.zoomOut());
  const resetZoom = _controlHandler((x) => x.reset({ animate: false }));

  return (
    <div className="h-100 w-100 position-relative">
      <div className="h-100 w-100">
        <div
          ref={containerRef}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: rendered || "<svg></svg>" }}
        />
      </div>
      {enableZoom && showZoomControls && (
        <div className="position-absolute end-0 bottom-0 m-1">
          <div class="btn-group m-1">
            <Control onClick={resetZoom}>Reset</Control>
          </div>
          <div class="btn-group m-1">
            <Control onClick={zoomOut}>-</Control>
            <Control onClick={zoomIn}>+</Control>
          </div>
        </div>
      )}
      {error && (
        <div className="max-p-2 m-2 mw-100 font-monospace alert alert-danger position-absolute top-0 start-0">
          {error}
        </div>
      )}
    </div>
  );
};

export default MermaidRenderer;
