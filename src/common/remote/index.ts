import { getFetchUrl } from "Helper/index";

interface respondInfo {
  error?: boolean;
  data?: any;
  msg?: string;
}

export function callRemoteFunction<T>(
  serviceMethod: string,
  params: T,
  method = "get"
) {
  if (params === null) {
    return { type: serviceMethod, respond: null as any };
  }
  const url = getFetchUrl(serviceMethod, params, method);
  const options: RequestInit = {};
  options.method = method;

  return fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      const respond: respondInfo = {};
      respond.error = result.error ?? false;
      respond.msg = result.msg ?? "";
      respond.data = result.data ?? null;
      return { type: serviceMethod, respond: respond };
    })
    .catch((error) => {
      console.log(error);
      const respond: respondInfo = {};
      respond.error = true;
      respond.msg = `encounter error`;
      respond.data = null;
      return { type: serviceMethod, respond: respond };
    });
}
