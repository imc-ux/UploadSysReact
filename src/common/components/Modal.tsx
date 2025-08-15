interface ModalProps {
  darkModal?: boolean;
  children?: any;
  zIndex?: number;
  onClick?: () => void;
}

export default function Modal(props: ModalProps) {
  const { darkModal = true, zIndex = 1000 } = props;

  function onModalClickHandler() {
    props.onClick?.();
  }

  return (
    <div
      style={{ zIndex: zIndex }}
      className={
        `w-full h-screen fixed inset-0 ` + (darkModal ? " modal-bg" : "")
      }
      onClick={onModalClickHandler}
    >
      {props.children}
    </div>
  );
}
