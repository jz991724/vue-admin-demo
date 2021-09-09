/**
* @描述: 派单确认modal
* @作者: jun
* @创建时间: 2021-08-11 13:40:06
*/
<template>
  <a-modal v-model="visible" :destroyOnClose="true" title="派单确认" @ok="handleDispatchOrder()" :width="950">
    <a-card size="small">
      <template slot="title">
        <a-select show-search
                  placeholder="请选择驾驶员"
                  option-filter-prop="children"
                  style="width: 200px"
                  :options="options"
                  :filter-option="filterOption"
                  v-model="personnelId">
        </a-select>

        <span style="margin-left: 10px;">已选中 {{ allDispatchOrderList.length }} 条记录</span>
      </template>

      <a-table :columns="columns"
               :dataSource="allDispatchOrderList"
               :scroll="scroll"
               rowKey="id"
               size="small"
               :pagination="false">
        <template slot="operation" slot-scope="text, record">
          <a-popconfirm title="删除确认" @confirm="remove(record)">
            <a>删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
  </a-modal>
</template>

<script lang="ts">
import {
  Component, Emit, Mixins, Vue,
} from 'vue-property-decorator';
import { personnelService, orderService } from '@/services';
import VueMixins from '@/pages/mixins/vueMixins';

@Component({
  name: 'DispatchOrdersConfirmModal',
})
export default class DispatchOrdersConfirmModal extends Mixins(VueMixins) {
  visible = false;

  scroll = {
    x: 100,
    y: 300,
  };

  personnelId = null;

  // 是否是编辑状态
  isEdit = false;

  allDispatchOrderList = [];

  options = [];

  columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 60,
      customRender: (text, record, index) => index + 1,
    },
    {
      title: '订单号',
      dataIndex: 'orderNumber',
      width: 100,
    },
    {
      title: '渠道',
      width: 100,
      dataIndex: 'channel',
      ellipsis: true,
    },
    {
      title: '乘客姓名',
      dataIndex: 'passengerName',
      width: 150,
      ellipsis: true,
    },
    {
      title: '乘客电话',
      dataIndex: 'passengerPhone',
      width: 120,
    },
    {
      title: '用车日期',
      dataIndex: 'useCarDate',
      width: 110,
      dataType: 'date',
      customRender: (text) => this.dateCustomRender(text, 'YYYY-MM-DD'),
    },
    {
      title: '航班时间',
      dataIndex: 'flightTime',
      width: 100,
      dataType: 'time',
      customRender: (text) => this.timeCustomRender(text),
    },
    {
      title: '用车时间',
      dataIndex: 'useCarTime',
      width: 100,
      dataType: 'time',
      customRender: (text) => this.timeCustomRender(text),
    },
    {
      title: '产品类型',
      dataIndex: 'productType',
      width: 100,
      ellipsis: true,
    },
    {
      title: '航班车次号',
      dataIndex: 'flightNumber',
      width: 120,
    },
    {
      title: '上车地点',
      dataIndex: 'startAddress',
      width: 200,
      ellipsis: true,
    },
    {
      title: '下车地点',
      dataIndex: 'destinationAddress',
      width: 200,
      ellipsis: true,
    },
    {
      title: '预定部门',
      dataIndex: 'reservationDepartment',
      width: 130,
      ellipsis: true,
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      width: 150,
      ellipsis: true,
    },
    {
      title: '车型',
      dataIndex: 'carType',
      width: 80,
      ellipsis: true,
    },
    {
      title: '采购应付金额（元）',
      dataIndex: 'amountPayable',
      width: 160,
    },
    {
      title: '结算价格（元）',
      dataIndex: 'settlementPrice',
      width: 130,
    },
    {
      title: '预订人',
      dataIndex: 'reservationPeople',
      width: 120,
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 150,
      ellipsis: true,
    },
    {
      title: '车队',
      dataIndex: 'motorcade',
      width: 80,
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'operation',
      width: 50,
      fixed: 'right',
      scopedSlots: { customRender: 'operation' },
    },
  ];

  openModal({
              orders,
              personnelId,
            }) {
    this.allDispatchOrderList = orders || [];
    this.personnelId = personnelId;
    this.isEdit = !!personnelId;
    this.visible = true;
    this.fetchData();
  }

  closeModal() {
    this.visible = false;
  }

  remove({ id }) {
    this.allDispatchOrderList = this.allDispatchOrderList.filter((item) => item.id !== id);
  }

  filterOption(input, option) {
    return (
        option.componentOptions.children[0].text.toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
    );
  }

  fetchData() {
    this.options = [];
    personnelService.fetchPersonnelList()
        .then((personnelList = []) => {
          this.options = personnelList.map(({
                                              id,
                                              name,
                                              licenseNumber,
                                            }) => ({
            label: `${name} - ${licenseNumber}`,
            value: id,
            key: id,
          }));

          if (!this.personnelId) {
            // 默认选中第一项
            const [{ key }] = this.options;
            this.personnelId = key;
          }
        });
  }

  // 派单
  handleDispatchOrder(personnelId = this.personnelId, orders = this.allDispatchOrderList) {
    const orderIds = orders.map(({ id }) => id);
    if (personnelId && orderIds?.length > 0) {
      // // 如果是编辑状态下
      // if (this.isEdit) {
      //   orderService.dispatchOrder([{
      //     personnelId,
      //     orderId: orderIds,
      //   }])
      //       .then((res) => {
      //         this.visible = false;
      //         this.handleOk(orderIds);
      //         this.$message.success('派单信息更新完成！');
      //       });
      // } else {
      //   debugger;
      //   orderService.importOrders(orders)
      //       .then((addCount) => {
      //         orderService.dispatchOrder([{
      //           personnelId,
      //           orderId: orderIds,
      //         }])
      //             .then((res) => {
      //               this.visible = false;
      //               this.handleOk(orderIds);
      //               this.$message.success('派单完成！');
      //             });
      //       });
      // }

      orderService.dispatchOrder([{
        personnelId,
        orderId: orderIds,
      }])
          .then((res) => {
            this.visible = false;
            this.handleOk(orderIds);
            this.$message.success((this.isEdit ? '派单信息更新完成！' : '派单完成！'));
          });
    } else {
      this.$message.warning('请选择驾驶员和乘客信息');
    }
  }

  @Emit('success')
  handleOk(value) {
    return value;
  }
}
</script>

<style scoped lang="less">

</style>
