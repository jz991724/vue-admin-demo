/**
* @描述: 派单
* @作者: jun
* @创建时间: 2021-08-11 13:40:06
*/
<template>
  <div class="table">
    <advance-table :columns="columns"
                   :data-source="dataSource"
                   title="订单列表"
                   :loading="spinning"
                   rowKey="id"
                   @search="onSearch"
                   @refresh="onRefresh"
                   :format-conditions="true"
                   @reset="onReset"
                   :scroll="scroll"
                   :row-selection="{selectedRowKeys: dispatchOrderList.map(({id})=>id), onChange: onSelectChange}"
                   :pagination="pagination">
      <div slot="extra" style="display: flex;justify-content: end;">
        <file-upload class="margin-left-xs"
                     @success="uploadSuccess"
                     @upLoading="(isLoading)=>spinning=isLoading">
          <a-button v-auth="`import`" :loading="spinning" :disabled="spinning">
            导入
          </a-button>
        </file-upload>

        <a-button v-auth="`add`" type="primary" style="margin-left: 10px;" @click="onAddOrder">
          新增
        </a-button>

        <a-dropdown :disabled="dispatchOrderList.length<1">
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item key="dispatchOrderListMenu" style="font-size: 16px;">
              <a-icon type="car" style="font-size: 16px;"/>
              派单
            </a-menu-item>
            <a-menu-item key="deleteOrderListMenu" style="font-size: 16px;color: red;">
              <a-icon type="delete" style="font-size: 16px;"/>
              删除
            </a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            更多操作
            <a-icon type="down"/>
          </a-button>
        </a-dropdown>
      </div>

      <template slot="operation" slot-scope="{record}">
        <!--派单-->
        <a v-auth="`dispatch`" @click="onConfirmDispatch([record])">派单</a>

        <!--编辑-->
        <a-divider type="vertical"/>
        <a v-auth="`edit`" @click="onUpdateOrder(record)">编辑</a>

        <!--更多-->
        <a-divider type="vertical"/>
        <a-dropdown>
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">
            更多
            <a-icon type="down"/>
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a @click="onCheckedOrder(record)">详情</a>
            </a-menu-item>

            <a-menu-item>
              <a-popconfirm title="确定删除" @confirm="onDeleteDispatch([record.id])">
                <a v-auth="`delete`">删除</a>
              </a-popconfirm>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </template>
    </advance-table>

    <!--订单派发确认modal-->
    <dispatch-orders-confirm-modal ref="dispatchOrdersConfirmModal"
                                   @success="onDispatchOrderListSuccess"></dispatch-orders-confirm-modal>

    <!--文件导出数据成功确认modal-->
    <export-data-confirm-modal ref="exportDataConfirmModal"></export-data-confirm-modal>

    <!--订单的编辑及添加modal-->
    <order-form-modal ref="orderFormModal" @submitSuccess="refreshDataSource()"></order-form-modal>

    <!--订单详情Modal-->
    <order-detail-modal ref="orderDetailModal"></order-detail-modal>
  </div>
</template>

<script lang="ts">
import {
  Component, Mixins, Vue, Watch,
} from 'vue-property-decorator';
import AdvanceTable from '@/components/table/advance/AdvanceTable.vue';
import { orderService } from '@/services';
import DispatchOrdersConfirmModal from '@/pages/order/dispatchOrdersConfirmModal.vue';
import VueMixins from '@/pages/mixins/vueMixins';
import ImportDataConfirmModal from '@/pages/order/importDataConfirmModal.vue';
import { OrderStatusEnum } from '@/services/order';
import FileUpload from '@/components/file/fileUpload.vue';
import OrderFormModal from '@/pages/order/orderFormModal.vue';
import ExportDataConfirmModal from '@/pages/order/exportDataConfirmModal.vue';
import OrderDetailModal from '@/pages/order/orderDetailModal.vue';

@Component({
  name: 'OrderList',
  components: {
    OrderDetailModal,
    ExportDataConfirmModal,
    OrderFormModal,
    FileUpload,
    ImportDataConfirmModal,
    DispatchOrdersConfirmModal,
    AdvanceTable,
  },
})
export default class OrderList extends Mixins(VueMixins) {
  // 所有选中将要被派单的order（各个页面）
  dispatchOrderList = [];

  spinning = false;

  columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 60,
      customRender: (text, record, index) => {
        const {
          pageSize,
          current,
        } = this.pagination;
        return pageSize * (current - 1) + index + 1;
      },
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
      dataIndex: 'operation',
      width: 190,
      fixed: 'right',
      scopedSlots: { customRender: 'operation' },
    },
  ];

  dataSource = [];

  conditions = { status: OrderStatusEnum.待派单 };

  pagination = {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showLessItems: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
    onChange: (page, pageSize) => {
      this.pagination.current = page;
      this.pagination.pageSize = pageSize;
      this.fetchData();
    },
    onShowSizeChange: (current, size) => {
      this.pagination.current = 1;
      this.pagination.pageSize = size;
      this.fetchData();
    },
  };

  // 导入的文件数据
  importFileData = [];

  // 选中项发生变化时的回调
  onSelectChange(selectedRowKeys, selectedRows) {
    this.dispatchOrderList = selectedRows;
  }

  handleMenuClick({ key }) {
    if (key === 'dispatchOrderListMenu') {
      this.onDispatch();
    } else if (key === 'deleteOrderListMenu') { // 评论删除
      const deleteIds = this.dispatchOrderList.map(({ id }) => id);
      if (deleteIds?.length > 0) {
        const self = this;
        this.$confirm({
          content: `是否删除选中的 ${deleteIds.length} 条订单信息？`,
          onOk() {
            self.dispatchOrderList = [];
            self.onDeleteDispatch(deleteIds);
          },
        });
      }
    }
  }

  fetchData() {
    const {
      pagination: {
        current,
        pageSize,
      },
    } = this;
    const params = {
      index: current || 1,
      size: pageSize || 10,
      isAsc: true,
      orderField: undefined,
    };
    this.dataSource = [];
    orderService.fetchOrderList(params, this.conditions)
        .then(({
                 items,
                 totalCount,
               }) => {
          this.dataSource = items || [];
          console.log('派发订单列表：', this.dataSource);
          this.pagination.total = totalCount || 0;
        });
  }

  refreshDataSource() {
    this.dispatchOrderList = [];
    this.pagination.current = 1;
    this.pagination.total = 0;
    this.fetchData();
  }

  // 上传成功
  uploadSuccess(importFileData) {
    this.importFileData = importFileData;
    // this.openModal('importDataConfirmModal');
    const self = this;
    this.$confirm({
      title: '提示',
      content: '是否确定导入新数据？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        // 数据导入
        orderService.addOrders(importFileData)
            .then((importRecordCount) => {
              importRecordCount = Number(importRecordCount) || 0;
              if (importRecordCount === importFileData.length) {
                self.$message.success(`成功导入 ${importRecordCount} 条数据！`);
              } else {
                self.$message.success(`成功导入 ${importRecordCount} 条数据，导入失败${(importFileData.length - importRecordCount)} 条！`);
              }
              self.refreshDataSource();
            }, (error) => {
              console.error('数据导入错误：', error);
              self.$message.error('数据导入失败！');
            });
      },
    });
  }

  onSearch(conditions, searchOptions) {
    this.conditions = { ...this.conditions, ...conditions };
    this.refreshDataSource();
  }

  onRefresh(conditions) {
    this.conditions = { ...this.conditions, ...conditions };
    this.refreshDataSource();
  }

  onReset(conditions) {
    this.conditions = { ...this.conditions, ...conditions };
    this.refreshDataSource();
  }

  // 派单
  onConfirmDispatch(orders = []) {
    console.log('所有要派的单:', orders);
    this.openModal('dispatchOrdersConfirmModal', { orders });
  }

  // 新增订单信息
  onAddOrder() {
    this.openModal('orderFormModal');
  }

  // 编辑订单信息
  onUpdateOrder(order) {
    this.openModal('orderFormModal', order);
  }

  // 派单信息删除
  onDeleteDispatch(ids = []) {
    if (ids?.length > 0) {
      orderService.deleteOrder(ids)
          .then((res) => {
            this.fetchData();
          });
    }
  }

  // 查看订单信息
  onCheckedOrder(order) {
    this.openModal('orderDetailModal', order);
  }

  // 派单
  onDispatch() {
    console.log('所有要派的单:', this.dispatchOrderList);

    this.openModal('dispatchOrdersConfirmModal', { orders: this.dispatchOrderList });
  }

  // 派单成功
  onDispatchOrderListSuccess(dispatchOrderIds = []) {
    // this.dataSource = this.dataSource.filter(({ id }) => !dispatchOrderIds.includes(id));
    this.refreshDataSource();
  }

  created() {
    this.fetchData();
  }
}
</script>

<style scoped lang="less">
.table {
  background-color: @base-bg-color;
  padding: 24px;
}
</style>
