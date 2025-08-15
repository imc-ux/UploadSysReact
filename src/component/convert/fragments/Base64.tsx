import { useState, useRef } from "react";
import CryptoJS from "crypto-js";
import Alert from "@/component/common/WidgetAlert";
import { Button, Input } from "antd";
import { CopyTwoTone } from "@ant-design/icons";
import { copyHandler } from "@/component/convert/fragments/helper/TextCopy";

export default function Base64Convert() {
  const [picture, setPicture] = useState("");
  const [picturesrc, setPicturesrc] = useState("");
  const [input, setInput] = useState("");
  const [inputResult, setInputResult] = useState("");
  const [upload, setUpload] = useState("");
  const [fontcolor, setFontcolor] = useState("black");
  const uploadRef = useRef<HTMLInputElement>(null);
  const [warnText, setWarnText] = useState("");
  const [warnShow, setWarnShow] = useState([false]);
  const [show, setShow] = useState("none");
  const [srcShow, setSrcShow] = useState("none");
  const color = { color: fontcolor };
  const { TextArea } = Input;

  function onPictureSubmitChangeHandler(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!event.target.files[0].type.includes("image")) {
      setWarnText("请输入图片类型文件!");
      setWarnShow([true]);
      return;
    } else {
      const reader = new FileReader(); //调用FileReader对象
      const imgData = event.target.files[0];
      reader.readAsDataURL(imgData); //通过DataURL的方式返回图像
      reader.onload = function (e) {
        setPicture(e.target.result as string);
        setPicturesrc(e.target.result as string);
        setUpload("");
      };
    }
  }

  function onPictureConvertInputChangeHandler(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setPicture(event.target.value);
  }

  function onBase64ConvertPictureClickHandler() {
    if (picture === "") {
      setWarnShow([true]);
      setWarnText("输入格式有误，转译失败");
    }
    setPicturesrc(picture);
  }

  function oninputChangeHandler(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setFontcolor("");
    setInput(event.target.value);
  }

  function onBase64ConvertClickHandler() {
    if (input === "") {
      setWarnShow([true]);
      setWarnText("输入格式有误，转译失败");
    }
    const textstring = CryptoJS.enc.Utf8.parse(input);
    setInputResult(CryptoJS.enc.Base64.stringify(textstring));
  }

  function onTextConvertClickHandler() {
    if (input === "") {
      setWarnShow([true]);
      setWarnText("输入内容为空");
    }
    try {
      const base64string = CryptoJS.enc.Base64.parse(input);
      setInputResult(CryptoJS.enc.Utf8.stringify(base64string));
    } catch (error) {
      setInputResult("");
      font();
      setWarnShow([true]);
      setWarnText("输入内容格式错误，转译失败");
    }
  }

  function onPictureButtonshowMouseoverHandler() {
    if (picture != "") {
      const pictureButton = document.getElementById("picturebuttonshow");
      pictureButton.style.visibility = "visible";
    }
  }

  function onPictureButtonHiddenMouseOutHandler() {
    const pictureButton = document.getElementById("picturebuttonshow");
    pictureButton.style.visibility = "hidden";
  }

  function onTextButtonShowMouseOverHandler() {
    if (inputResult != "") {
      const textButton = document.getElementById("TextButtonShow");
      textButton.style.visibility = "visible";
    }
  }

  function onTextButtonHiddenMouseOutHandler() {
    const textButton = document.getElementById("TextButtonShow");
    textButton.style.visibility = "hidden";
  }

  function oncopyPictureConvertClickHandler() {
    const _window: any = window;
    setSrcShow("block");
    setTimeout(() => setSrcShow("none"), 1200);
    if (_window.clipboardData && _window.clipboardData.setData) {
      return _window.clipboardData.setData("Text", picture);
    } else if (navigator.clipboard?.writeText) {
      return navigator.clipboard.writeText(picture);
    } else if (document.queryCommandSupported("copy")) {
      copyHandler(picture);
    }
  }

  function oncopyTextConvertClickHandler() {
    const _window: any = window;
    setShow("block");
    setTimeout(() => setShow("none"), 1200);
    if (_window.clipboardData && _window.clipboardData.setData) {
      return _window.clipboardData.setData("Text", inputResult);
    } else if (navigator.clipboard?.writeText) {
      return navigator.clipboard.writeText(inputResult);
    } else if (document.queryCommandSupported("copy")) {
      copyHandler(inputResult);
    }
  }

  function font() {
    setFontcolor("red");
  }

  function Imgdisplay() {
    if (picturesrc === "") {
      return <img className="img" onClick={() => uploadRef.current.click()} />;
    } else {
      return (
        <img
          src={picturesrc}
          onClick={() => uploadRef.current.click()}
          className="img-src"
        />
      );
    }
  }

  function onImageDragOverHandler(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function onImageDropHandler(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!event.dataTransfer.files[0].type.includes("image")) {
      setWarnText("请输入图片类型文件!");
      setWarnShow([true]);
      return;
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(event.dataTransfer.files[0]);
      reader.onload = function (e) {
        setPicture(e.target.result as string);
        setPicturesrc(e.target.result as string);
        setUpload("");
      };
    }
  }

  return (
    <div>
      <Alert alertText={warnText} isShow={warnShow} />
      <div className="Base64-div">
        <div className="flex-div">
          <div className="div-minWidth">
            <div className="text-Base64 primary-text">图片/Base64转换</div>
            <div
              className="div-left"
              onDragOver={onImageDragOverHandler}
              onDrop={onImageDropHandler}
            >
              <input
                ref={(node) => {
                  uploadRef.current = node;
                }}
                className="file-input"
                style={color}
                onChange={onPictureSubmitChangeHandler}
                type="file"
                value={upload}
              />

              <Imgdisplay />
            </div>

            <Button
              style={{
                paddingLeft: 10,
                height: 25,
                paddingTop: 2,
                borderRadius: 5,
                textAlign: "center",
              }}
              className="button-base64 primary-button"
              onClick={onBase64ConvertPictureClickHandler}
            >
              Base64转换图片
            </Button>

            <div
              className="div-left"
              onMouseOver={onPictureButtonshowMouseoverHandler}
              onMouseOut={onPictureButtonHiddenMouseOutHandler}
            >
              <TextArea
                rows={10}
                value={picture}
                onChange={onPictureConvertInputChangeHandler}
                className="picture-convert-textarea"
                style={{ borderRadius: 10, height: 230 }}
              ></TextArea>
              <div className="picture-button-div">
                <CopyTwoTone
                  className="base_copy"
                  id="picturebuttonshow"
                  onClick={oncopyPictureConvertClickHandler}
                ></CopyTwoTone>
              </div>
              <div style={{ display: srcShow }} className="button_copy-text">
                复制成功！
              </div>
            </div>
          </div>
          <div className="base64-line"></div>
          <div className="div-minWidth">
            <div className="text-Base-code primary-text">Base64编码/解码</div>
            <div style={{ marginTop: 26 }}>
              <div className="div-right">
                <TextArea
                  rows={10}
                  onChange={oninputChangeHandler}
                  className="textarea_input"
                  style={{ borderRadius: 10, height: 230 }}
                ></TextArea>
              </div>
              <div className="flex-div">
                <Button
                  className="button-base64-top primary-button"
                  style={{
                    paddingLeft: 10,
                    height: 25,
                    paddingTop: 2,
                    borderRadius: 5,
                    textAlign: "center",
                  }}
                  onClick={onBase64ConvertClickHandler}
                >
                  编码
                </Button>

                <Button
                  className="button-base64-bottom primary-button"
                  style={{
                    paddingLeft: 10,
                    height: 25,
                    paddingTop: 2,
                    borderRadius: 5,
                    textAlign: "center",
                  }}
                  onClick={onTextConvertClickHandler}
                >
                  解码
                </Button>
              </div>
              <div
                className="div-right"
                onMouseOver={onTextButtonShowMouseOverHandler}
                onMouseOut={onTextButtonHiddenMouseOutHandler}
              >
                <TextArea
                  rows={10}
                  value={inputResult}
                  readOnly
                  className="text-convert-textarea"
                  style={{ borderRadius: 10, height: 230 }}
                ></TextArea>
                <div className="text-convert-button-div">
                  <CopyTwoTone
                    className="base_copy_bottom"
                    id="TextButtonShow"
                    onClick={oncopyTextConvertClickHandler}
                  ></CopyTwoTone>
                  <div style={{ display: show }} className="button_copy-text">
                    复制成功！
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
