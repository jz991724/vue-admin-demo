import { requestHelper, METHOD } from '@/utils/request';

const Order = {
    fetchOrderList(params, urlParams) {
        return requestHelper('http://101.34.73.117:8088/api/OrderInfo/GetPageList', METHOD.POST, params, this, urlParams);
    },
};

export default Order;
