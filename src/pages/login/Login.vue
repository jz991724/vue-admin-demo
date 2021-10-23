<template>
  <common-layout>
    <div class="top">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/img/logo.png"/>
        <span class="title">{{ systemName }}</span>
      </div>
      <div class="desc">尊享出行&nbsp;&nbsp;&nbsp;美好启程</div>
    </div>
    <div class="login">
      <a-form @submit="onSubmit" :form="form">
        <a-tabs size="large" :tabBarStyle="{textAlign: 'center'}" style="padding: 0 2px;">
          <a-tab-pane tab="账户密码登录" key="1">
            <a-alert type="error"
                     :closable="true"
                     v-show="error"
                     :message="error"
                     showIcon
                     style="margin-bottom: 24px;"/>
            <a-form-item>
              <a-input
                  autocomplete="autocomplete"
                  size="large"
                  placeholder="请输入账户名"
                  v-decorator="['userName', {rules: [{ required: true, message: '请输入账户名', whitespace: true}]}]">
                <a-icon slot="prefix" type="user"/>
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input size="large"
                       placeholder="请输入密码"
                       autocomplete="autocomplete"
                       type="password"
                       v-decorator="['password', {rules: [{ required: true, message: '请输入密码', whitespace: true}]}]">
                <a-icon slot="prefix" type="lock"/>
              </a-input>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
        <div>
          <a-checkbox :checked="true">自动登录</a-checkbox>
          <router-link style="float: right" to="/dashboard/workplace">忘记密码</router-link>
        </div>
        <a-form-item>
          <a-button :loading="logging"
                    style="width: 100%;margin-top: 24px"
                    size="large"
                    htmlType="submit"
                    type="primary">
            登录
          </a-button>
        </a-form-item>
        <div>
          <router-link style="float: right" to="/dashboard/workplace">注册账户</router-link>
        </div>
      </a-form>
    </div>
  </common-layout>
</template>

<script>
import { mapMutations } from 'vuex';
import Mock from 'mockjs';
import CommonLayout from '@/layouts/CommonLayout.vue';
import { login, getRoutesConfig } from '@/services/user';
import { setAuthorization } from '@/utils/request';
import { loadRoutes } from '@/utils/routerUtil';
import '@/mock/extend';
import UserManagement, { UserInfoTypeEnum } from '../../services/userManagement';

export default {
  name: 'Login',
  components: { CommonLayout },
  data() {
    return {
      logging: false,
      error: '',
      form: this.$form.createForm(this),
    };
  },
  computed: {
    systemName() {
      return this.$store.state.setting.systemName;
    },
  },
  methods: {
    ...mapMutations('account', ['setUser', 'setPermissions', 'setRoles']),
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err) => {
        if (!err) {
          this.logging = true;
          const userName = this.form.getFieldValue('userName');
          const password = this.form.getFieldValue('password');
          login(userName, password)
              .then((res) => {
                this.afterLogin(res, { userName });
              });
        }
      });
    },
    afterLogin(res, userInfo) {
      const {
        status,
        data: {
          result: {
            token,
            success,
          },
        },
      } = res;
      this.logging = false;
      if (status === 200 && success) {
        // this.setPermissions([{
        //   id: 'queryForm',
        //   operation: ['add', 'edit'],
        // }]);
        const { userName } = userInfo;

        UserManagement.getUserInfoByUserName({ userName })
            .then((info) => {
              this.setUser(info);

              const { userType } = info;
              // 设置操作按钮的权限
              if (userType === UserInfoTypeEnum.管理员) {
                this.setRoles([{
                  id: 'admin',
                  operation: ['add', 'edit', 'delete', 'import', 'export', 'dispatch'],
                }]);
              } else {
                this.setRoles([{
                  id: 'dispatcher',
                  operation: ['add', 'edit', 'delete', 'import', 'export', 'dispatch'],
                }]);
              }
            });

        setAuthorization({
          token,
          expireAt: new Date(new Date().getTime() + 30 * 60 * 1000 * 10), // token有效期设置
        });

        // 配置路由
        const routesConfig = [{
          router: 'root',
          children: [
            {
              router: 'dashboard',
              children: ['workplace', 'analysis'],
            },
            {
              router: 'form',
              children: ['basicForm', 'stepForm', 'advanceForm'],
            },
            {
              router: 'basicForm',
              name: '验权表单',
              icon: 'file-excel',
              authority: 'queryForm',
            },
            {
              router: 'antdv',
              path: 'antdv',
              name: 'Ant Design Vue',
              icon: 'ant-design',
              link: 'https://www.antdv.com/docs/vue/introduce-cn/',
            },
            {
              router: 'document',
              path: 'document',
              name: '使用文档',
              icon: 'file-word',
              link: 'https://iczer.gitee.io/vue-antd-admin-docs/',
            },
          ],
        }];

        loadRoutes(routesConfig);
        this.$router.push('/order/dispatchOrderList');
        this.$message.success(`${userName}，${Mock.mock('@TIMEFIX')?.CN}，欢迎回来！`, 3);

        // // 获取路由配置
        // getRoutesConfig()
        //     .then((result) => {
        //       debugger;
        //       const routesConfig = result.data.data;
        //       loadRoutes(routesConfig);
        //       this.$router.push('/dashboard/workplace');
        //       this.$message.success(`${Mock.mock('@TIMEFIX').CN}，欢迎回来`, 3);
        //     });
      } else {
        this.error = token;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.common-layout {
  .top {
    text-align: center;

    .header {
      height: 44px;
      line-height: 44px;

      a {
        text-decoration: none;
      }

      .logo {
        height: 44px;
        vertical-align: top;
        margin-right: 16px;
      }

      .title {
        font-size: 33px;
        color: @title-color;
        font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
        font-weight: 600;
        position: relative;
        top: 2px;
      }
    }

    .desc {
      font-size: 14px;
      color: @text-color-second;
      margin-top: 12px;
      margin-bottom: 40px;
    }
  }

  .login {
    width: 368px;
    margin: 0 auto;
    @media screen and (max-width: 576px) {
      width: 95%;
    }
    @media screen and (max-width: 320px) {
      .captcha-button {
        font-size: 14px;
      }
    }

    .icon {
      font-size: 24px;
      color: @text-color-second;
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: @primary-color;
      }
    }
  }
}
</style>
