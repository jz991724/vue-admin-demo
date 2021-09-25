import axios from 'axios';
import Cookie from 'js-cookie';
import qs from 'qs';
import { message } from 'ant-design-vue';

// 跨域认证信息 header 名
const xsrfHeaderName = 'Authorization';

axios.defaults.timeout = 5000;
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = xsrfHeaderName;
axios.defaults.xsrfCookieName = xsrfHeaderName;
axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;

// 认证类型
const AUTH_TYPE = {
    BEARER: 'Bearer',
    BASIC: 'basic',
    AUTH1: 'auth1',
    AUTH2: 'auth2',
};

// http method
const METHOD = {
    GET: 'get',
    POST: 'post'
};

/**
 * axios请求
 * @param url 请求地址
 * @param method {METHOD} http method
 * @param params 请求参数
 * @returns {Promise<AxiosResponse<T>>}
 */
async function request(url, method, params, config) {
    switch (method) {
        case METHOD.GET:
            return axios.get(url, { params, ...config });
        case METHOD.POST:
            return axios.post(url, params, config);
        default:
            return axios.get(url, { params, ...config });
    }
}

/**
 * axios请求
 * @param url 请求地址
 * @param method {METHOD} http method
 * @param params 请求参数
 * @param vueContext 当前vue对象
 * @param spinName 等待参数
 * @param config
 * @returns {Promise<AxiosResponse<T>>}
 */
function requestHelper(url, method, params, vueContext = undefined, urlParams = undefined, spinName = 'spinning', config) {
    let requestObj = undefined;
    if (urlParams) {
        let paramsStr = qs.stringify(urlParams);
        url = `${url}?${paramsStr}`;
    }
    switch (method) {
        case METHOD.GET:
            requestObj = axios.get(url, { params, ...config });
            break;
        case METHOD.POST:
            requestObj = axios.post(url, params, config);
            break;
        default:
            requestObj = axios.get(url, { params, ...config });
            break;
    }

    if (vueContext && spinName && vueContext[spinName] !== undefined) {
        vueContext[spinName] = true;
    }
    return new Promise((resolve, reject) => {
        requestObj.then(res => {
            let {
                status,
                data: { result }
            } = res;
            if (status === 200) {
                return resolve(result);
            } else {
                return reject(result);
            }
        }, error => {
            return reject(error);
        })
            .finally(() => {
                if (vueContext && spinName && vueContext[spinName] !== undefined) {
                    vueContext[spinName] = false;
                }
            });
    });
}

//文件下载
function downloadFileHelper(url, fileName, data = {}, config = { responseType: 'blob' }, vueContext = undefined, spinName = 'spinning') {
    if (vueContext && spinName && vueContext[spinName] !== undefined) {
        vueContext[spinName] = true;
    }
    axios.post(url, data, config)
        .then(({
                   data,
                   status
               }) => {
            if (status === 200) {
                const blob = new Blob([data]);
                const rUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a'); // 创建a标签
                link.href = rUrl;
                link.download = fileName; // 重命名文件
                link.click();
                URL.revokeObjectURL(rUrl); // 释放内存
                message.success(`文件导出成功！`);
            } else {
                message.error('导出异常！');
            }
        }, error => {
            message.error('导出错误！');
            console.error('导出错误：', error);
        })
        .finally(() => {
            if (vueContext && spinName && vueContext[spinName] !== undefined) {
                vueContext[spinName] = false;
            }
        });
}

/**
 * 设置认证信息
 * @param auth {Object}
 * @param authType {AUTH_TYPE} 认证类型，默认：{AUTH_TYPE.BEARER}
 */
function setAuthorization(auth, authType = AUTH_TYPE.BEARER) {
    switch (authType) {
        case AUTH_TYPE.BEARER:
            Cookie.set(xsrfHeaderName, 'Bearer ' + auth.token, { expires: auth.expireAt });
            break;
        case AUTH_TYPE.BASIC:
        case AUTH_TYPE.AUTH1:
        case AUTH_TYPE.AUTH2:
        default:
            break;
    }
}

/**
 * 移出认证信息
 * @param authType {AUTH_TYPE} 认证类型
 */
function removeAuthorization(authType = AUTH_TYPE.BEARER) {
    switch (authType) {
        case AUTH_TYPE.BEARER:
            Cookie.remove(xsrfHeaderName);
            break;
        case AUTH_TYPE.BASIC:
        case AUTH_TYPE.AUTH1:
        case AUTH_TYPE.AUTH2:
        default:
            break;
    }
}

/**
 * 检查认证信息
 * @param authType
 * @returns {boolean}
 */
function checkAuthorization(authType = AUTH_TYPE.BEARER) {
    switch (authType) {
        case AUTH_TYPE.BEARER:
            if (Cookie.get(xsrfHeaderName)) {
                return true;
            }
            break;
        case AUTH_TYPE.BASIC:
        case AUTH_TYPE.AUTH1:
        case AUTH_TYPE.AUTH2:
        default:
            break;
    }
    return false;
}

/**
 * 加载 axios 拦截器
 * @param interceptors
 * @param options
 */
function loadInterceptors(interceptors, options) {
    const {
        request,
        response
    } = interceptors;
    // 加载请求拦截器
    request.forEach(item => {
        let {
            onFulfilled,
            onRejected
        } = item;
        if (!onFulfilled || typeof onFulfilled !== 'function') {
            onFulfilled = config => config;
        }
        if (!onRejected || typeof onRejected !== 'function') {
            onRejected = error => Promise.reject(error);
        }
        axios.interceptors.request.use(
            config => onFulfilled(config, options),
            error => onRejected(error, options)
        );
    });
    // 加载响应拦截器
    response.forEach(item => {
        let {
            onFulfilled,
            onRejected
        } = item;
        if (!onFulfilled || typeof onFulfilled !== 'function') {
            onFulfilled = response => response;
        }
        if (!onRejected || typeof onRejected !== 'function') {
            onRejected = error => Promise.reject(error);
        }
        axios.interceptors.response.use(
            response => onFulfilled(response, options),
            error => onRejected(error, options)
        );
    });
}

/**
 * 解析 url 中的参数
 * @param url
 * @returns {Object}
 */
function parseUrlParams(url) {
    const params = {};
    if (!url || url === '' || typeof url !== 'string') {
        return params;
    }
    const paramsStr = url.split('?')[1];
    if (!paramsStr) {
        return params;
    }
    const paramsArr = paramsStr.replace(/&|=/g, ' ')
        .split(' ');
    for (let i = 0; i < paramsArr.length / 2; i++) {
        const value = paramsArr[i * 2 + 1];
        params[paramsArr[i * 2]] = value === 'true' ? true : (value === 'false' ? false : value);
    }
    return params;
}

export {
    METHOD,
    AUTH_TYPE,
    request,
    requestHelper,
    downloadFileHelper,
    setAuthorization,
    removeAuthorization,
    checkAuthorization,
    loadInterceptors,
    parseUrlParams
};
