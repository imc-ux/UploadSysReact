import React, { useState, useEffect } from "react";
import { Button, Input, Select } from "antd";
import { copyHandler } from "@/component/convert/fragments/helper/TextCopy";

const TYPELIST = [
  { label: "秒(s)", value: "s" },
  { label: "毫秒(ms)", value: "ms" },
];
export default function TimeStamp() {
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [typeChange, setTypeChange] = useState(false);
  const [timeInput, setTimeInput] = useState("");
  const [timeOutput, setTimeOutput] = useState("");
  const [timestampInput, setTimestampInput] = useState("");
  const [timestampOutput, setTimestampOutput] = useState(null);
  const [nowTimeStampType, setNowTimeStampType] = useState(TYPELIST[1].value);
  const [timeType, setTimeType] = useState(TYPELIST[0].value);

  useEffect(() => {
    if (!typeChange) {
      setInterval(() => {
        setCurrentTime(getCurrentTime());
      }, 1000);
    }
  }, []);

  function getCurrentTime(): number {
    return new Date().getTime();
  }

  function onTimestampCopyHandler() {
    const _window: any = window;
    if (_window.clipboardData && _window.clipboardData.setData) {
      if (nowTimeStampType === "s") {
        return _window.clipboardData.setData(
          "Text",
          Math.floor(currentTime / 1000)
        );
      } else {
        return _window.clipboardData.setData("Text", currentTime);
      }
    } else if (navigator.clipboard?.writeText) {
      if (nowTimeStampType === "s") {
        return navigator.clipboard.writeText(
          Math.floor(currentTime / 1000).toString()
        );
      } else {
        return navigator.clipboard.writeText(currentTime.toString());
      }
    } else if (document.queryCommandSupported("copy")) {
      if (nowTimeStampType === "s") {
        copyHandler(Math.floor(currentTime / 1000).toString());
      } else {
        copyHandler(currentTime.toString());
      }
    }
  }

  function onTimeInputChangeHandler(
    timeinput: React.ChangeEvent<HTMLInputElement>
  ): void {
    setTimeInput(timeinput.target.value);
  }

  function onTimeClickHandler() {
    if (timeInput.length === 13) {
      setTimeOutput(
        new Date(Number(timeInput)).toLocaleString("chinese", { hour12: false })
      );
    } else if (timeInput.length === 10) {
      setTimeOutput(
        new Date(Number(timeInput) * 1000).toLocaleString("chinese", {
          hour12: false,
        })
      );
    }
  }

  function onTimestampInputChangeHandler(
    timestampinput: React.ChangeEvent<HTMLInputElement>
  ): void {
    setTimestampInput(timestampinput.target.value);
  }

  function onTimestampClickHandler() {
    if (timeType === "s") {
      setTimestampOutput(new Date(timestampInput).getTime() / 1000);
    } else {
      setTimestampOutput(new Date(timestampInput).getTime());
    }
  }

  function onTimeSelectChangeHandler(e: any) {
    setTimeType(e);
  }

  function onNowTimeStampSelectChangeHandler(e: any) {
    setNowTimeStampType(e);
  }

  return (
    <div className="timestamp">
      <div className="text-stamp">
        <span className="text-stamp-title primary-text">(现在的时间戳是: </span>
        <span className="text-stamp-value danger-text">
          {nowTimeStampType === "s"
            ? Math.floor(currentTime / 1000)
            : currentTime}
        </span>
        <span className="text-stamp-title"> )</span>
        <Button
          style={{
            paddingLeft: 10,
            height: 25,
            paddingTop: 2,
            borderRadius: 5,
            textAlign: "center",
          }}
          className="copy-button-timestamp primary-button"
          onClick={onTimestampCopyHandler}
        >
          复制
        </Button>
        <Select
          className="now-time-stamp"
          options={TYPELIST}
          defaultValue={nowTimeStampType}
          onChange={onNowTimeStampSelectChangeHandler}
        ></Select>
      </div>
      <div className="timestamp-content">
        <div className="timestamp-content-position">
          <div className="div-flex">
            <div>
              <div className="div-flex">
                <div className="text-width label-color">时间戳：</div>
                <div>
                  <Input
                    type="text"
                    className="timestamp-input"
                    style={{ width: 250 }}
                    value={timeInput}
                    onChange={onTimeInputChangeHandler}
                  />
                </div>
              </div>
              <div className="timestamp-button-lineheight">
                <Button
                  style={{
                    paddingLeft: 10,
                    paddingTop: 2,
                    borderRadius: 5,
                    textAlign: "center",
                  }}
                  className="timestamp-button primary-button"
                  onClick={onTimeClickHandler}
                >
                  转换为北京时间
                </Button>
              </div>
              <div className="div-flex">
                <div className="text-width label-color">北京时间：</div>
                <div className="input-flex">
                  <Input
                    type="text"
                    placeholder="转换后的北京时间"
                    style={{ width: 250 }}
                    className="ToBeijingtime-input"
                    readOnly
                    value={timeOutput}
                  />
                </div>
              </div>
            </div>

            <div className="timestamp-line"></div>
            <div>
              <div className="div-flex">
                <div className="beijingtime-text label-color">北京时间：</div>
                <div>
                  <Input
                    type="text"
                    className="timestamp-input"
                    style={{ width: 250 }}
                    onChange={onTimestampInputChangeHandler}
                    value={timestampInput}
                  />
                </div>
              </div>
              <div className="timestamp-button-lineheight">
                <Select
                  className="type-select"
                  options={TYPELIST}
                  defaultValue={timeType}
                  onChange={onTimeSelectChangeHandler}
                ></Select>
                <Button
                  style={{
                    paddingLeft: 10,
                    paddingTop: 2,
                    borderRadius: 5,
                    textAlign: "center",
                  }}
                  className="Beijingtime-button primary-button"
                  onClick={onTimestampClickHandler}
                >
                  转换为时间戳
                </Button>
              </div>
              <div className="div-flex">
                <div className="text-width label-color">时间戳： </div>
                <div className="input-flex">
                  <Input
                    type="text"
                    placeholder="转换后的时间戳"
                    style={{ width: 250 }}
                    className="Totimestamp-input"
                    readOnly
                    value={timestampOutput}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
