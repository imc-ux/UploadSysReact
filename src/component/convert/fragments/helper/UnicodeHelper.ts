import { htmlStringObj } from "@/util/htmlNameCode";
import iconv from "iconv-lite";
// var iconv = require('iconv-lite');

type GBCharset = "GB2312" | "GBK" | "GB18030";

/**
 * 判断输入是否为空
 */
function isEmpty(data: string): boolean {
  return !data && data.length === 0;
}

export function stringToUnicode(data: string): string {
  const inputData = data.trim();
  if (isEmpty(inputData)) {
    return "";
  }
  let unicodeString = "";
  for (let i = 0; i < inputData.length; i++) {
    const code = inputData.codePointAt(i);
    unicodeString += `u+${inputData.codePointAt(i).toString(16)}`;
    if (code > 0xffff) {
      i++;
    }
  }
  return unicodeString;
}

/**
 * 判断字符串数组每个元素是否为合法的unicode编码
 */
function isUnicode(unicodeArray: string[]): boolean {
  return unicodeArray.every(
    (item) => !isNaN(Number(`0x${item}`)) && Number(`0x${item}`) <= 0x10ffff
  );
}

/**
 * 用编码前缀分割数组，如果第一个元素为空，去除第一个元素
 */
function customSplit(data: string, symbol: string) {
  const returnArr = data.split(symbol);
  if (returnArr[0].length === 0) {
    returnArr.shift();
  }
  return returnArr;
}

export function unicodeToString(data: string): string {
  const inputData = data.trim();
  if (isEmpty(inputData)) {
    return "";
  }
  let commonString = "";
  const inputString = inputData.toLowerCase();
  if (inputString.includes("u+")) {
    const unicodeArr = customSplit(inputString, "u+");
    if (isUnicode(unicodeArr)) {
      unicodeArr.forEach((item) => {
        commonString += String.fromCodePoint(Number(`0x${item}`));
      });
    } else {
      return inputData;
    }
  } else {
    return inputData;
  }
  return commonString;
}

export function stringToUTF8(
  data: string,
  removeFlag: boolean = false
): string {
  const inputData = data.trim();
  if (isEmpty(inputData)) {
    return "";
  }
  const encoder = new TextEncoder();
  let utf8String = "";
  for (let i = 0; i < inputData.length; i++) {
    const code = inputData.codePointAt(i);
    const str = String.fromCodePoint(code);
    const uint8Array = encoder.encode(str);
    uint8Array.forEach((item) => {
      utf8String += removeFlag ? item.toString(16) : `\\x${item.toString(16)}`;
    });
    if (code > 0xffff) {
      i++;
    }
  }
  return utf8String;
}

/**
 * 将16进制字符串转为十进制数字，非法字符串算作0
 */
function hexCodeToDecNumber(data: string): number {
  let hexNumber = 0;
  if (data.includes("0x")) {
    hexNumber = Number(data);
  } else {
    hexNumber = Number(`0x${data}`);
  }
  if (isNaN(hexNumber)) {
    return 0;
  } else {
    return Number(hexNumber.toString(10));
  }
}

/**
 * 将16进制字符串转为十进制数字数组
 */
function getHexToDecArray(data: string): number[] {
  const returnArr = [];
  if (data.length < 2) {
    return [hexCodeToDecNumber(`0${data}`)];
  } else if (data.length !== 2) {
    for (let i = 0; i < data.length; i++) {
      const substring = data.substring(i, i + 2);
      if (substring.length === 2) {
        returnArr.push(hexCodeToDecNumber(substring));
        i++;
      } else {
        returnArr.push(hexCodeToDecNumber(`0${substring}`));
      }
    }
  }
  return returnArr;
}

export function uTF8ToString(data: string) {
  const inputData = data.trim();
  if (isEmpty(inputData)) {
    return "";
  }
  let commonString = "";
  const inputValue = inputData.toLowerCase();
  const decoder = new TextDecoder();
  if (inputValue.includes("\\x")) {
    const utf8Arr = customSplit(inputValue, "\\x");
    const decArr: any[] = [];
    utf8Arr.forEach((item) => {
      if (item) {
        if (item.length == 2) {
          decArr.push(hexCodeToDecNumber(`0x${item}`));
        } else {
          decArr.push(...getHexToDecArray(item));
        }
      }
    });
    const bufferArr = new Uint8Array(decArr);
    commonString = decoder.decode(bufferArr);
  } else {
    const decArr: any[] = getHexToDecArray(inputValue);
    const bufferArr = new Uint8Array(decArr);
    commonString = decoder.decode(bufferArr);
  }
  return commonString;
}

/**
 * 在前面填充0
 */
function addZeroToHead(data: string, lastLength: number): string {
  if (data.length === lastLength) {
    return data;
  } else if (data.length < lastLength) {
    let tempData = data;
    for (let i = 0; i < lastLength - data.length; i++) {
      tempData = `0${tempData}`;
    }
    return tempData;
  }
}

export function stringToUTF16(
  data: string,
  removeFlag: boolean = false
): string {
  const inputData = data.trim();
  if (isEmpty(inputData)) {
    return "";
  }
  let utf16String = "";
  for (let i = 0; i < inputData.length; i++) {
    const code = inputData.codePointAt(i);
    if (code > 0xffff) {
      const utf16ArrString = JSON.stringify(
        String.fromCodePoint(code).split("")
      );
      utf16String += utf16ArrString
        .substring(2, utf16ArrString.length - 2)
        .replace(/","/g, "");
      i++;
    } else {
      utf16String += `\\u${code.toString(16)}`;
    }
  }
  const lastStringArr: any[] = [];
  const tempArr = utf16String.split("\\u");
  tempArr.shift();
  tempArr.forEach((item) => {
    lastStringArr.push(addZeroToHead(item, 4));
  });
  utf16String = removeFlag
    ? lastStringArr.join("")
    : `\\u${lastStringArr.join("\\u")}`;
  return utf16String;
}

/**
 * 将16进制字符串转为十进制数字，非法字符串直接返回该字符串
 */
function hexCodeToDecNumberOrString(data: string): number | string {
  let hexNumber = 0;
  if (data.includes("0x")) {
    hexNumber = Number(data);
  } else {
    hexNumber = Number(`0x${data}`);
  }
  if (isNaN(hexNumber)) {
    return data;
  } else {
    return Number(hexNumber.toString(10));
  }
}

/**
 * 处理字符串，合法16进制编码直接转换，不合法的直接拼接在后面
 */
function getCommonString(data: string, hexLength: number) {
  let commonString = "";
  if (data.length < hexLength) {
    return data;
  } else {
    let hexArr: any[] = [];
    for (let i = 0; i < data.length; i++) {
      const substring = data.substring(i, i + hexLength);
      if (substring.length === hexLength) {
        if (isNumber(hexCodeToDecNumberOrString(substring))) {
          hexArr.push(hexCodeToDecNumberOrString(substring));
        } else {
          commonString += substring;
        }
        i = i + hexLength - 1;
      } else {
        if (hexArr.length > 0) {
          commonString += String.fromCodePoint(...hexArr);
          hexArr = [];
        }
        commonString += substring;
      }
    }
    if (hexArr.length > 0) {
      commonString += String.fromCodePoint(...hexArr);
    }
  }
  return commonString;
}

/**
 * 判断是否为数字，且在Unicode范围内
 */
function isNumber(data: string | number): boolean {
  return !isNaN(Number(data)) && Number(data) <= 0x10ffff;
}

/**
 * 转换合法16进制字符串，直接拼接非法字符串
 */
function convertValidHexConnectInvalid(
  data: string,
  symbol: string,
  codeLength: number,
  removeFlag: boolean
): string {
  let commonString = "";
  if (data.includes(symbol)) {
    const inputArr = data.split(symbol);
    let hexArr: any[] = [];
    inputArr.forEach((item) => {
      if (item) {
        if (item.length === codeLength) {
          if (isNumber(`0x${item}`)) {
            hexArr.push(`0x${item}`);
          } else {
            commonString += item;
          }
        } else {
          if (item.length > codeLength) {
            if (isNumber(`0x${item.substring(0, codeLength)}`)) {
              hexArr.push(`0x${item.substring(0, codeLength)}`);
            }
            if (hexArr.length > 0) {
              commonString += String.fromCodePoint(...hexArr);
              hexArr = [];
            }
            if (!isNumber(`0x${item.substring(0, codeLength)}`)) {
              commonString += item.substring(0, codeLength);
            }
            commonString += item.substring(codeLength);
          } else {
            commonString += item;
          }
        }
      }
    });
    if (hexArr.length > 0) {
      commonString += String.fromCodePoint(...hexArr);
    }
  } else {
    if (!removeFlag) {
      return data;
    } else {
      return getCommonString(data, codeLength);
    }
  }
  return commonString;
}

export function uTF16ToString(data: string, removeFlag: boolean = false) {
  const inputData = data.trim();
  if (isEmpty(inputData)) {
    return "";
  }
  const inputValue = inputData.toLowerCase().trim();
  let commonString = "";
  commonString = convertValidHexConnectInvalid(
    inputValue,
    "\\u",
    4,
    removeFlag
  );
  return commonString;
}

export function stringToUTF32(
  data: string,
  removeFlag: boolean = false
): string {
  const inputData = data.trim();
  let utf32String = "";
  for (let i = 0; i < inputData.length; i++) {
    const code = inputData.codePointAt(i);
    const codeHex = code.toString(16);
    let codeUtf32 = codeHex;
    codeUtf32 = addZeroToHead(codeHex, 8);
    utf32String += removeFlag ? codeUtf32 : `u+${codeUtf32}`;
    if (code > 0xffff) {
      i++;
    }
  }
  return utf32String;
}

export function utf32ToString(data: string, removeFlag: boolean = false) {
  const inputData = data.trim();
  if (isEmpty(inputData)) {
    return "";
  }
  const inputValue = inputData.toLowerCase().trim();
  let commonString = "";
  commonString = convertValidHexConnectInvalid(inputValue, "u+", 8, removeFlag);
  return commonString;
}

//代替被摈弃的unescape方法
function unescapeForbtoa(str: string) {
  return str.replace(/%([0-9A-F]{2})/g, (match, p1) => {
    return String.fromCharCode(Number(`0x${p1}`));
  });
}

export function stringToBase64(data: string) {
  const inputData = data.trim();
  const urlEncode = encodeURIComponent(inputData);
  const base64String = window.btoa(unescapeForbtoa(urlEncode));
  return base64String;
}

export function base64ToString(data: string) {
  const inputData = data.trim();
  if (isEmpty(inputData)) {
    return "";
  }
  return decodeURIComponent(escape(window.atob(inputData)));
}

export function stringToURLCode(data: string) {
  const inputData = data.trim();
  const urlString = encodeURIComponent(inputData);
  return urlString;
}

export function urlCodeToString(data: string) {
  const inputData = data.trim();
  if (isEmpty(inputData)) {
    return "";
  }
  return decodeURIComponent(inputData);
}

export function stringToDecimal(data: string) {
  const inputData = data.trim();
  let decString = "";
  for (let i = 0; i < inputData.length; i++) {
    const code = inputData.codePointAt(i);
    decString += `${code} `;
    if (code > 0xffff) {
      i++;
    }
  }
  return decString.trim();
}

export function decimalToString(data: string) {
  const inputData = data.trim();
  if (isEmpty(inputData)) {
    return "";
  }
  const inputValue = inputData.trim();
  const inputArr = inputValue.split(/\s+/);
  const decArr: any[] = [];
  inputArr.forEach((item) => {
    if (Number(item) > 1114111) {
      decArr.push(1114111);
    } else {
      decArr.push(Number(item));
    }
  });
  return String.fromCodePoint(...decArr);
}

export function stringToHTMLCode(data: string): string {
  const inputData = data.trim();
  if (isEmpty(inputData)) {
    return "";
  }
  let htmlCodeString = "";
  const decString = stringToDecimal(inputData);
  decString.split(/\s/).forEach((item) => {
    htmlCodeString += `&#${item}; `;
  });
  return htmlCodeString.trim();
}

export function htmlCodeToString(data: string) {
  const inputData = data.trim();
  if (isEmpty(inputData)) {
    return "";
  }
  const decArr: any[] = [];
  const reg = /(?<=&#)(\d+)(?=;)/g;
  const arr = inputData.match(reg) ?? [];

  arr.forEach((item) => {
    if (isNumber(item)) {
      decArr.push(item);
    }
  });
  return decimalToString(decArr.join(" "));
}

export function decNumberToHTMLNameCode(data: string): string {
  const inputData = data.trim();
  if (isEmpty(inputData)) {
    return "";
  }
  let htmlNameString = "";
  const decArr: any[] = inputData.split(/\s+/) ?? [];
  decArr.forEach((item) => {
    if (htmlStringObj[item]) {
      htmlNameString += htmlStringObj[item];
    }
  });
  return htmlNameString;
}

export function htmlNameCodeToDecString(data: string): string {
  const inputData = data.trim();
  if (isEmpty(inputData)) {
    return "";
  }
  let decString = "";
  const htmlCodeArr: any[] = [];
  const reg = /(?<=&)(.+)(?=;)/g;
  const arr = inputData.match(reg) ?? [];

  arr.forEach((item) => {
    htmlCodeArr.push(`&${item};`);
  });
  htmlCodeArr.forEach((item) => {
    for (const key in htmlStringObj) {
      if (htmlStringObj[key] === item) {
        decString += `${key} `;
      }
    }
  });
  return decString.trim();
}

export function stringToGBEncode(
  data: string,
  charSet: GBCharset,
  removeFlag?: boolean
): string {
  if (isEmpty(data)) {
    return;
  }
  const strArr = data.split("");
  let returnStr = "";
  strArr.forEach((item) => {
    const uint8Array = iconv.encode(item, charSet);
    let singleCharCode = "";
    uint8Array.forEach((elem) => {
      let hexStr = elem.toString(16);
      if (charSet === "GB2312" || charSet === "GBK") {
        if (item !== "?" && elem === 63) {
          hexStr = "?";
        }
      }
      singleCharCode += hexStr;
    });
    returnStr += singleCharCode !== "?" ? `\\x${singleCharCode}` : "?";
  });
  return returnStr;
}

export function GBCodeToString(data: string, charSet: GBCharset): string {
  if (isEmpty(data)) {
    return "";
  }
  let hexStr = data;
  if (data.indexOf("\\x") >= 0) {
    hexStr = data.replace(/\\x/g, "");
  }
  const reg = /[^0-9a-fA-F]/g;
  if (reg.test(hexStr)) {
    return "";
  }
  if (hexStr.length % 2 !== 0) {
    return "";
  }
  const uint8Arr = [];
  for (let i = 0; i < hexStr.length; i += 2) {
    uint8Arr.push(
      Number(Number(`0x${hexStr.substring(i, i + 2)}`).toString(10))
    );
  }
  const uint8Array = new Uint8Array(uint8Arr);
  console.log("u8a", uint8Array);
  const decoder = new TextDecoder(charSet.toLowerCase());
  try {
    return decoder.decode(uint8Array);
  } catch (error) {
    return "";
  }
}
