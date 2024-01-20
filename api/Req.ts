import type { AxiosRequestConfig } from "axios";
import axios from "axios";

const Req = axios.create({
  baseURL: "https://godev.nham24.com",
});

const get = <V>(url: string, config?: AxiosRequestConfig<any> | undefined) =>
  Req.get<V>(url, config).then((res) => res.data);
const post = <T, V>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig<any> | undefined
) => Req.post<T>(url, data, config).then((res) => res.data);
const put = <T, V>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig<any> | undefined
) => Req.put<T>(url, data, config).then((res) => res.data);

const patch = <T, V>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig<any> | undefined
) => Req.patch<T>(url, data, config).then((res) => res.data);
const remove = <T, V>(
  url: string,
  config?: AxiosRequestConfig<any> | undefined
) => Req.delete<T>(url, config).then((res) => res.data);

export default {
  get,
  post,
  put,
  patch,
  remove,
};
