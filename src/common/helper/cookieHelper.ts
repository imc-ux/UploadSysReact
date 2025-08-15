export function setCookie(name: string, value: string, duration: number = 30) {
  const expdate: any = new Date();
  expdate.setTime(expdate.getTime() + duration * 24 * 60 * 60 * 1000); //保存的期限，毫秒计算
  document.cookie =
    name +
    "=" +
    encodeURIComponent(value) +
    ";expires=" +
    expdate.toGMTString() +
    ";path=/";
}

export function getCookie(c_name: string): string {
  if (document.cookie.length > 0) {
    // 获取对应字段在cookie字符串的位置
    var c_start: number = document.cookie.indexOf(c_name + "=");
    var c_end: number;
    if (c_start !== -1) {
      c_start = c_start + c_name.length + 1;
      c_end = document.cookie.indexOf(";", c_start);
      if (c_end === -1) c_end = document.cookie.length;
      return decodeURIComponent(document.cookie.substring(c_start, c_end));
    }
  }
  return "";
}
