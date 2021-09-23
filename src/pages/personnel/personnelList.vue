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
                   :scroll="scroll"
                   :row-selection="{selectedRowKeys: selectedPersonnelList.map(({id})=>id), onChange: onSelectChange}"
                   :pagination="pagination">
      <div slot="extra" style="display: flex;justify-content: end;">
        <a-button type="primary" style="margin-left: 10px;" @click="onAddPersonnel()">
          新增
        </a-button>

        <a-dropdown :disabled="selectedPersonnelList.length<1">
          <a-menu slot="overlay" @click="handleMenuClick">
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

      <template slot="sex" slot-scope="{text}">
        {{ SexEnum[text].toString() }}
      </template>

      <template slot="status" slot-scope="{text}">
        <a-tag :color="tagColors[text]">{{ UserInfoStatusEnum[text].toString() }}</a-tag>
      </template>

      <template slot="operation" slot-scope="{record}">
        <a v-auth="`edit`" @click="onUpdatePersonnel(record)">编辑</a>
        <a-divider type="vertical"/>
        <a-popconfirm title="确定删除" @confirm="onDeletePersonnel([record.id])">
          <a v-auth="`delete`">删除</a>
        </a-popconfirm>
      </template>
    </advance-table>

    <!--驾驶员添加modal-->
    <personnel-form-modal ref="personnelFormModal" @submitSuccess="onSubmitSuccess"></personnel-form-modal>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Vue } from 'vue-property-decorator';
import moment from 'moment';
import AdvanceTable from '@/components/table/advance/AdvanceTable.vue';
import { personnelService } from '@/services';
import VueMixins from '@/pages/mixins/vueMixins';
import { PersonnelStatusEnum, PersonnelTypeEnum, SexEnum } from '@/services/personnel';
import PersonnelFormModal from '@/pages/personnel/personnelFormModal.vue';
import { UserInfoStatusEnum } from '@/services/userManagement';

@Component({
  name: 'PersonnelList',
  components: {
    PersonnelFormModal,
    AdvanceTable,
  },
})
export default class PersonnelList extends Mixins(VueMixins) {
  SexEnum = SexEnum;

  // PersonnelStatusEnum = PersonnelStatusEnum;

  UserInfoStatusEnum = UserInfoStatusEnum;

  tagColors = {
    [UserInfoStatusEnum.在职]: 'green',
    [UserInfoStatusEnum.离职]: '',
    [UserInfoStatusEnum.请假]: 'orange',
    [UserInfoStatusEnum.休息]: 'purple',
  };

  spinning = false;

  columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 80,
      fixed: 'left',
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
      fixed: 'left',
      width: 115,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      scopedSlots: { customRender: 'sex' },
      width: 80,
    },
    {
      title: '电话号码',
      dataIndex: 'phoneNumber',
      width: 120,
    },
    {
      title: '车牌号',
      dataIndex: 'licenseNumber',
      searchAble: true,
      width: 120,
    },
    {
      title: '车型',
      dataIndex: 'carType',
      width: 120,
    },
    {
      title: '车型分类',
      dataIndex: 'vehicleClass',
      width: 120,
    },
    {
      title: '车队',
      dataIndex: 'group',
      width: 120,
    },
    {
      title: '入职时间',
      dataIndex: 'entryTime',
      width: 180,
      customRender: (text) => this.dateCustomRender(text),
    },
    {
      title: '车俩登记时间',
      dataIndex: 'carRegisterTime',
      width: 180,
      customRender: (text) => this.dateCustomRender(text),
    },
    {
      title: '住址',
      dataIndex: 'address',
      ellipsis: true,
      width: 200,
    },
    // {
    //   title: '人员类型',
    //   dataIndex: 'type',
    //   width: 150,
    // },
    {
      // searchAble: true,
      title: '状态',
      dataIndex: 'status',
      // dataType: 'select',
      // slots: { title: 'statusTitle' },
      scopedSlots: { customRender: 'status' },
      width: 100,
      fixed: 'right',
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
    {
      title: '操作',
      dataIndex: 'operation',
      width: 120,
      fixed: 'right',
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

  selectedPersonnelList = [];

  // 选中项发生变化时的回调
  onSelectChange(selectedRowKeys, selectedRows) {
    this.selectedPersonnelList = selectedRows;
  }

  // 人员信息添加
  onAddPersonnel() {
    this.openModal('personnelFormModal');
  }

  // 人员信息更新
  onUpdatePersonnel(personnel) {
    this.openModal('personnelFormModal', personnel);
  }

  // 人员信息删除
  onDeletePersonnel(ids = []) {
    if (ids?.length > 0) {
      personnelService.deletePersonnel(ids)
          .then((res) => {
            this.fetchData();
          });
    }
  }

  handleMenuClick({ key }) {
    if (key === 'deleteOrderListMenu') { // 批量删除
      const deleteIds = this.selectedPersonnelList.map(({ id }) => id);
      if (deleteIds?.length > 0) {
        const self = this;
        this.$confirm({
          content: `是否删除选中的 ${deleteIds.length} 条人员信息？`,
          onOk() {
            self.onDeletePersonnel(deleteIds);
          },
        });
      }
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
