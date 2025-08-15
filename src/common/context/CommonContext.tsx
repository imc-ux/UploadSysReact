import { createContext, useContext, useReducer } from "react";
import { initialState, commonReducer } from "Reducer/commonReducer";

const StateContext = createContext(null);

const DispatchContext = createContext(null);

export function useStore() {
  return useContext(StateContext);
}

export function useDispatch() {
  return useContext(DispatchContext);
}

export function CommonProvider(props: any) {
  const [state, dispatch] = useReducer(commonReducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {props.children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}
