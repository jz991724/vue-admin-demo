import { requestHelper, METHOD } from '@/utils/request';

export enum UserInfoStatusEnum {
    '在职',
    '离职',
    '请假',
    '休息'
}

const UserManagement = {
    fetchUserInfoList(params = undefined) { // 获取用户列表
        return requestHelper('/api/UserInfo/GetList', METHOD.GET, params, this);
    },
    addUserInfo(params) { // 添加用户
        return requestHelper('/api/UserInfo/Add', METHOD.POST, params, this);
    },
    updateUserInfoPassword(params) { // 重置密码
        return requestHelper('/api/Personnel/Delete', METHOD.POST, params, this);
    },
    updateUserInfo(params) { // 更新用户
        return requestHelper('/api/UserInfo/Update', METHOD.POST, params, this);
    },
    updateUserInfoStatus(params) { // 修改状态
        return requestHelper('/api/UserInfo/UpdateStatus', METHOD.POST, params, this);
    },
    getUserInfoById(params) { // 根据用户ID获取用户信息
        return requestHelper('/api/UserInfo/GetUserInfo', METHOD.GET, params, this);
    },
};

export default UserManagement;
