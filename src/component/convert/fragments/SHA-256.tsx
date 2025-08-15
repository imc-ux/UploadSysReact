import React, { useState } from "react";
import Crypto from "crypto-js";
import { Input, Button, Row, Col } from "antd";
import { CopyTwoTone } from "@ant-design/icons";
import { copyHandler } from "@/component/convert/fragments/helper/TextCopy";

export default function SHA1() {
  const [sHAEntryption, setSHAEntryption] = useState("");
  const [sHAResult, setSHAResult] = useState("");
  const { TextArea } = Input;
  const [show, setShow] = useState("none");

  function onSHAEntryptionChangeHandler(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setSHAEntryption(event.target.value);
  }

  function onSHA1EntryptionClickHandler() {
    setSHAResult(Crypto.HmacSHA1("Message", sHAEntryption).toString());
  }

  function onSHA256EntryptionClickHandler() {
    setSHAResult(Crypto.HmacSHA256("Message", sHAEntryption).toString());
  }

  function onSHA512EntryptionClickHandler() {
    setSHAResult(Crypto.HmacSHA512("Message", sHAEntryption).toString());
  }

  function onCopyButtonShowHandler() {
    if (sHAResult !== "") {
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
      return _window.clipboardData.setData("Text", sHAResult);
    } else if (navigator.clipboard?.writeText) {
      return navigator.clipboard.writeText(sHAResult);
    } else if (document.queryCommandSupported("copy")) {
      copyHandler(sHAResult);
    }
  }

  return (
    <div>
      <div className="col-border">
        <Row gutter={0}>
          <Col span={30}>
            <TextArea
              rows={10}
              style={{ width: 680, borderRadius: 10 }}
              onChange={onSHAEntryptionChangeHandler}
              value={sHAEntryption}
              placeholder="要加密的字符串"
            />
          </Col>
        </Row>
      </div>
      <div className="div-flex">
        <div>
          <Button
            className="SHA1-button primary-button"
            onClick={onSHA1EntryptionClickHandler}
            style={{
              paddingLeft: 10,
              height: 25,
              paddingTop: 2,
              marginLeft: 11,
              borderRadius: 5,
              textAlign: "center",
            }}
          >
            SHA1加密
          </Button>
        </div>
        <div>
          <Button
            className="SHA-button primary-button"
            onClick={onSHA256EntryptionClickHandler}
            style={{
              paddingLeft: 10,
              height: 25,
              paddingTop: 2,
              borderRadius: 5,
              textAlign: "center",
            }}
          >
            SHA256加密
          </Button>
        </div>
        <div>
          <Button
            className="SHA-button primary-button"
            onClick={onSHA512EntryptionClickHandler}
            style={{
              paddingLeft: 10,
              height: 25,
              paddingTop: 2,
              borderRadius: 5,
              textAlign: "center",
            }}
          >
            SHA512加密
          </Button>
        </div>
      </div>
      <div
        className="col-border"
        onMouseOver={onCopyButtonShowHandler}
        onMouseOut={onCopyButtonHiddenHandler}
      >
        <Row gutter={0}>
          <Col span={30}>
            <TextArea
              rows={10}
              style={{ width: 680, borderRadius: 10 }}
              placeholder="这里是加密结果"
              value={sHAResult}
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
