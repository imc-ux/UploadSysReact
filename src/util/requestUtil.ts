// const serviceUrl = 'http://109.14.20.45:6636/ux';
const serviceUrl = "http://109.14.6.43:6636/ux";
const testUrl = "/lxz";
const url = document.location.protocol + "//" + document.location.host;
const isLocal = url.includes("127.0.0.1") || url.includes("localhost");

export function callService(
  method: string,
  parameters?: any,
  requestType: string = "get",
  isDecode = true
) {
  const xhr: XMLHttpRequest = new XMLHttpRequest();
  let requestURL: string = `${isLocal ? serviceUrl : serviceUrl}/${method}`;
  if (requestType === "get" && parameters) {
    if (isDecode) {
      requestURL += `?jsonString=${encodeURIComponent(
        encodeURIComponent(JSON.stringify(parameters))
      )}`;
    } else {
      requestURL += `?jsonString=${encodeURIComponent(
        encodeURIComponent(parameters)
      )}`;
    }
  }
  xhr.open(requestType, requestURL, true);
  xhr.setRequestHeader("Content-type", "application/json");

  if (requestType === "post") {
    if (typeof parameters === "object") {
      xhr.send(JSON.stringify(parameters));
    } else {
      xhr.send(parameters);
    }
  } else if (requestType === "get") {
    xhr.send();
  }

  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        resolve(xhr.responseText);
      } else if (
        xhr.readyState === XMLHttpRequest.DONE &&
        (xhr.status == 500 || xhr.status == 503)
      ) {
        reject(xhr.responseText);
      } else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status == 404) {
        reject(xhr.responseText);
      }
    };
    xhr.onerror = () => {
      reject({ error: true, msg: "网络错误", data: null });
    };
  });
}
