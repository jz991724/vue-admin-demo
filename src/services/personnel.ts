import { requestHelper, METHOD } from '@/utils/request';

export enum PersonnelStatusEnum {
    在职,
    离职
}

export enum PersonnelTypeEnum {
    外聘
}

export enum SexEnum {
    男,
    女
}

const Personnel = {
    fetchPersonnelPageList(params = undefined, urlParams = undefined) { // 获取人员列表（分页）
        return requestHelper('/api/Personnel/GetPageList', METHOD.POST, params, this, urlParams);
    },
    fetchPersonnelList(params = undefined) { // 获取人员列表
        return requestHelper('/api/Personnel/GetList', METHOD.GET, params, this);
    },
    addPersonnelList(params) { // 批量添加人员
        return requestHelper('/api/Personnel/AddList', METHOD.POST, params, this);
    },
    addPersonnel(params) { // 添加人员
        return requestHelper('/api/Personnel/Add', METHOD.POST, params, this);
    },
    deletePersonnel(params) { // 删除人员
        return requestHelper('/api/Personnel/Delete', METHOD.POST, params, this);
    },
    updatePersonnel(params) { // 更新人员
        return requestHelper('/api/Personnel/Update', METHOD.POST, params, this);
    },
};

export default Personnel;
