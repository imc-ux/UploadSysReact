import { useState, useRef, createContext } from "react";
import JSONRow from "./subview/JSONRow";
import JSONLine, { ILine } from "./subview/JSONLine";
import { loopObj } from "./helper/JSONHelper";
import Alert from "@/component/common/WidgetAlert";
import { CopyTwoTone } from "@ant-design/icons";
import { Button, Input } from "antd";
import { copyHandler } from "@/component/convert/fragments/helper/TextCopy";

export interface IRow {
  id: number;
  type: any;
  level: number;
  propsKey?: string;
  propsValue?: string;
  expand?: boolean;
  showing: boolean;
  parent: number[];
  partner?: number;
  comma: boolean;
}

interface IJSONContext {
  onToggleClick: (line: ILine) => void;
}

export const jsonContext = createContext<IJSONContext>(null);

export default function JSONFn() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<any>("");
  const [linenumber, setLinenumber] = useState<any>(null);
  const [fontcolor, setFontcolor] = useState("black");
  const [warnText, setWarnText] = useState("");
  const [warnShow, setWarnShow] = useState([false]);
  const [show, setShow] = useState("none");
  const treeRef = useRef<IRow[]>([]);
  const { TextArea } = Input;

  function onbuttonValueClickHandler(rowElement: ILine) {
    const isExpand = !rowElement.expand;
    const currentElement = treeRef.current.find((t) => t.id == rowElement.id);
    const partnerElement = treeRef.current.find(
      (t) => t.partner == rowElement.id
    );
    currentElement.expand = isExpand;
    partnerElement.showing = isExpand;
    if (isExpand) {
      currentElement.propsValue = currentElement.type === "array" ? "[" : "{";
      currentElement.comma = false;
    } else {
      currentElement.propsValue = currentElement.type === "array" ? "[]" : "{}";
      currentElement.comma = partnerElement.comma;
    }

    if (!isExpand) {
      treeRef.current.forEach((row) => {
        if (row.parent.includes(rowElement.id)) {
          row.showing = false;
        }
      });
    } else {
      treeRef.current.forEach((row) => {
        const partner = treeRef.current.find((t) => t.id == row.partner);
        if (partner && row.expand === undefined) {
          row.showing = partner.expand && partner.showing;
        } else if (row.parent.length > 0) {
          const list = [...row.parent];
          list.reverse();
          const parent = treeRef.current.find((t) => {
            return t.id == list[0];
          });
          if (parent.expand && parent.showing) {
            row.showing = true;
          }
        }
      });
    }
    updateViewport();
  }

  function onInputChangeHandler(
    inputvalue: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setFontcolor("");
    setInput(inputvalue.target.value);
  }

  function updateViewport() {
    setOutput(
      treeRef.current
        .filter((t) => t.showing)
        .map((element: IRow) => {
          return <JSONRow key={element.id} {...element} />;
        })
    );
    setLinenumber(
      treeRef.current
        .filter((t) => t.showing)
        .map((element, index) => (
          <JSONLine key={element.id} index={index} {...element} />
        ))
    );
  }

  function onConvertBtnClickHandler() {
    try {
      JSON.parse(input);
    } catch (error) {
      font();
      setWarnShow([true]);
      setOutput("");
      setLinenumber("");
      setWarnText("输入内容有误，转译失败");
      return;
    }

    treeRef.current = [];
    const obj = JSON.parse(input);
    if (typeof obj === "string" || typeof obj === "number") {
      setOutput(<div>{obj}</div>);
      setLinenumber(<div>1</div>);
    } else {
      loopObj(obj, { level: 0 }, treeRef.current);
      updateViewport();
    }
  }

  function formatJSON(): string {
    let jsonstring = "";
    let jsoninput = JSON.parse(input);
    if (typeof jsoninput === "string" || typeof jsoninput === "number") {
      jsonstring = input;
    } else {
      output.forEach((st: any) => {
        jsonstring =
          jsonstring +
          Array(st.props.level).fill("  ").join("") +
          (st.props.propsKey ?? "") +
          st.props.propsValue +
          (st.props.comma ? "," : "") +
          "\n";
      });
    }

    return jsonstring;
  }

  function onJSONCopyClickHandler() {
    const _window: any = window;
    const copyString = formatJSON();
    const copy = copyString.replace(/\:+\s\s\s/g, ":");
    setShow("block");
    setTimeout(() => setShow("none"), 1200);
    if (_window.clipboardData && _window.clipboardData.setData) {
      return _window.clipboardData.setData("Text", JSON.stringify(copyString));
    } else if (navigator.clipboard?.writeText) {
      return navigator.clipboard.writeText(copy);
    } else if (document.queryCommandSupported("copy")) {
      copyHandler(copy);
    }
  }

  function font() {
    setFontcolor("red");
  }

  function onTextButtonShowMouseOverHandler() {
    if (output !== "") {
      const textButton = document.getElementById("TextButtonShow");
      textButton.style.visibility = "visible";
    }
  }

  function onTextButtonHiddenMouseOutHandler() {
    const textButton = document.getElementById("TextButtonShow");
    textButton.style.visibility = "hidden";
  }

  return (
    <div className="Json-div">
      <Alert alertText={warnText} isShow={warnShow} />
      <div className="JSON-input-div">
        <TextArea
          rows={20}
          value={input}
          onChange={onInputChangeHandler}
          style={{ color: fontcolor, borderRadius: 10, minHeight: 442 }}
        />
      </div>
      <div className="convert-div">
        <Button
          className="primary-button"
          style={{
            height: 25,
            borderRadius: 5,
            textAlign: "center",
            paddingLeft: 10,
            paddingTop: 0,
          }}
          onClick={onConvertBtnClickHandler}
        >
          convert
        </Button>
      </div>

      <jsonContext.Provider
        value={{ onToggleClick: onbuttonValueClickHandler }}
      >
        <div
          id="outPutContainer"
          className="JSON-output-container"
          onMouseOver={onTextButtonShowMouseOverHandler}
          onMouseOut={onTextButtonHiddenMouseOutHandler}
        >
          <div className="JSON-output">
            <div className="linenumber-div">{linenumber}</div>
            <div className="JSON-output-div">{output}</div>
          </div>
          <CopyTwoTone
            className="button_copy"
            onClick={onJSONCopyClickHandler}
            id="TextButtonShow"
          />
          <div style={{ display: show }} className="button_copy-text">
            复制成功！
          </div>
        </div>
      </jsonContext.Provider>
    </div>
  );
}
