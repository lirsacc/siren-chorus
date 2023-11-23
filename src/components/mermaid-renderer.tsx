import { Fragment, h } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";

import classNames from "classnames";
import mermaid from "mermaid";

import { randomIshId } from "../utils";

interface MermaidRendererProps {
  data: string;
  id?: string;
}

const MermaidRenderer = ({ data, id }: MermaidRendererProps) => {
  const _id = useMemo(() => id || `renderer-${randomIshId()}`, [id]);

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
  }, [data]);

  return (
    <Fragment>
      {error && <div className="p-2 font-mono text-red-500">{error}</div>}
      <div
        className={classNames("p-2", {
          "opacity-30": !!error,
        })}
        dangerouslySetInnerHTML={{ __html: rendered || "" }}
      ></div>
    </Fragment>
  );
};

export default MermaidRenderer;
