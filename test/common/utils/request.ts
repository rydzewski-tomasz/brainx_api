import { Response, SuperAgentRequest } from 'superagent';
import { requestUtil } from '../setup/initFullEnv';

export type UrlElement = number | string;

async function getRequest(url: string, accessToken?: string): Promise<Response> {
  const request = requestUtil.get(url).send();
  return makeRequest(request, accessToken);
}

async function postRequest(url: string, requestBody: any, accessToken?: string): Promise<Response> {
  const request = requestUtil.post(url);
  return makeRequest(request, accessToken, requestBody);
}

async function putRequest(url: string, requestBody: any, accessToken?: string): Promise<Response> {
  const request = requestUtil.put(url);
  return makeRequest(request, accessToken, requestBody);
}

async function deleteRequest(url: string, requestBody: any, accessToken?: string): Promise<Response> {
  const request = requestUtil.delete(url);
  return makeRequest(request, accessToken, requestBody);
}

async function makeRequest(request: SuperAgentRequest, accessToken?: string, requestBody?: any): Promise<Response> {
  if (accessToken) {
    request.set({ accessToken });
  }

  return request.send(requestBody);
}

export default { get: getRequest, post: postRequest, delete: deleteRequest, put: putRequest };
