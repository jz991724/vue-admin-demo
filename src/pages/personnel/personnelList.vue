/**
* @描述: 驾驶员列表
* @作者: jun
* @创建时间: 2021-08-11 13:40:06
*/
<template>
  <div class="table">
    <advance-table :columns="columns"
                   :data-source="dataSource"
                   title="驾驶员列表"
                   :loading="spinning"
                   rowKey="id"
                   @search="onSearch"
                   @refresh="onRefresh"
                   :format-conditions="true"
                   @reset="onReset"
                   :scroll="{x:600}"
                   :pagination="pagination">
      <div slot="extra" style="display: flex;justify-content: end;">
        <a-button type="primary" style="margin-left: 10px;" @click="onAddPersonnel">
          新增
        </a-button>
      </div>

      <template slot="sex" slot-scope="{text}">
        {{ SexEnum[text].toString() }}
      </template>

      <template slot="status" slot-scope="{text}">
        <a-tag :color="tagColors[text]">{{ PersonnelStatusEnum[text].toString() }}</a-tag>
      </template>

      <template slot="operation" slot-scope="{record}">
        <a @click="onUpdatePersonnel(record)">编辑</a>
        <a-divider type="vertical"/>
        <a-popconfirm title="确定删除" @confirm="onDeletePersonnel(record)">
          <a>删除</a>
        </a-popconfirm>
      </template>
    </advance-table>

    <!--驾驶员添加modal-->
    <personnel-form-modal ref="personnelFormModal" @submitSuccess="onSubmitSuccess"></personnel-form-modal>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Vue } from 'vue-property-decorator';
import AdvanceTable from '@/components/table/advance/AdvanceTable.vue';
import { personnelService } from '@/services';
import VueMixins from '@/pages/mixins/vueMixins';
import { PersonnelStatusEnum, PersonnelTypeEnum, SexEnum } from '@/services/personnel';
import PersonnelFormModal from '@/pages/personnel/personnelFormModal.vue';

@Component({
  name: 'PersonnelList',
  components: {
    PersonnelFormModal,
    AdvanceTable,
  },
})
export default class PersonnelList extends Mixins(VueMixins) {
  SexEnum = SexEnum;

  PersonnelStatusEnum = PersonnelStatusEnum;

  tagColors = {
    [PersonnelStatusEnum.在职]: 'green',
  };

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
      title: '姓名',
      dataIndex: 'name',
      searchAble: true,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      scopedSlots: { customRender: 'sex' },
    },
    {
      title: '电话号码',
      dataIndex: 'phoneNumber',
    },
    {
      title: '车牌号',
      dataIndex: 'licenseNumber',
      searchAble: true,
    },
    // {
    //   title: '航班时间',
    //   dataIndex: 'flightTime',
    //   width: 100,
    //   dataType: 'time',
    // },
    // {
    //   title: '用车时间',
    //   dataIndex: 'useCarTime',
    //   width: 100,
    //   dataType: 'time',
    // },
    // {
    //   title: '产品类型',
    //   dataIndex: 'productType',
    //   width: 100,
    // },
    // {
    //   title: '航班车次号',
    //   dataIndex: 'flightNumber',
    //   width: 120,
    // },
    // {
    //   title: '上车地点',
    //   dataIndex: 'startAddress',
    //   width: 200,
    // },
    // {
    //   title: '下车地点',
    //   dataIndex: 'destinationAddress',
    //   width: 200,
    // },
    //
    // {
    //   title: '驾驶员姓名',
    //   dataIndex: 'driverName',
    //   width: 110,
    //   searchAble: true,
    // },
    // {
    //   title: '驾驶员电话',
    //   dataIndex: 'driverPhone',
    //   width: 120,
    // },
    // {
    //   title: '车牌',
    //   dataIndex: 'licenseNumber',
    //   width: 110,
    //   searchAble: true,
    // },
    // {
    //   title: '预定部门',
    //   dataIndex: 'reservationDepartment',
    //   width: 100,
    // },
    // {
    //   title: '客户名称',
    //   dataIndex: 'customerName',
    //   width: 120,
    // },
    // {
    //   title: '车型',
    //   dataIndex: 'carType',
    //   width: 80,
    // },
    // {
    //   title: '采购应付金',
    //   dataIndex: 'amountPayable',
    //   width: 110,
    // },
    // {
    //   title: '预订人',
    //   dataIndex: 'reservationPeople',
    //   width: 120,
    // },
    // {
    //   title: '乘客电话',
    //   dataIndex: 'passengerPhone',
    //   width: 120,
    // },
    {
      // searchAble: true,
      title: '状态',
      dataIndex: 'status',
      // dataType: 'select',
      // slots: { title: 'statusTitle' },
      scopedSlots: { customRender: 'status' },
      // search: {
      //   selectOptions: [
      //     {
      //       title: '在职',
      //       value: PersonnelStatusEnum.在职,
      //     },
      //     {
      //       title: '离职',
      //       value: PersonnelStatusEnum.离职,
      //     },
      //   ],
      // },
    },

    // {
    //   title: '发货',
    //   searchAble: true,
    //   dataIndex: 'send',
    //   dataType: 'boolean',
    //   scopedSlots: { customRender: 'send' },
    //   search: {
    //     switchOptions: {
    //       checkedText: '开',
    //       uncheckedText: '关',
    //     },
    //   },
    // },

    {
      title: '操作',
      dataIndex: 'operation',
      width: 200,
      scopedSlots: { customRender: 'operation' },
    },
  ];

  dataSource = [];

  conditions: any = {};

  pagination = {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showLessItems: true,
    showQuickJumper: true,
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

  // 人员信息添加
  onAddPersonnel(personnel) {
    this.openModal('personnelFormModal');
  }

  // 人员信息更新
  onUpdatePersonnel(personnel) {
    this.openModal('personnelFormModal', personnel);
  }

  // 人员信息删除
  onDeletePersonnel({ id }) {
    if (id) {
      personnelService.deletePersonnel([id])
          .then((res) => {
            this.fetchData();
          });
    }
  }

  // 订单派发成功
  onDispatchSuccess() {
    this.fetchData();
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
    personnelService.fetchPersonnelPageList(params, this.conditions)
        .then(({
                 items,
                 totalCount,
               }) => {
          this.dataSource = items || [];
          this.pagination.total = totalCount || 0;
          console.log('personnelList数据：', this.dataSource);
        });
  }

  onSearch(conditions, searchOptions) {
    this.pagination.current = 1;
    this.conditions = conditions;
    this.fetchData();
  }

  onRefresh(conditions) {
    this.conditions = conditions;
    this.fetchData();
  }

  onReset(conditions) {
    this.conditions = conditions;
    this.fetchData();
  }

  // 人员添加成功
  onSubmitSuccess() {
    this.fetchData();
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
