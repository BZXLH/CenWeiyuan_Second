import { startLoading, endLoading } from "../js/loading.js";

let cancel = null;

export default function (url, method, data, dataClass, canCancel) {
  if (cancel) cancel.abort();
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const baseUrl = "http://175.178.193.182:8080";
    xhr.open(method, baseUrl + url);

    //超过0.5s显示加载中
    let loadingTimer = setTimeout(() => {
      NProgress.start();
      startLoading();
      clearTimeout(loadingTimer);
      loadingTimer = null;
    }, 700);

    if (canCancel) cancel = xhr;

    // 如果是post请求
    if (method == "post") {
      if (dataClass == "file") {
        xhr.send(data);
      } else if (dataClass == "json") {
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(data));
      } else {
        //合并参数
        let dataStr = "";
        if (typeof data === "object") {
          Object.keys(data).forEach((key) => {
            dataStr += `${key}=${data[key]}&`;
          });
          dataStr = dataStr.slice(0, dataStr.length - 1);
          //设置请求标头
          xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        }
        xhr.send(dataStr);
      }
    } else xhr.send();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (loadingTimer) {
          clearTimeout(loadingTimer);
          loadingTimer = null;
        } else {
          endLoading();
          NProgress.done();
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          if (cancel && canCancel) cancel = null;
          if (xhr.response === "OK") return;
          resolve(JSON.parse(xhr.response));
        } else {
          if (xhr.status !== 0) reject(new Error("请求失败"));
        }
      }
    };
  });
}
