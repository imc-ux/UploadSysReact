import { useState } from "react";
import Crypto from "crypto-js";
import { Button, Input, Col, Row } from "antd";
import { CopyTwoTone } from "@ant-design/icons";
import { copyHandler } from "@/component/convert/fragments/helper/TextCopy";

export default function MD5() {
  const [entryption, setEntryption] = useState("");
  const [resultEntryption, setResultEntryption] = useState("");
  const { TextArea } = Input;
  const [show, setShow] = useState("none");

  function onEnctryptionChangeHandler(
    entryption: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setEntryption(entryption.target.value);
  }

  function on16UpperEntryptionClickHandler() {
    setResultEntryption(
      Crypto.MD5(entryption).toString().toUpperCase().substring(8, 24)
    );
  }

  function on16LowerEntryptionClickHandler() {
    setResultEntryption(
      Crypto.MD5(entryption).toString().toLowerCase().substring(8, 24)
    );
  }

  function on32UpperEntryptionClickHandler() {
    setResultEntryption(Crypto.MD5(entryption).toString().toUpperCase());
  }

  function on32LowerEntryptionClickHandler() {
    setResultEntryption(Crypto.MD5(entryption).toString().toLowerCase());
  }

  function onCopyButtonShowHandler() {
    if (resultEntryption !== "") {
      const copyButton = document.getElementById("CopyButtonShow");
      copyButton.style.visibility = "visible";
    }
  }

  function onCopyButtonHiddenHandler() {
    const copyButton = document.getElementById("CopyButtonShow");
    copyButton.style.visibility = "hidden";
  }

  function oncopyToClipboardClickHandler() {
    const _window: any = window;
    setShow("block");
    setTimeout(() => setShow("none"), 1200);
    if (_window.clipboardData && _window.clipboardData.setData) {
      return _window.clipboardData.setData("Text", resultEntryption);
    } else if (navigator.clipboard?.writeText) {
      return navigator.clipboard.writeText(resultEntryption);
    } else if (document.queryCommandSupported("copy")) {
      copyHandler(resultEntryption);
    }
  }
  return (
    <div>
      <div className="MD5-textarea">
        <Row gutter={0}>
          <Col span={30}>
            <TextArea
              rows={10}
              style={{ width: 720, borderRadius: 10 }}
              placeholder="要加密的字符串"
              onChange={onEnctryptionChangeHandler}
              value={entryption}
            />
          </Col>
        </Row>
      </div>
      <div className="div-flex">
        <div>
          <Button
            style={{
              paddingLeft: 11,
              height: 25,
              paddingTop: 2,
              marginLeft: 12,
              borderRadius: 5,
              textAlign: "center",
            }}
            className="MD5-button primary-button"
            onClick={on16UpperEntryptionClickHandler}
          >
            MD5加密 (16位大写)
          </Button>
        </div>
        <div>
          <Button
            style={{
              paddingLeft: 10,
              height: 25,
              paddingTop: 2,
              borderRadius: 5,
              textAlign: "center",
            }}
            className="MD5-button primary-button"
            onClick={on16LowerEntryptionClickHandler}
          >
            MD5加密 (16位小写)
          </Button>
        </div>
        <div>
          <Button
            style={{
              paddingLeft: 10,
              height: 25,
              paddingTop: 2,
              borderRadius: 5,
              textAlign: "center",
            }}
            className="MD5-button primary-button"
            onClick={on32UpperEntryptionClickHandler}
          >
            MD5加密 (32位大写)
          </Button>
        </div>
        <div>
          <Button
            style={{
              paddingLeft: 10,
              height: 25,
              paddingTop: 2,
              borderRadius: 5,
              textAlign: "center",
            }}
            className="MD5-button primary-button"
            onClick={on32LowerEntryptionClickHandler}
          >
            MD5加密 (32位小写)
          </Button>
        </div>
      </div>
      <div
        className="MD5-textarea"
        onMouseOver={onCopyButtonShowHandler}
        onMouseOut={onCopyButtonHiddenHandler}
      >
        <Row gutter={0}>
          <Col span={30}>
            <TextArea
              rows={10}
              style={{ width: 720, borderRadius: 10 }}
              value={resultEntryption}
              placeholder="这里是加密结果"
              readOnly
            />
          </Col>
        </Row>
        <div>
          <CopyTwoTone
            className="MD5-copy-button"
            onClick={oncopyToClipboardClickHandler}
            id="CopyButtonShow"
          />
        </div>
        <div style={{ display: show }} className="button_copy-text">
          复制成功！
        </div>
      </div>
    </div>
  );
}
