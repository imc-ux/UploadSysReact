import { setCookie } from "Helper/cookieHelper";
import { getLocalItem, setLocalItem } from "Helper/storageHelper";

const ExtractScriptReg = /(?<=<script\b[^>]*>)[\s\S]*(?=<\/script>)/g;
const ScriptTagReg = /<script\b[^>]*>|<\/script>/g;
const ExtractStyleReg = /(?<=<style\b[^>]*>)[\s\S]*(?=<\/style>)/g;
const StyleTagReg = /<style\b[^>]*>|<\/style>/g;

function extractTagContent(str: string, Reg1: RegExp, Reg2: RegExp): string {
  if (!str) {
    return "";
  }
  const matchResult = str.match(Reg1);
  if (!matchResult || matchResult.length === 0) {
    return "";
  }
  let result = str.match(Reg1)[0];
  result = result.replace(Reg2, "");
  return result;
}

export function extractScript(str: string) {
  return extractTagContent(str, ExtractScriptReg, ScriptTagReg);
}

export function extractStyle(str: string) {
  return extractTagContent(str, ExtractStyleReg, StyleTagReg);
}

export function insertScript(innerHtml: string) {
  const scriptNode = document.createElement("script");
  const scriptId = `template${getCurrentTimestamp()}script`;
  scriptNode.id = scriptId;
  scriptNode.type = "module";
  const oldScriptId = getLocalItem("scriptId") || "";
  setLocalItem("scriptId", `${oldScriptId};${scriptId}`);
  const head = document.getElementsByTagName("head")[0];
  scriptNode.innerHTML = innerHtml;
  head.append(scriptNode);
}

export function insertStyle(innerHtml: string) {
  const styleNode = document.createElement("style");
  const styleId = `template${getCurrentTimestamp()}style`;
  styleNode.id = styleId;
  const oldStyleId = getLocalItem("styleId") || "";
  setLocalItem("styleId", `${oldStyleId};${styleId}`);
  const head = document.getElementsByTagName("head")[0];
  styleNode.innerHTML = innerHtml;
  head.append(styleNode);
}

function getCurrentTimestamp(): string {
  return new Date().getTime().toString();
}

export function splitTemplate(template: string) {
  const scriptInner = extractScript(template);
  const styleInner = extractStyle(template);
  insertScript(scriptInner);
  insertStyle(styleInner);
}

export function removeOldScriptAndStyle() {
  const oldScriptIdString = getLocalItem("scriptId") ?? "";
  const oldScriptIds = oldScriptIdString.split(";");
  oldScriptIds.forEach((item) => {
    document.getElementById(item)?.remove();
  });
  const oldStyleIdString = getLocalItem("styleId") ?? "";
  const oldStyleIds = oldStyleIdString.split(";");
  oldStyleIds.forEach((item) => {
    document.getElementById(item)?.remove();
  });
}
