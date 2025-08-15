import { createContext, useContext } from "react";
import { useReducer } from "react";
import { routerReducer } from "Reducer/routerReducer";

const RouterContext = createContext(null);

const DispatchContext = createContext(null);

export function usePage() {
  return useContext(RouterContext);
}

export function useDispatchChangePage() {
  return useContext(DispatchContext);
}

export function RouterProvider(props: any) {
  const [page, dispatch] = useReducer(routerReducer, "/login");

  return (
    <RouterContext.Provider value={page}>
      <DispatchContext.Provider value={dispatch}>
        {props.children}
      </DispatchContext.Provider>
    </RouterContext.Provider>
  );
}
