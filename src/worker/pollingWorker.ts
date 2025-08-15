import {
  getValidateMenuTemplate,
  getValidateNotice,
} from "Common/action/mainActions";

onmessage = function (e: any) {
  clearInterval(timmer);
  timmer = null;
};

let timmer = setInterval(async () => {
  const templateAction = await getValidateMenuTemplate();
  postMessage(templateAction);
  const resourceAction = await getValidateNotice();
  postMessage(resourceAction);
}, 1800 * 1000);
