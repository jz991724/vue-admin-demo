import { requestHelper, METHOD } from '@/utils/request';

// order状态enum
export enum OrderStatusEnum {
    待派单,
    待接单,
    进行中,
    已结束
}

const Order = {
    dispatchOrder(params) { // 派单
        return requestHelper('/api/OrderInfo/AssignOrder', METHOD.POST, params, this);
    },
    addOrder(params) { // 添加订单
        return requestHelper('/api/OrderInfo/Add', METHOD.POST, params, this);
    },
    addOrders(params) { // 添加订单list
        return requestHelper('/api/OrderInfo/AddList', METHOD.POST, params, this);
    },
    deleteOrder(params) { // 删除订单
        return requestHelper('/api/OrderInfo/Delete', METHOD.POST, params, this);
    },
    updateOrder(params) { // 更新订单
        return requestHelper('/api/OrderInfo/Update', METHOD.POST, params, this);
    },
    fetchOrderList(params, urlParams) { // 查询分页的订单pageList
        return requestHelper('/api/OrderInfo/GetPageList', METHOD.POST, params, this, urlParams);
    },
    importOrders(params) { // 批量导入订单
        return requestHelper('/api/OrderInfo/Import', METHOD.POST, params, this);
    },
    updateOrderStatus(params: { ids: string[]; status: OrderStatusEnum }) { // 更新派单状态
        return requestHelper('/api/OrderInfo/UpdateStatus', METHOD.POST, params, this);
    },
    fetchChannelList(params) { // 获取所有渠道
        return requestHelper('/api/OrderInfo/GetChannelList', METHOD.GET, params, this);
    },
    fetchYearList(params) { // 获取所有年度
        return requestHelper('/api/OrderInfo/GetYearList', METHOD.GET, params, this);
    },
};

export default Order;
