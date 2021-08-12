<template>
  <div class="form">
    <a-card size="small" :bordered="false" :body-style="{padding:0}">
      <a-button slot="extra" type="primary" style="margin-bottom: 10px;" @click="handleSubmit">提交</a-button>

      <form :autoFormCreate="(form) => this.form = form">
        <a-table :columns="columns"
                 :dataSource="dataSource"
                 :scroll="scroll"
                 :pagination="false">
          <template v-for="(col, i) in columns.map(({key})=>key)" :slot="col" slot-scope="text, record">
            <a-input :key="col"
                     v-if="record.editable"
                     style="margin: -5px 0"
                     :value="text"
                     :placeholder="columns[i].title"
                     @change="e => handleChange(e.target.value, record.key, col)"/>
            <template v-else>{{ text }}</template>
          </template>
          <template slot="operation" slot-scope="text, record">
            <template v-if="record.editable">
          <span v-if="record.isNew">
            <a @click="saveRow(record.key)">添加</a>
            <a-divider type="vertical"/>
            <a-popconfirm title="删除确认" @confirm="remove(record.key)">
              <a>删除</a>
            </a-popconfirm>
          </span>
              <span v-else>
            <a @click="saveRow(record.key)">保存</a>
            <a-divider type="vertical"/>
            <a @click="cancel(record.key)">取消</a>
          </span>
            </template>
            <span v-else>
          <a @click="toggle(record.key)">编辑</a>
          <a-divider type="vertical"/>
          <a-popconfirm title="删除确认" @confirm="remove(record.key)">
            <a>删除</a>
          </a-popconfirm>
        </span>
          </template>
        </a-table>
        <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus"
                  @click="newMember">
          新增
        </a-button>
      </form>
    </a-card>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import VueMixins from '../mixins/vueMixins';

@Component({ name: 'StaffForm' })
export default class StaffForm extends Mixins(VueMixins) {
  scroll = {
    x: 100,
    y: document.body.clientHeight - 350,
  };

  columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      scopedSlots: { customRender: 'name' },
    },
    {
      title: '电话号码',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: '20%',
      scopedSlots: { customRender: 'phoneNumber' },
    },
    {
      title: '车牌号',
      dataIndex: 'cardNumber',
      key: 'cardNumber',
      width: '40%',
      scopedSlots: { customRender: 'cardNumber' },
    },
    {
      title: '操作',
      key: 'operation',
      scopedSlots: { customRender: 'operation' },
    },
  ];

  dataSource = [
    {
      key: 1,
      name: '小明',
      phoneNumber: '18788455787',
      editable: false,
      cardNumber: '云A12345',
    },
    {
      key: 2,
      name: '李莉',
      phoneNumber: '18785456787',
      editable: false,
      cardNumber: '云A12445',
    },
    {
      key: 3,
      name: '王小帅',
      phoneNumber: '18788456787',
      editable: false,
      cardNumber: '云F12345',
    },
  ];

  handleSubmit(e) {
    e.preventDefault();

    this.$confirm({
      title: '您确定要提交?',
      // content: 'When clicked the OK button, this dialog will be closed after 1 second',
      onOk() {
        debugger;
      },
    });
  }

  newMember() {
    this.dataSource.push({
      key: this.dataSource.length + 1,
      name: '',
      phoneNumber: '',
      cardNumber: '',
      editable: true,
      isNew: true,
    });
  }

  remove(key) {
    const newData = this.dataSource.filter((item) => item.key !== key);
    this.dataSource = newData;
  }

  saveRow(key) {
    const [target] = this.dataSource.filter((item) => item.key === key);
    target.editable = false;
    target.isNew = false;
  }

  toggle(key) {
    const target = this.dataSource.filter((item) => item.key === key)[0];
    target.editable = !target.editable;
  }

  getRowByKey(key, newData) {
    const data = this.dataSource;
    return (newData || data).filter((item) => item.key === key)[0];
  }

  cancel(key) {
    const target = this.dataSource.filter((item) => item.key === key)[0];
    target.editable = false;
  }

  handleChange(value, key, column) {
    const newData = [...this.dataSource];
    const target = newData.filter((item) => key === item.key)[0];
    if (target) {
      target[column] = value;
      this.dataSource = newData;
    }
  }
}
</script>

<style scoped lang="less">
.form {
  background-color: @base-bg-color;
  padding: 24px;
}
</style>
