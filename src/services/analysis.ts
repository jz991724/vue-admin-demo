import { requestHelper, METHOD } from '@/utils/request';

const Analysis = {
    fetchAnalysisByChannelAndYear(params) { // 根据年度渠道统计月订单量和营业额
        return requestHelper('/api/Statistics/GetMonthOrderTurnover', METHOD.POST, params, this);
    },
};

export default Analysis;
