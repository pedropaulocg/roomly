import service from "./service"

const request = async ({url, method, data, params, headers = {}}: {url: string, method: string, data?: any, params?: any, headers?: any}): Promise<any> => {
  const api = service();

    const requestConfig = {
    url,
    params,
    method,
    data,
    headers: {
      ...api.defaults.headers,
      ...headers,
    },
  };

  try {
    const response = await api.request(requestConfig);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

export default request;