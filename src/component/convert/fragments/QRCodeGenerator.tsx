import { useState, useEffect } from "react";
import QRCodeSVG from "qrcode.react";
import {
  LinkOutlined,
  AlignLeftOutlined,
  LoadingOutlined,
  HighlightOutlined,
  BgColorsOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";
import { Input, Button, message, Menu, Spin, Select, Image } from "antd";
import { SketchPicker } from "react-color";
import * as htmlToImage from "html-to-image";
import defaultQRCode from "../../../../static/images/default_qrcode.png";

export default function qrCodeGenerator() {
  const [inputValue, setInputValue] = useState("");
  const [textAreaValue, setTextArea] = useState("");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFF");
  const [showQRcode, setShowQRcode] = useState("");
  const [hidden, setHidden] = useState(false);
  const [bghidden, setBgHidden] = useState(false);
  const [sizeHidden, setSizeHidden] = useState(false);
  const [chsize, setChSize] = useState<number | null>(220);
  const [menu, setMenu] = useState("link");
  const [showSpin, setShowSpin] = useState(false);

  const defaultValue = 220;

  const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;

  function handleConvert() {
    setShowSpin(true);

    function handleInputValue(value: string, errorMessage: string) {
      if (value.trim() === "" || parseFloat(value) < 0) {
        if (value.trim() === "") {
          message.error(errorMessage);
        } else {
          message.error("The value cannot be minus！");
        }
        setShowQRcode("");
        setShowSpin(false);
        return true;
      }
      return false;
    }

    if (
      menu === "link" &&
      handleInputValue(inputValue, "请在URL框输入转换内容！")
    ) {
      return;
    }
    if (
      menu === "text" &&
      handleInputValue(textAreaValue, "请在Message框输入转换内容！")
    ) {
      return;
    }

    function QRCodeSizeHandler(value: string) {
      if (chsize < 0 || chsize == 0) {
        setShowQRcode(value);
        message.error("The size cannot be minus！");
      } else if (chsize > 0 && chsize <= 50) {
        setShowQRcode(value);
        message.warning(
          "Generate QR code size is too small.You need modify a more appropriate value!"
        );
      } else {
        setShowQRcode(value);
      }
      setHidden(false);
      setBgHidden(false);
      setShowSpin(false);
    }
    if (menu === "link") {
      QRCodeSizeHandler(inputValue);
      return;
    }
    if (menu === "text") {
      QRCodeSizeHandler(textAreaValue);
      return;
    }
  }

  function onColorChangeHandler(color: { hex: string }) {
    setFgColor(color.hex);
    setHidden(false);
  }

  function onBGColorChangeHandler(color: { hex: string }) {
    setBgColor(color.hex);
    setBgHidden(false);
  }

  function onMenuItemClickHandler(menuItem: { key: string }) {
    setMenu(menuItem.key);
    setShowQRcode("");
    setHidden(false);
    setBgHidden(false);
  }

  function onSizeChangeHandler(size: React.ChangeEvent<HTMLInputElement>) {
    setShowQRcode("");
    const newSize =
      size.target.value === "" ? 220 : parseInt(size.target.value, 10);
    setChSize(newSize);
    if (size.target.value === "") {
      setChSize(220);
      setShowQRcode("");
    }
  }

  function onSelectChangeHandler(value: number) {
    setChSize(value);
  }

  const svgElement = document.getElementById("qrcode-svg");
  if (svgElement) {
    htmlToImage.toSvg(svgElement);
  }

  function onDownloadQRCodeImageHandler(downloadType: string) {
    if (!showQRcode) {
      message.error("Generate QR code first.");
      return;
    }

    const qrcodeImage = document.getElementById("qrcode-svg");
    if (qrcodeImage) {
      let downloadFunc: any;
      let extension: string;

      if (downloadType === "svg") {
        downloadFunc = htmlToImage.toSvg;
        extension = "svg";
      } else if (downloadType === "png") {
        downloadFunc = htmlToImage.toPng;
        extension = "png";
      } else {
        message.error("Invalid download type.");
        return;
      }
      downloadFunc(qrcodeImage)
        .then((dataUrl: string) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `qrcode.${extension}`;
          link.click();
        })
        .catch((error: string) => {
          console.error("Error gernerating ${extension}:", error);
        });
    }
  }

  function onConverterChangeHandler(content: ComponentProps) {
    if (content.type === "link") {
      setInputValue(content.value);
    } else if (content.type === "text") {
      setTextArea(content.value);
    }
  }

  function handleReset() {
    setShowQRcode("");
    setChSize(defaultValue);
    setInputValue("");
    setTextArea("");
    setHidden(false);
    setBgHidden(false);
    setSizeHidden(false);
    setFgColor("#000000");
    setBgColor("#fff");
  }

  const QRCodeComponentProps: any = {
    className: "pd10",
    id: "qrcode-svg",
    style: { maxHeight: "100%", maxWidth: "100%" },
    value: showQRcode,
    size: chsize,
    bgColor: bgColor,
    fgColor: fgColor,
    level: "L",
    includeMargin: false,
    imageSettings: {
      src: "",
      x: 56,
      y: 0,
      height: 24,
      width: 24,
      excavate: true,
    },
  };

  return (
    <div className="wrap-grid">
      <div className="greyLine">
        <Menu
          mode="vertical"
          selectedKeys={[menu]}
          onClick={onMenuItemClickHandler}
        >
          <Menu.Item key="link" className="text-c menu-item-bg cursor-p">
            <LinkOutlined />
            <label className="margin-l5 cursor-p">Link</label>
          </Menu.Item>
          <Menu.Item key="text" className="text-c menu-item-bg cursor-p">
            <AlignLeftOutlined />
            <label className="margin-l5 cursor-p">Text</label>
          </Menu.Item>
        </Menu>
      </div>
      <div className="margin-l10 margin-t15 margin-l5 flex">
        <div>
          <Converter
            show={menu}
            text={inputValue}
            areaText={textAreaValue}
            onBlur={onConverterChangeHandler}
          />
          <Button
            className="timestamp-button margin-b10 qrcode-btn qrcode-btn-p primary-button"
            onClick={handleConvert}
          >
            Generate Your New QRCode
          </Button>
          <Button
            className="timestamp-button margin-b10 qrcode-btn qrcode-btn-p primary-button"
            onClick={handleReset}
          >
            Reset
          </Button>

          <div className="modify-color-btn dis-inb" style={{ width: "32px" }}>
            <div className="flex h-center v-middle">
              <HighlightOutlined className="fontSize18" />
            </div>
          </div>

          <div className="dis-inb cursor-link">
            <div className="flex pd5" onClick={() => setHidden(!hidden)}>
              <label className="cursor-link qr-text">
                Choose QRCode Color:　
              </label>
              <div
                className="colorbox colorbox-shadow pd5 dis-inb"
                style={{ backgroundColor: fgColor }}
              ></div>
            </div>
            {hidden && (
              <div className="subitem-bg position-a index20 pd10">
                <SketchPicker
                  color={fgColor}
                  onChange={onColorChangeHandler}
                ></SketchPicker>
              </div>
            )}
          </div>
          <div>
            <div className="modify-color-btn dis-inb" style={{ width: "32px" }}>
              <div className="flex h-center v-middle">
                <BgColorsOutlined className="fontSize18" />
              </div>
            </div>

            <div className="dis-inb cursor-link">
              <div className="flex pd5" onClick={() => setBgHidden(!bghidden)}>
                <label className="cursor-link qr-text">
                  Choose BackGround Color:　
                </label>
                <div
                  className="colorbox colorbox-shadow pd5 dis-inb"
                  style={{ backgroundColor: bgColor }}
                ></div>
              </div>
              {bghidden && (
                <div className="subitem-bg position-a index20 pd10">
                  <SketchPicker
                    color={bgColor}
                    onChange={onBGColorChangeHandler}
                  ></SketchPicker>
                </div>
              )}
            </div>
          </div>

          <div
            className="modify-color-btn cursor-link dis-inb"
            style={{ width: "32px" }}
          >
            <div className="flex h-center v-middle">
              <FullscreenOutlined className="fontSize18" />
            </div>
          </div>
          <div className="cursor-link dis-inb">
            <div
              className="flex pd5"
              onClick={() => setSizeHidden(!sizeHidden)}
            >
              <label className="cursor-link qr-text">
                Choose QRCode Size:　
              </label>
            </div>
          </div>

          {sizeHidden && (
            <div className="subitem-bg pd10" style={{ width: 350 }}>
              <Input
                placeholder="type value(number) change size"
                value={defaultValue ? undefined : chsize}
                type="number"
                allowClear
                onChange={onSizeChangeHandler}
              />
              <div className="margin-t10">
                <Select
                  defaultValue={defaultValue}
                  onChange={onSelectChangeHandler}
                  options={[
                    { value: defaultValue, label: " 默认尺寸" },
                    { value: 50, label: 50 },
                    { value: 100, label: 100 },
                    { value: 200, label: 200 },
                    { value: 300, label: 300 },
                    { value: 400, label: 400 },
                    { value: 500, label: 500 },
                  ]}
                ></Select>
              </div>
              <div className="fontSize12 pd5">当前的size值是: {chsize}</div>
            </div>
          )}
        </div>
        <div className="margin-l15">
          <div
            className="div-flex h-center v-middle qrcode-box margin-t10"
            style={{ width: chsize + 20, height: chsize + 20 }}
          >
            {showSpin && <Spin indicator={antIcon} />}
            {showQRcode === "" && <Image src={defaultQRCode} preview={false} />}
            {showQRcode && <QRCodeSVG {...QRCodeComponentProps} />}
          </div>
          <div>
            <label className="fontSize12 c-red">
              注: 生成二维码的默认尺寸是 220*220
            </label>
          </div>
          <div>
            <Button
              className="qrcode-btn margin-t5 margin-r5 primary-button"
              value={"svg"}
              onClick={() => {
                onDownloadQRCodeImageHandler("svg");
              }}
            >
              Download SVG
            </Button>
            <Button
              className="qrcode-btn margin-t5 primary-button"
              value={"png"}
              onClick={() => {
                onDownloadQRCodeImageHandler("png");
              }}
            >
              Download PNG
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ConverterProps {
  show: string;
  text: string;
  areaText: string;
  onBlur: (v: ComponentProps) => void;
}

interface ComponentProps {
  text?: string;
  areaText?: string;
  value: string;
  type: string;
}

function Converter(props: ConverterProps) {
  const { TextArea } = Input;

  const [text, setText] = useState("");
  const [areaText, setAreaText] = useState("");
  const [type, setType] = useState<string>(props.show);

  useEffect(() => {
    setType(props.show);
    setText(props.text);
    setAreaText(props.areaText);
  }, [props]);

  function onInputValueChangeHandler(
    linkValue: React.ChangeEvent<HTMLInputElement>
  ) {
    setText(linkValue.target.value);
  }

  function onTextAreaValueChangeHandler(
    textareaValue: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setAreaText(textareaValue.target.value);
  }

  function onInputBlurHandler() {
    const inputValue: ComponentProps = { value: text, type: "link" };
    props?.onBlur(inputValue);
  }

  function onTextAreaBlurHandler() {
    const textareaValue: ComponentProps = { value: areaText, type: "text" };
    props?.onBlur(textareaValue);
  }

  if (type === "link") {
    return (
      <div>
        <label className="title-fontSize font-wb qr-title">Link</label>
        <div className="margin-b10 qr-text">
          <label>URL</label>
          <Input
            placeholder="type a http://"
            value={text}
            allowClear
            onBlur={onInputBlurHandler}
            onChange={onInputValueChangeHandler}
          />
        </div>
      </div>
    );
  } else if (type === "text") {
    return (
      <div>
        <label className="title-fontSize font-wb qr-title">Text</label>
        <div className="margin-b10 qr-text">
          <label>Message</label>
          <TextArea
            placeholder="type some messages"
            value={areaText}
            allowClear
            onBlur={onTextAreaBlurHandler}
            onChange={onTextAreaValueChangeHandler}
          />
        </div>
      </div>
    );
  }
}
