import TextArea from "antd/lib/input/TextArea";
import React, { useEffect, useRef, useState } from "react";
import { Checkbox, Typography, notification, Row, Col } from "antd";
import { SmileOutlined, CopyTwoTone, DeleteTwoTone } from "@ant-design/icons";
import {
  base64ToString,
  decimalToString,
  decNumberToHTMLNameCode,
  GBCodeToString,
  htmlCodeToString,
  htmlNameCodeToDecString,
  stringToBase64,
  stringToDecimal,
  stringToGBEncode,
  stringToHTMLCode,
  stringToUnicode,
  stringToURLCode,
  stringToUTF16,
  stringToUTF32,
  stringToUTF8,
  unicodeToString,
  urlCodeToString,
  uTF16ToString,
  utf32ToString,
  uTF8ToString,
} from "./helper/UnicodeHelper";

const { Title } = Typography;

enum InputType {
  C = "Common",
  UC = "Unicode",
  U8 = "UTF-8 Text",
  U8H = "UTF-8 Hex",
  U16 = "UTF-16",
  U32 = "UTF-32",
  B64 = "Base64",
  URL = "URL",
  DEC = "Decimal",
  HC = "Html Code",
  HN = "Html Name Code",
  GB4 = "GB2312",
  GBK = "GBK",
  GB5 = "GB18130",
}

export default function UnicodeConverter() {
  const [inputValue, setInputValue] = useState("");
  const [refresh, setRefresh] = useState(Math.random());
  const inputTypeRef = useRef(InputType.C);
  const u8RemoveFlag = useRef(false);
  const u16RemoveFlag = useRef(false);
  const u32RemoveFlag = useRef(false);

  let commonText = "";
  let unicodeText = "";
  let utf8HexText = "";
  let utf16Text = "";
  let utf32Text = "";
  let base64Text = "";
  let urlText = "";
  let decimalText = "";
  let htmlCodeText = "";
  let htmlNameCodeText = "";
  let gb2312CodeText = "";
  let gbkCodeText = "";
  let gb18130CodeText = "";

  switch (inputTypeRef.current) {
    case InputType.UC:
      unicodeConverter();
      break;
    case InputType.U8H:
      utf8Converter();
      break;
    case InputType.U16:
      utf16Converter();
      break;
    case InputType.U32:
      utf32Converter();
      break;
    case InputType.B64:
      base64Converter();
      break;
    case InputType.URL:
      urlConverter();
      break;
    case InputType.DEC:
      decConverter();
      break;
    case InputType.HC:
      htmlCodeConverter();
      break;
    case InputType.HN:
      htmlNameCodeConverter();
      break;
    case InputType.GB4:
    case InputType.GBK:
    case InputType.GB5:
      gbCodeConverter();
      break;
    default:
      commonTextConvert();
      break;
  }

  function unicodeConverter() {
    unicodeText = inputValue;
    commonText = unicodeToString(inputValue);
    utf8HexText = stringToUTF8(commonText, u8RemoveFlag.current);
    utf16Text = stringToUTF16(commonText, u16RemoveFlag.current);
    utf32Text = stringToUTF32(commonText, u32RemoveFlag.current);
    base64Text = stringToBase64(commonText);
    urlText = stringToURLCode(commonText);
    decimalText = stringToDecimal(commonText);
    htmlCodeText = stringToHTMLCode(commonText);
    htmlNameCodeText = decNumberToHTMLNameCode(decimalText);
    gb2312CodeText = stringToGBEncode(commonText, "GB2312");
    gbkCodeText = stringToGBEncode(commonText, "GBK");
    gb18130CodeText = stringToGBEncode(commonText, "GB18030");
  }

  function utf8Converter() {
    utf8HexText = inputValue;
    commonText = uTF8ToString(inputValue);
    unicodeText = stringToUnicode(commonText);
    utf16Text = stringToUTF16(commonText, u16RemoveFlag.current);
    utf32Text = stringToUTF32(commonText, u32RemoveFlag.current);
    base64Text = stringToBase64(commonText);
    urlText = stringToURLCode(commonText);
    decimalText = stringToDecimal(commonText);
    htmlCodeText = stringToHTMLCode(commonText);
    htmlNameCodeText = decNumberToHTMLNameCode(decimalText);
    gb2312CodeText = stringToGBEncode(commonText, "GB2312");
    gbkCodeText = stringToGBEncode(commonText, "GBK");
    gb18130CodeText = stringToGBEncode(commonText, "GB18030");
  }

  function utf16Converter() {
    utf16Text = inputValue;
    commonText = uTF16ToString(inputValue, u16RemoveFlag.current);
    unicodeText = stringToUnicode(commonText);
    utf8HexText = stringToUTF8(commonText, u8RemoveFlag.current);
    utf32Text = stringToUTF32(commonText, u32RemoveFlag.current);
    base64Text = stringToBase64(commonText);
    urlText = stringToURLCode(commonText);
    decimalText = stringToDecimal(commonText);
    htmlCodeText = stringToHTMLCode(commonText);
    htmlNameCodeText = decNumberToHTMLNameCode(decimalText);
    gb2312CodeText = stringToGBEncode(commonText, "GB2312");
    gbkCodeText = stringToGBEncode(commonText, "GBK");
    gb18130CodeText = stringToGBEncode(commonText, "GB18030");
  }

  function utf32Converter() {
    utf32Text = inputValue;
    commonText = utf32ToString(inputValue, u32RemoveFlag.current);
    unicodeText = stringToUnicode(commonText);
    utf8HexText = stringToUTF8(commonText, u8RemoveFlag.current);
    utf16Text = stringToUTF16(commonText, u16RemoveFlag.current);
    base64Text = stringToBase64(commonText);
    urlText = stringToURLCode(commonText);
    decimalText = stringToDecimal(commonText);
    htmlCodeText = stringToHTMLCode(commonText);
    htmlNameCodeText = decNumberToHTMLNameCode(decimalText);
    gb2312CodeText = stringToGBEncode(commonText, "GB2312");
    gbkCodeText = stringToGBEncode(commonText, "GBK");
    gb18130CodeText = stringToGBEncode(commonText, "GB18030");
  }

  function base64Converter() {
    base64Text = inputValue;
    commonText = base64ToString(inputValue);
    unicodeText = stringToUnicode(commonText);
    utf8HexText = stringToUTF8(commonText, u8RemoveFlag.current);
    utf16Text = stringToUTF16(commonText, u16RemoveFlag.current);
    utf32Text = stringToUTF32(commonText, u32RemoveFlag.current);
    urlText = stringToURLCode(commonText);
    decimalText = stringToDecimal(commonText);
    htmlCodeText = stringToHTMLCode(commonText);
    htmlNameCodeText = decNumberToHTMLNameCode(decimalText);
    gb2312CodeText = stringToGBEncode(commonText, "GB2312");
    gbkCodeText = stringToGBEncode(commonText, "GBK");
    gb18130CodeText = stringToGBEncode(commonText, "GB18030");
  }

  function urlConverter() {
    urlText = inputValue;
    commonText = urlCodeToString(inputValue);
    unicodeText = stringToUnicode(commonText);
    utf8HexText = stringToUTF8(commonText, u8RemoveFlag.current);
    utf16Text = stringToUTF16(commonText, u16RemoveFlag.current);
    utf32Text = stringToUTF32(commonText, u32RemoveFlag.current);
    base64Text = stringToBase64(commonText);
    decimalText = stringToDecimal(commonText);
    htmlCodeText = stringToHTMLCode(commonText);
    htmlNameCodeText = decNumberToHTMLNameCode(decimalText);
    gb2312CodeText = stringToGBEncode(commonText, "GB2312");
    gbkCodeText = stringToGBEncode(commonText, "GBK");
    gb18130CodeText = stringToGBEncode(commonText, "GB18030");
  }

  function decConverter() {
    decimalText = inputValue;
    commonText = decimalToString(inputValue);
    unicodeText = stringToUnicode(commonText);
    utf8HexText = stringToUTF8(commonText, u8RemoveFlag.current);
    utf16Text = stringToUTF16(commonText, u16RemoveFlag.current);
    utf32Text = stringToUTF32(commonText, u32RemoveFlag.current);
    base64Text = stringToBase64(commonText);
    urlText = stringToURLCode(commonText);
    htmlCodeText = stringToHTMLCode(commonText);
    htmlNameCodeText = decNumberToHTMLNameCode(inputValue);
    gb2312CodeText = stringToGBEncode(commonText, "GB2312");
    gbkCodeText = stringToGBEncode(commonText, "GBK");
    gb18130CodeText = stringToGBEncode(commonText, "GB18030");
  }

  function htmlCodeConverter() {
    htmlCodeText = inputValue;
    commonText = htmlCodeToString(inputValue);
    unicodeText = stringToUnicode(commonText);
    utf8HexText = stringToUTF8(commonText, u8RemoveFlag.current);
    utf16Text = stringToUTF16(commonText, u16RemoveFlag.current);
    utf32Text = stringToUTF32(commonText, u32RemoveFlag.current);
    base64Text = stringToBase64(commonText);
    urlText = stringToURLCode(commonText);
    decimalText = stringToDecimal(commonText);
    htmlNameCodeText = decNumberToHTMLNameCode(decimalText);
    gb2312CodeText = stringToGBEncode(commonText, "GB2312");
    gbkCodeText = stringToGBEncode(commonText, "GBK");
    gb18130CodeText = stringToGBEncode(commonText, "GB18030");
  }

  function htmlNameCodeConverter() {
    htmlNameCodeText = inputValue;
    decimalText = htmlNameCodeToDecString(inputValue);
    commonText = decimalToString(decimalText);
    unicodeText = stringToUnicode(commonText);
    utf8HexText = stringToUTF8(commonText, u8RemoveFlag.current);
    utf16Text = stringToUTF16(commonText, u16RemoveFlag.current);
    utf32Text = stringToUTF32(commonText, u32RemoveFlag.current);
    base64Text = stringToBase64(commonText);
    urlText = stringToURLCode(commonText);
    htmlCodeText = stringToHTMLCode(commonText);
    gb2312CodeText = stringToGBEncode(commonText, "GB2312");
    gbkCodeText = stringToGBEncode(commonText, "GBK");
    gb18130CodeText = stringToGBEncode(commonText, "GB18030");
  }

  function gbCodeConverter() {
    switch (inputTypeRef.current) {
      case InputType.GB4:
        {
          gb2312CodeText = inputValue;
          commonText = GBCodeToString(inputValue, "GB2312");
          gbkCodeText = stringToGBEncode(commonText, "GBK");
          gb18130CodeText = stringToGBEncode(commonText, "GB18030");
        }
        break;
      case InputType.GBK:
        {
          gbkCodeText = inputValue;
          commonText = GBCodeToString(inputValue, "GBK");
          gb2312CodeText = stringToGBEncode(commonText, "GB2312");
          gb18130CodeText = stringToGBEncode(commonText, "GB18030");
        }
        break;
      case InputType.GB5:
        {
          gb18130CodeText = inputValue;
          commonText = GBCodeToString(inputValue, "GB18030");
          gb2312CodeText = stringToGBEncode(commonText, "GB2312");
          gbkCodeText = stringToGBEncode(commonText, "GBK");
        }
        break;
    }
    unicodeText = stringToUnicode(commonText);
    utf8HexText = stringToUTF8(commonText, u8RemoveFlag.current);
    utf16Text = stringToUTF16(commonText, u16RemoveFlag.current);
    utf32Text = stringToUTF32(commonText, u32RemoveFlag.current);
    base64Text = stringToBase64(commonText);
    urlText = stringToURLCode(commonText);
    decimalText = stringToDecimal(commonText);
    htmlCodeText = stringToHTMLCode(commonText);
    htmlNameCodeText = decNumberToHTMLNameCode(decimalText);
  }

  function commonTextConvert() {
    commonText = inputValue;
    unicodeText = stringToUnicode(inputValue);
    utf8HexText = stringToUTF8(inputValue, u8RemoveFlag.current);
    utf16Text = stringToUTF16(inputValue, u16RemoveFlag.current);
    utf32Text = stringToUTF32(inputValue, u32RemoveFlag.current);
    base64Text = stringToBase64(inputValue);
    urlText = stringToURLCode(inputValue);
    decimalText = stringToDecimal(inputValue);
    htmlCodeText = stringToHTMLCode(inputValue);
    htmlNameCodeText = decNumberToHTMLNameCode(decimalText);
    gb2312CodeText = stringToGBEncode(inputValue, "GB2312");
    gbkCodeText = stringToGBEncode(inputValue, "GBK");
    gb18130CodeText = stringToGBEncode(inputValue, "GB18030");
  }

  function onCommonTextChangedHandler(data: string, type: InputType) {
    setInputValue(data);
    inputTypeRef.current = type;
  }

  function onCheckboxChangedHandler(data: boolean, type: InputType) {
    removeOrAddSymbol(data, type);
  }

  function removeOrAddSymbol(removeFlag: boolean, type: InputType) {
    if (removeFlag) {
      switch (type) {
        case InputType.U8H:
          u8RemoveFlag.current = removeFlag;
          inputTypeRef.current = type;
          setInputValue(utf8HexText.replace(/\\x/g, ""));
          break;
        case InputType.U16:
          u16RemoveFlag.current = removeFlag;
          inputTypeRef.current = type;
          setInputValue(utf16Text.replace(/\\u/g, ""));
          break;
        case InputType.U32:
          u32RemoveFlag.current = removeFlag;
          inputTypeRef.current = type;
          setInputValue(utf32Text.replace(/u\+/g, ""));
          break;
      }
    } else {
      switch (type) {
        case InputType.U8H:
          u8RemoveFlag.current = removeFlag;
          break;
        case InputType.U16:
          u16RemoveFlag.current = removeFlag;
          break;
        case InputType.U32:
          u32RemoveFlag.current = removeFlag;
          break;
      }
      inputTypeRef.current = InputType.C;
      setInputValue(commonText);
      setRefresh(Math.random());
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "auto",
      }}
    >
      <Row
        gutter={[
          { xxl: 32, lg: 24 },
          { xxl: 32, lg: 24 },
        ]}
      >
        <Col xxl={8} lg={12}>
          <CustomTextArea
            title="Text ( Example: र Ю )"
            data={commonText}
            type={InputType.C}
            onTextAreaChanged={onCommonTextChangedHandler}
          />
        </Col>
        <Col xxl={8} lg={12}>
          <CustomTextArea
            title="Unicode"
            data={unicodeText}
            type={InputType.UC}
            ristrict={/[^a-fA-F0-9u+]/g}
            key={refresh}
            onTextAreaChanged={onCommonTextChangedHandler}
          />
        </Col>
        <Col xxl={8} lg={12} className="gutter-row">
          <CustomTextArea
            title="UTF-8"
            showCheckbox={true}
            checkboxLabel="Remove notation ( \x )"
            data={utf8HexText}
            type={InputType.U8H}
            ristrict={/[^a-fA-F0-9x\\]/g}
            onTextAreaChanged={onCommonTextChangedHandler}
            onCheckboxChanged={onCheckboxChangedHandler}
          />
        </Col>
        <Col xxl={8} lg={12}>
          <CustomTextArea
            title="UTF-16"
            showCheckbox={true}
            checkboxLabel="Remove notation ( \u )"
            data={utf16Text}
            type={InputType.U16}
            ristrict={/[^a-fA-F0-9u\\]/g}
            onTextAreaChanged={onCommonTextChangedHandler}
            onCheckboxChanged={onCheckboxChangedHandler}
          />
        </Col>
        <Col xxl={8} lg={12}>
          <CustomTextArea
            title="UTF-32"
            showCheckbox={true}
            checkboxLabel="Remove notation ( u+ )"
            data={utf32Text}
            type={InputType.U32}
            ristrict={/[^a-fA-F0-9u+]/g}
            onTextAreaChanged={onCommonTextChangedHandler}
            onCheckboxChanged={onCheckboxChangedHandler}
          />
        </Col>
        {/* <Col xxl={8} lg={12}>
          <CustomTextArea title="Base64" data={base64Text} type={InputType.B64} onTextAreaChanged={onCommonTextChangedHandler} />
        </Col> */}
        <Col xxl={8} lg={12}>
          <CustomTextArea
            title="URL(%)"
            data={urlText}
            type={InputType.URL}
            onTextAreaChanged={onCommonTextChangedHandler}
          />
        </Col>
        <Col xxl={8} lg={12}>
          <CustomTextArea
            title="Decimal"
            data={decimalText}
            type={InputType.DEC}
            ristrict={/[^0-9\s]/g}
            onTextAreaChanged={onCommonTextChangedHandler}
          />
        </Col>
        <Col xxl={8} lg={12}>
          <CustomTextArea
            title="HTML Code"
            data={htmlCodeText}
            type={InputType.HC}
            onTextAreaChanged={onCommonTextChangedHandler}
          />
        </Col>
        <Col xxl={8} lg={12}>
          <CustomTextArea
            title="Html Name Code"
            data={htmlNameCodeText}
            type={InputType.HN}
            onTextAreaChanged={onCommonTextChangedHandler}
          />
        </Col>
        <Col xxl={8} lg={12}>
          <CustomTextArea
            title="GB2312"
            data={gb2312CodeText}
            type={InputType.GB4}
            onTextAreaChanged={onCommonTextChangedHandler}
          />
        </Col>
        <Col xxl={8} lg={12}>
          <CustomTextArea
            title="GBK"
            data={gbkCodeText}
            type={InputType.GBK}
            onTextAreaChanged={onCommonTextChangedHandler}
          />
        </Col>
        <Col xxl={8} lg={12}>
          <CustomTextArea
            title="GB18130"
            data={gb18130CodeText}
            type={InputType.GB5}
            onTextAreaChanged={onCommonTextChangedHandler}
          />
        </Col>
      </Row>
    </div>
  );
}

interface CustomTextAreaProps {
  data: string;
  type: InputType;
  rows?: number;
  title: string;
  checkboxLabel?: string;
  showCheckbox?: boolean;
  ristrict?: RegExp | string;
  onTextAreaChanged: (data: string, type: InputType) => void;
  onCheckboxChanged?: (data: boolean, type: InputType) => void;
}

function CustomTextArea(props: CustomTextAreaProps) {
  const [value, setValue] = useState(props.data);
  const [showIcon, setShowIcon] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  const {
    title = "",
    checkboxLabel = "",
    showCheckbox = false,
    type,
    rows = 3,
  } = props;

  let placeholderText = "在这里输入字符";

  switch (type) {
    case InputType.UC:
      break;
    case InputType.U8:
      break;
    case InputType.U8H:
      break;
    case InputType.U16:
      break;
    case InputType.U32:
      break;
    case InputType.B64:
      break;
    case InputType.URL:
      break;
    case InputType.DEC:
      break;
    default:
      break;
  }

  useEffect(() => {
    setValue(props.data);
  }, [props]);

  function onTextAreaBlurHandler(event: any) {
    if (event.target.value !== props.data || !event.target.value) {
      props.onTextAreaChanged(event.target.value, props.type);
    }
  }

  function onTextAreaHoverHandler(type: string) {
    if (type === "in") {
      setShowIcon(true);
    } else {
      setShowIcon(false);
    }
  }

  function onTextAreaChangeHandler(event: any) {
    if (props.ristrict) {
      setValue(event.target.value.replace(props.ristrict, ""));
    } else {
      setValue(event.target.value);
    }
  }

  function onChange(event: any) {
    props.onCheckboxChanged(event.target.checked, type);
  }

  function onCopyBtnClickHandler() {
    if (!value) {
      return;
    }
    navigator.clipboard.writeText(value).then(() => {
      api.open({
        message: "复制成功!",
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
      });
    });
  }

  function onClearBtnClickHandler() {
    setValue("");
    props.onTextAreaChanged("", props.type);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {contextHolder}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={5}>{title}</Title>
        {showCheckbox && (
          <Checkbox onChange={onChange}>{checkboxLabel}</Checkbox>
        )}
      </div>
      <div
        style={{ position: "relative" }}
        onMouseEnter={() => onTextAreaHoverHandler("in")}
        onMouseLeave={() => onTextAreaHoverHandler("out")}
      >
        <TextArea
          value={value}
          rows={rows}
          onChange={onTextAreaChangeHandler}
          onBlur={onTextAreaBlurHandler}
          placeholder={placeholderText}
        />
        {showIcon && (
          <div
            style={{
              position: "absolute",
              top: 5,
              right: 5,
            }}
          >
            <CopyTwoTone
              // twoToneColor="#1a8c16"
              twoToneColor="errorValue"
              onClick={onCopyBtnClickHandler}
              title="copy"
            />
            <DeleteTwoTone
              twoToneColor="errorValue"
              style={{ marginLeft: "5px" }}
              title="clear"
              onClick={onClearBtnClickHandler}
            />
          </div>
        )}
      </div>
    </div>
  );
}
