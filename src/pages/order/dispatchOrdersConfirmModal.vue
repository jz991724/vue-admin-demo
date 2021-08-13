/**
* @描述: 派单确认modal
* @作者: jun
* @创建时间: 2021-08-11 13:40:06
*/
<template>
  <a-modal v-model="visible" title="派单确认" @ok="handleDispatchOrder()">
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
import { Component, Emit, Vue } from 'vue-property-decorator';
import { personnelService, orderService } from '@/services';

@Component({
  name: 'DispatchOrdersConfirmModal',
})
export default class DispatchOrdersConfirmModal extends Vue {
  visible = false;

  scroll = {
    x: 100,
    y: 300,
  };

  personnelId = null;

  allDispatchOrderList = [];

  options = [];

  columns = [
    {
      title: '订单号',
      dataIndex: 'orderNumber',
      width: 100,
    },
    {
      title: '渠道',
      width: 100,
      dataIndex: 'channel',
    },
    {
      title: '乘客姓名',
      dataIndex: 'passengerName',
      width: 100,
    },
    {
      title: '用车日期',
      dataIndex: 'useCarDate',
      width: 100,
      dataType: 'date',
    },
    {
      title: '航班时间',
      dataIndex: 'flightTime',
      width: 100,
      dataType: 'time',
    },
    {
      title: '用车时间',
      dataIndex: 'useCarTime',
      width: 100,
      dataType: 'time',
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
    },
    {
      title: '下车地点',
      dataIndex: 'destinationAddress',
      width: 200,
    },
    {
      title: '预定部门',
      dataIndex: 'reservationDepartment',
      width: 100,
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      width: 120,
    },
    {
      title: '采购应付金',
      dataIndex: 'amountPayable',
      width: 110,
    },
    {
      title: '预订人',
      dataIndex: 'reservationPeople',
      width: 120,
    },
    {
      title: '乘客电话',
      dataIndex: 'passengerPhone',
      width: 120,
    },
    {
      title: '操作',
      key: 'operation',
      width: 50,
      scopedSlots: { customRender: 'operation' },
    },
  ];

  openModal(params = undefined) {
    this.allDispatchOrderList = params || [];
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
    personnelService.fetchPersonnelList()
        .then((personnelList = []) => {
          this.options = personnelList.map(({
                                              id,
                                              name,
                                              licenseNumber,
                                            }) => ({
            label: `${name}-${licenseNumber}`,
            value: id,
            key: id,
          }));
        });
  }

  // 派单
  handleDispatchOrder(personnelId = this.personnelId, orderId = this.allDispatchOrderList.map(({ id }) => id)) {
    if (personnelId && orderId?.length > 0) {
      orderService.dispatchOrder([{
        personnelId,
        orderId,
      }])
          .then((res) => {
            debugger;
            this.visible = false;
            this.handleOk(orderId);
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
