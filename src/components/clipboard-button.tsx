import { h } from "preact";
import { useRef } from "preact/hooks";

interface ClipboardButtonProps
  extends h.JSX.HTMLAttributes<HTMLButtonElement> {}

const copy = async (contents: string) => {
  if (!contents) return;
  try {
    await navigator.clipboard.writeText(contents);
  } catch (err) {
    console.error("Failed to copy", err);
  }
};

const ClipboardButton = (props: ClipboardButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);

  const onClick = (evt: h.JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    if (props.onClick) props.onClick(evt);

    const contents = ref.current?.textContent;
    if (contents) void copy(contents);
  };

  return <button ref={ref} type="button" onClick={onClick} {...props} />;
};

export default ClipboardButton;
