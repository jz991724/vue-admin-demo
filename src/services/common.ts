import { requestHelper, METHOD } from '@/utils/request';

const common = {
    uploadFile(params) { // 文件上传
        debugger;
        return requestHelper('/api/FileUpload/UploadFile', METHOD.POST, params, this);
    },
};

export default common;
