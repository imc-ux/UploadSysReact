import { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Modal from "./Modal";

const root = document.getElementById("root") ?? document.querySelector("body");

interface AlertProps {
  text?: string;
  callBack?: (data?: string) => void;
  optional?: boolean;
  confirmText?: string;
  cancelText?: string;
  onClose?: () => void;
}

export default function CustomAlert(
  text: string,
  callBack?: (data?: string) => void,
  optional?: boolean,
  confirmText?: string,
  cancelText?: string
) {
  renderAlertComponent(
    text,
    callBack,
    optional,
    (confirmText = optional ? "确认" : "OK"),
    (cancelText = "取消")
  );
}

function AlertComponet(props: AlertProps) {
  const {
    text,
    callBack,
    optional = false,
    confirmText,
    cancelText,
    onClose,
  } = props;

  const [closeAlert, setCloseAlert] = useState(false);

  const alertRef = useRef(null);
  const mouseDownFlag = useRef(false);
  const alertLeftRef = useRef(0);
  const alertTopRef = useRef(0);
  const closeAlertDataRef = useRef("");

  let startX = 0;
  let startY = 0;

  function onAlertBtnClickHandler(data: string) {
    setCloseAlert(true);
    closeAlertDataRef.current = data;
  }

  function onAnimationEndHandler() {
    if (closeAlert) {
      callBack?.(closeAlertDataRef.current);
      onClose();
    }
  }

  function onAlertMouseDownHandler(e: any) {
    mouseDownFlag.current = true;
    startX = e.pageX;
    startY = e.pageY;
    alertLeftRef.current = parseInt(
      window.getComputedStyle(alertRef.current).left
    );
    alertTopRef.current = parseInt(
      window.getComputedStyle(alertRef.current).top
    );
  }

  function onAlertMouseMoveHandler(e: any) {
    if (mouseDownFlag.current) {
      const moveDistanceX: number = e.pageX - startX;
      const moveDistanceY: number = e.pageY - startY;
      // const elemTransform = popRef.scurrent.style.transform;
      // if (!elemTransform) {

      alertRef.current.style.left = `${alertLeftRef.current + moveDistanceX}px`;
      alertRef.current.style.top = `${alertTopRef.current + moveDistanceY}px`;
    }
  }

  function onAlertMouseUpHandler() {
    mouseDownFlag.current = false;
  }

  return (
    <Modal>
      <div ref={alertRef} className="fixed top-50% left-50% -translate-50%">
        <div
          flex="~ col"
          className={
            "max-w-340px min-w-240px bg-white  alert-shadow rounded-5px" +
            (closeAlert ? " pop-flip" : "")
          }
          onAnimationEnd={onAnimationEndHandler}
        >
          <div
            className="h-35px pt-4px pr-0 pb-0 pl-10px bg-pop-title alert-title-rounded pop-title-text hover:cursor-move"
            onMouseDown={onAlertMouseDownHandler}
            onMouseMove={onAlertMouseMoveHandler}
            onMouseUp={onAlertMouseUpHandler}
          >
            提示
          </div>
          <div
            className=" min-h-120px
          pt-20px
          pb-20px
          pl-30px
          pr-30px
          break-all
          text-15px
          leading-25px"
            flex="~ col"
          >
            <div
              flex="~ auto"
              className="justify-center items-center alert-text"
            >
              {text}
            </div>
            <div flex="~ none" className="justify-center">
              <button
                className="alert-btn"
                onClick={() => onAlertBtnClickHandler("Y")}
              >
                {confirmText}
              </button>
              {optional && (
                <button
                  className="alert-btn"
                  onClick={() => onAlertBtnClickHandler("N")}
                >
                  {cancelText}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function renderAlertComponent(
  text: string,
  callBack?: (data?: string) => void,
  optional?: boolean,
  confirmText?: string,
  cancelText?: string
) {
  const alertContainer: HTMLDivElement = document.createElement("div");

  const alertProps: AlertProps = {
    text: text,
    callBack: callBack,
    optional: optional,
    confirmText: confirmText,
    cancelText: cancelText,
  };

  function onCloseHandler() {
    alertRoot.unmount();
    root.removeChild(alertContainer);
  }

  root.appendChild(alertContainer);
  const alertRoot = createRoot(alertContainer);
  alertRoot.render(<AlertComponet {...alertProps} onClose={onCloseHandler} />);
}
