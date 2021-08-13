import { requestHelper, METHOD } from '@/utils/request';

const Order = {
    fetchOrderList(params, urlParams) {
        return requestHelper('/api/OrderInfo/GetPageList', METHOD.POST, params, this, urlParams);
    },
    dispatchOrder(params) { // 派单
        return requestHelper('/api/OrderInfo/AssignOrder', METHOD.POST, params, this);
    },
};

export default Order;
