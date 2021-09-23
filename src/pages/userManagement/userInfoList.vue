/**
* @描述: 用户信息list
* @作者: jun
* @创建时间: 2021-08-11 13:40:06
*/
<template>
  <div class="table">
    <advance-table :columns="columns"
                   :data-source="dataSource"
                   title="用户列表"
                   :loading="spinning"
                   rowKey="id"
                   :format-conditions="true"
                   @refresh="fetchData"
                   @reset="fetchData"
                   :scroll="{x:600}">
      <div slot="extra" style="display: flex;justify-content: end;">
        <a-button type="primary" style="margin-left: 10px;" @click="onAddUserInfo">
          新增
        </a-button>
      </div>

      <template slot="status" slot-scope="{text}">
        <a-tag :color="tagColors[text]">{{ UserInfoStatusEnum[text].toString() }}</a-tag>
      </template>

      <template slot="operation" slot-scope="{record}">
        <a v-auth="`edit`" @click="onUpdateUserInfo(record)">编辑</a>
        <a-divider type="vertical"/>
        <a-popconfirm title="确定删除" @confirm="onDeleteUserInfo(record)">
          <a v-auth="`delete`">删除</a>
        </a-popconfirm>
      </template>
    </advance-table>

    <!--用户添加modal-->
    <user-info-form-modal ref="userInfoFormModal" @submitSuccess="onSubmitSuccess"></user-info-form-modal>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Vue } from 'vue-property-decorator';
import AdvanceTable from '@/components/table/advance/AdvanceTable.vue';
import VueMixins from '@/pages/mixins/vueMixins';
import UserInfoFormModal from '@/pages/userManagement/userInfoFormModal.vue';
import userInfoService, { UserInfoStatusEnum, UserInfoTypeEnum } from '@/services/userManagement';

@Component({
  name: 'UserInfoList',
  components: {
    UserInfoFormModal,
    AdvanceTable,
  },
})
export default class UserInfoList extends Mixins(VueMixins) {
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
      width: 60,
      customRender: (text, record, index) => index + 1,
    },
    {
      title: '账号',
      dataIndex: 'userName',
      width: 100,
    },
    {
      title: '真实姓名',
      dataIndex: 'realName',
      width: 100,
    },
    {
      title: '用户类型',
      dataIndex: 'userType',
      width: 100,
      customRender: (text) => UserInfoTypeEnum[text],
    },
    {
      title: '状态',
      dataIndex: 'status',
      scopedSlots: { customRender: 'status' },
      width: 80,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 200,
      customRender: (text, { createTime }) => this.dateCustomRender(text || createTime),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 200,
      fixed: 'right',
      scopedSlots: { customRender: 'operation' },
    },
  ];

  dataSource = [];

  // 用户信息添加
  onAddUserInfo() {
    this.openModal('userInfoFormModal');
  }

  // 用户信息更新
  onUpdateUserInfo(userInfo) {
    this.openModal('userInfoFormModal', userInfo);
  }

  // 用户信息删除
  onDeleteUserInfo(userInfo) {
    if (userInfo.id) {
      userInfo = {
        ...userInfo,
        isDelete: true,
      };
      userInfoService.updateUserInfo(userInfo)
          .then((res) => {
            this.fetchData();
          });
    }
  }

  fetchData() {
    this.dataSource = [];
    userInfoService.fetchUserInfoList()
        .then((records) => {
          this.dataSource = records || [];
          console.log('userInfoList数据：', this.dataSource);
        });
  }

  // 用户添加成功
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
