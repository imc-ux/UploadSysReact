import { createRoot } from "react-dom/client";
import { v4 } from "uuid";
import Modal from "Components/Modal";
import Pop from "Components/Pop";

export interface PopProps {
  uniqueId?: string;
  title?: string;
  closeHandler?: any;
  store?: any;
  width?: number;
  height?: number;
  resizableWidth?: number; // POP缩放最小宽度
  resizableHeight?: number; // POP缩放最小高度
  showCloseButton?: boolean;
  isResize?: boolean; // POP内调整宽高
  popComponent?: React.ReactNode;
}

type popComponent<T> = (props: T) => JSX.Element;

export class PopupWrapper<T> {
  popComponent: popComponent<T>;
  popComponentProps: T;
  popParams: PopProps;
  constructor(
    popComponent: popComponent<T>,
    popParams: PopProps,
    popComponentProps: T = {} as T
  ) {
    this.popComponent = popComponent;
    this.popParams = popParams;
    this.popComponentProps = popComponentProps;
  }

  open() {
    render(
      this.popComponent,
      this.popParams,
      this.destory,
      this.popComponentProps
    );
  }

  destory(uuid: string, root: any) {
    const domNode = document.querySelector(`#popWraper${uuid}`);
    root.unmount();
    document.body.removeChild(domNode);
  }
}

function render<T>(
  Content: popComponent<T>,
  popParams: PopProps,
  destory: (uuid: string, root: any) => void,
  contentProps: T
) {
  const domNode = document.createElement("div");
  const uuid = v4();
  domNode.id = `popWraper${uuid}`;
  document.body.appendChild(domNode);
  const root = createRoot(domNode);
  root.render(
    <PopComponent
      destory={destory}
      uuid={uuid}
      root={root}
      popParams={popParams}
    >
      <Content {...contentProps} />
    </PopComponent>
  );
}

function PopComponent(props: any) {
  function onPopCloseHandler() {
    props.destory(props.uuid, props.root);
  }
  return (
    <Modal>
      <Pop
        onClose={onPopCloseHandler}
        popParams={props.popParams}
        content={props.children}
      />
    </Modal>
  );
}

export function popupProxy<T>(
  popComponent: popComponent<T>,
  popParams: PopProps,
  popComponentProps?: T
) {
  return new PopupWrapper(popComponent, popParams, popComponentProps);
}
