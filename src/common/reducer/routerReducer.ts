export function routerReducer(state: string, action: any): string {
  switch (action.type) {
    case "changePage":
      return action.data;
      break;

    default:
      break;
  }
}
