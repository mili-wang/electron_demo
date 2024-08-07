import axios from 'axios';

const reuqest = axios.create({
  baseURL: "/api",
  timeout: 100000
});

// 请求拦截器
reuqest.interceptors.request.use(
  (config: any) => {
    // 设置请求头
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
reuqest.interceptors.response.use(
  (response) => {
    const { data } = response;
    if (data.code === 0) {
      // 业务成功逻辑
      return data;
    } else {
      // 业务失败逻辑
      console.log(data.message)
      return Promise.reject(new Error(data.message));
    }
  },
  (error) => {
    const { response } = error;
    if (response) {
      // 业务错误状态处理
      console.log(response.data.message)
    } else {
      // 网络错误处理，例如：请求超时或断网
      console.log('Network error, please check your connection!')
    }
    return Promise.reject(error);
  }
);

export default reuqest;