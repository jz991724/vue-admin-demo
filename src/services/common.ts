import { requestHelper, METHOD } from '@/utils/request';

const common = {
    dispatchOrder(params) { // 派单
        return requestHelper('/api/OrderInfo/AssignOrder', METHOD.POST, params, this);
    },
};

export default common;
