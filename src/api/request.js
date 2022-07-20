import axios from "axios";

const service = axios.create({
  timeout: 5000,
  baseURL: "/api",
});

service.interceptors.request.use(
  (config) => {
    config.headers.Authorization = localStorage.getItem("check");
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject();
  }
);

service.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response.data;
    } else {
      Promise.reject();
    }
  },
  (error) => {
    console.log("状态码异常");
    return Promise.reject();
  }
);

export default service;
