import axios from "axios";
import router from "@/router";
import { REQUEST_URL } from "@/components/CONST";
// 根域名
// 超时时间
// 请求拦截器/响应拦截器

const request = axios.create({
  baseURL: REQUEST_URL,
  timeout: 5000,
});

request.interceptors.request.use(
  (config) => {
    // const token = getToken();
    // console.log("测试", token, config);
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    //   // console.log(token, config);
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const err = error.response.status;
    console.dir(err);
    if (err === 401) {
      // removeToken();
      router.navigate("/home");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export { request };
