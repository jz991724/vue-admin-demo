import { requestHelper, METHOD } from '@/utils/request';

const Order = {
    fetchOrderList(params) {
        return requestHelper('http://101.34.73.117:8088/api/OrderInfo/GetPageList', METHOD.POST, params, this);
    },
};

export default Order;
