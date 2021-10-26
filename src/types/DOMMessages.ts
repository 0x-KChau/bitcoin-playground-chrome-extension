export type DOMMessage = {
  type: string,
  payload: any,
}

export type DOMMessageResponse = {
  status: 200 | 404 | 403;
  message: string[] | string;
}