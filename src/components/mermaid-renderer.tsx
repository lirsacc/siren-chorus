import { Fragment, h } from "preact";
import { useEffect, useMemo, useState, useRef } from "preact/hooks";

import mermaid from "mermaid";
import createPanZoom from "panzoom";

import { randomIshId } from "../utils";

interface MermaidRendererProps {
  data: string;
  id?: string;
}

const MermaidRenderer = ({ data, id }: MermaidRendererProps) => {
  const _id = useMemo(() => id || `renderer-${randomIshId()}`, [id]);

  const containerRef = useRef<HTMLDivElement | null>(null);

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
    const panzoom = createPanZoom(containerRef.current);
    return () => panzoom.dispose();
  }, []);

  return (
    <Fragment>
      {error && <div className="p-2 font-monospace text-danger">{error}</div>}
      <div
        ref={containerRef}
        className="p-2"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: rendered || "<svg></svg>" }}
      />
    </Fragment>
  );
};

export default MermaidRenderer;
