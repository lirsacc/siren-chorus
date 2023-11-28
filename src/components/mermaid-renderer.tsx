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
    const node = containerRef.current;
    const instance = Panzoom(containerRef.current, {
      maxScale: 5,
    });
    panzoomRef.current = instance;

    node.addEventListener("wheel", instance.zoomWithWheel);
    return () => {
      node.removeEventListener("wheel", instance.zoomWithWheel);
      instance.destroy();
    };
  }, [enableZoom]);

  const _controlHandler = (fn: ((x: PanzoomObject) => void)) => (evt: h.JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    if (!containerRef.current || !panzoomRef.current) return;
    fn(panzoomRef.current);
  };

  const zoomIn = _controlHandler((x) => x.zoomIn());
  const zoomOut = _controlHandler((x) => x.zoomOut());
  const resetZoom = _controlHandler((x) => x.reset());

  return (
    <div className="h-100 w-100 overflow-auto position-relative">
      {error && <div className="p-2 font-monospace text-danger">{error}</div>}
      <div
        ref={containerRef}
        className="p-2"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: rendered || "<svg></svg>" }}
      />
      {enableZoom && showZoomControls && (
        <div className="position-absolute end-0 bottom-0">
          <div class="btn-group m-1">
            <Control onClick={resetZoom}>Reset</Control>
          </div>
          <div class="btn-group m-1">
            <Control onClick={zoomOut}>-</Control>
            <Control onClick={zoomIn}>+</Control>
          </div>
        </div>
      )}
    </div>
  );
};

export default MermaidRenderer;
