import { ComponentChildren, h } from "preact";
import { useRef, useState, useEffect } from "preact/hooks";

import * as b from "bootstrap";

interface ModalProps {
  children: ComponentChildren;
  visible: boolean;
  title: ComponentChildren;
  onHide?: () => void;
}

const Modal = ({ children, visible, title, onHide }: ModalProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [modal, setModal] = useState<b.Modal | null>(null);

  useEffect(() => {
    if (ref.current) setModal(new b.Modal(ref.current));
  }, []);

  useEffect(() => {
    const handler = () => (onHide ? void onHide() : null);
    const node = ref.current;
    node?.addEventListener("hidden.bs.modal", handler);
    return () => node?.removeEventListener("hidden.bs.modal", handler);
  }, [onHide]);

  useEffect(() => {
    if (visible) {
      modal?.show();
    } else {
      modal?.hide();
    }
  }, [visible, modal]);

  return (
    <div className="modal fade" ref={ref} tabIndex={-1} aria-hidden={!visible}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {title}
            </h5>
            {onHide && (
              <button
                type="button"
                className="btn-close"
                onClick={() => onHide()}
                aria-label="Close"
              />
            )}
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
