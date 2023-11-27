import { h } from "preact";
import { useRef, useState } from "preact/hooks";

interface ClipboardButtonProps extends h.JSX.HTMLAttributes<HTMLButtonElement> {
  getContents?: () => string | null;
}

const ClipboardButton = (props: ClipboardButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [success, setSuccess] = useState(false);

  const getContents = props.getContents || (() => ref.current?.textContent);

  const onClick = (evt: h.JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    if (props.onClick) props.onClick(evt);

    const contents = getContents();
    if (contents) {
      navigator.clipboard
        .writeText(contents)
        .then(() => {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 1000);
        })
        .catch((err) => console.error("Failed to copy", err));
    }
  };

  const { children, ...rest } = props;
  return (
    <button ref={ref} type="button" onClick={onClick} {...rest}>
      {success ? "Copied!" : children}
    </button>
  );
};

export default ClipboardButton;
