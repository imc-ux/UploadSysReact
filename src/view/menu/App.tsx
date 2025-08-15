import { useDispatch } from "Common/context/CommonContext";
import { useEffect, useRef } from "react";
import {
  getValidateMenuTemplate,
  getValidateNotice,
} from "@/common/action/mainActions";
import Router from "Router/Router";

export default function App(props: any) {
  const dispatch = useDispatch();

  const workerRef = useRef(null);

  useEffect(() => {
    dispatchGetMenuTemplate();
    dispatchGetSubMenuResources();
    createWorker();

    return () => {
      workerRef.current.postMessage("clearTimmer");
    };
  }, []);

  function createWorker() {
    if (window.Worker) {
      workerRef.current = new Worker(
        new URL("@/worker/pollingWorker.ts", import.meta.url)
      );
      workerRef.current.onmessage = (e: any) => {
        dispatch(e.data);
      };
    }
  }

  async function dispatchGetMenuTemplate() {
    const action = await getValidateMenuTemplate();
    dispatch(action);
  }

  async function dispatchGetSubMenuResources() {
    const action = await getValidateNotice();
    dispatch(action);
  }

  return <Router />;
}
