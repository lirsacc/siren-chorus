import { h } from "preact";
import { useEffect, useMemo, useState, useRef } from "preact/hooks";

import classNames from "classnames";
import mermaid from "mermaid";
import createPanZoom, { PanZoom } from "panzoom";

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

const MermaidRenderer = ({ data, id, showZoomControls, enableZoom }: MermaidRendererProps) => {
  const _id = useMemo(() => id || `renderer-${randomIshId()}`, [id]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const panzoomRef = useRef<PanZoom | null>(null);

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
    panzoomRef.current = createPanZoom(containerRef.current, {
      bounds: true,
      boundsPadding: 0.5,
      maxZoom: 5,
      minZoom: 0.5,
    });
    return () => panzoomRef.current?.dispose();
  }, [enableZoom]);

  const setZoom = (
    evt: h.JSX.TargetedMouseEvent<HTMLButtonElement>,
    step: number,
  ) => {
    evt.preventDefault();
    if (!containerRef.current || !panzoomRef.current) return;

    const svg = containerRef.current.getElementsByTagName("svg")[0];

    if (!svg) return;

    const rect = svg.getBBox();
    const cx = rect.x + rect.width / 2;
    const cy = rect.y + rect.height / 2;
    panzoomRef.current.smoothZoom(cx, cy, step);
  };

  const increaseZoom = (evt: h.JSX.TargetedMouseEvent<HTMLButtonElement>) =>
    setZoom(evt, 0.5);

  const decreaseZoom = (evt: h.JSX.TargetedMouseEvent<HTMLButtonElement>) =>
    setZoom(evt, 2);

  const resetZoom = (evt: h.JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    if (!containerRef.current || !panzoomRef.current) return;
    panzoomRef.current.smoothMoveTo(0, 0);
    panzoomRef.current.smoothZoomAbs(0, 0, 1);
  };

  return (
    <div className="h-100 w-100 overflow-auto position-relative">
      {error && <div className="p-2 font-monospace text-danger">{error}</div>}
      <div
        ref={containerRef}
        className="p-2"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: rendered || "<svg></svg>" }}
      />
      {(enableZoom && showZoomControls) && (
        <div className="position-absolute end-0 bottom-0">
          <div class="btn-group m-1">
            <Control onClick={resetZoom}>Reset</Control>
          </div>
          <div class="btn-group m-1">
            <Control onClick={increaseZoom}>-</Control>
            <Control onClick={decreaseZoom}>+</Control>
          </div>
        </div>
      )}
    </div>
  );
};

export default MermaidRenderer;
