import { requestHelper, METHOD } from '@/utils/request';

const common = {
    uploadFile(params) { // 文件上传
        return requestHelper('/api/FileUpload/UploadFile', METHOD.POST, params, this);
    },
    getAddressList(params) {
        return requestHelper('https://apis.map.qq.com/ws/geocoder/v1/', METHOD.GET, undefined, this, params);
    },
};

export default common;
