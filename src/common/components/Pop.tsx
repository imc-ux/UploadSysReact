import { t } from "i18next";
import { useRef, useState } from "react";

export default function Pop(props: any) {
  const [closePop, setClosePop] = useState(false);

  const popRef = useRef(null);
  const mouseDownFlag = useRef(false);
  const popLeftRef = useRef(0);
  const popTopRef = useRef(0);

  const { width = 100, height = 100, title = "弹出框" } = props.popParams;

  let startX: number;
  let startY: number;

  function onCloseBtnClickHandler() {
    setClosePop(true);
  }

  function onAnimationEndHandler() {
    if (closePop) {
      props.onClose();
    }
  }

  function onPopTitleDragHandler(e: any) {
    if (mouseDownFlag.current) {
      const moveDistanceX: number = e.pageX - startX;
      const moveDistanceY: number = e.pageY - startY;
      popRef.current.style.left = `${popLeftRef.current + moveDistanceX}px`;
      popRef.current.style.top = `${popTopRef.current + moveDistanceY}px`;
    }
  }

  function onPopTitleDragStartHandler(e: any) {
    mouseDownFlag.current = true;
    startX = e.pageX;
    startY = e.pageY;
    popLeftRef.current = parseInt(window.getComputedStyle(popRef.current).left);
    popTopRef.current = parseInt(window.getComputedStyle(popRef.current).top);
  }

  function onPopTitleDragEndHandler() {
    mouseDownFlag.current = false;
  }

  return (
    <div ref={popRef} className="absolute top-50% left-50% -translate-50%" flex>
      <div
        className={closePop ? " pop-flip" : ""}
        style={{ width: width, height: height }}
        flex="~ col"
        flex-none
        onAnimationEnd={onAnimationEndHandler}
        overflow-hidden
      >
        <div
          className="bg-pop-title flex c-white p-4 hover:cursor-move"
          onMouseMove={onPopTitleDragHandler}
          onMouseDown={onPopTitleDragStartHandler}
          onMouseUp={onPopTitleDragEndHandler}
        >
          <div className="justify-start flex flex-1 ">
            <span className="pop-title-text font-bold text-18px">
              {t(title) ?? title}
            </span>
          </div>
          <div className="justify-end flex items-center">
            <span
              className="i-mdi-close text-18px cursor-pointer hover:c-gray"
              onClick={onCloseBtnClickHandler}
            />
          </div>
        </div>
        <div className="pop-content-bg flex flex-auto overflow-hidden">
          {props.content}
        </div>
      </div>
    </div>
  );
}
