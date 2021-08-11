import { requestHelper, METHOD } from '@/utils/request';

const Order = {
    fetchOrderList(params, urlParams) {
        return requestHelper('/api/OrderInfo/GetPageList', METHOD.POST, params, this, urlParams);
    },
};

export default Order;
