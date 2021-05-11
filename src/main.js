import '@babel/polyfill'
import {
    createApp
} from 'vue';
import App from './App.vue'
import router from './router'
import store from './store'
const app = createApp(App)
// import 'babel-polyfill';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import axios from 'axios';
import echarts from 'echarts'

// require('es6-promise').polyfill() 
app.config.globalProperties.$axios = axios

app.use(store).use(router).use(Antd).use(echarts).mount('#app')

axios.defaults.retry = 3;
axios.defaults.retryDelay = 1000;
axios.interceptors.request.use(config => {
    // 表示在配置中的设置头消息的字段Authorization为从本地获取的token值
    config.headers.sessionid = window.sessionStorage.getItem('sessionid')
    return config
})
axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
    console.log("请求状态", err.response.status)
    if (err.response.status == 401) {
        window.location.reload()
    } else {
        var config = err.config;
        // If config does not exist or the retry option is not set, reject
        if (!config || !config.retry) return Promise.reject(err);

        // Set the variable for keeping track of the retry count
        config.__retryCount = config.__retryCount || 0;

        // Check if we've maxed out the total number of retries
        if (config.__retryCount >= config.retry) {
            // Reject with the error
            return Promise.reject(err);
        }

        // Increase the retry count
        config.__retryCount += 1;

        // Create new promise to handle exponential backoff
        var backoff = new Promise(function (resolve) {
            setTimeout(function () {
                resolve();
            }, config.retryDelay || 1);
        });

        // Return the promise in which recalls axios to retry the request
        return backoff.then(function () {
            return axios(config);
        });
    }

});