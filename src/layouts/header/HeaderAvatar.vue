<template>
  <div>
    <a-dropdown>
      <div class="header-avatar" style="cursor: pointer">
        <!--        <a-avatar class="avatar" size="small" shape="circle"-->
        <!--                  :src="`../../assets/avatar/avatar_man.png`"/>-->
        <a-avatar class="avatar"
                  style="backgroundColor:#87d068;vertical-align: middle;">
          {{ user.userType|userTypeFilter }}
        </a-avatar>
        <span class="name">{{ user.userName }}</span>

        <!--        <a-badge :count="user.userType|userTypeFilter" :offset="[20,-2]" :numberStyle="{fontsize:'12px'}">-->
        <!--          <h3 class="name">-->
        <!--            {{ user.userName }}-->
        <!--          </h3>-->
        <!--        </a-badge>-->
      </div>
      <a-menu :class="['avatar-menu']" slot="overlay">
        <!--      <a-menu-item>-->
        <!--        <a-icon type="user" />-->
        <!--        <span>个人中心</span>-->
        <!--      </a-menu-item>-->
        <a-menu-item @click="openSettingModal()">
          <a-icon type="setting"/>
          <span>个人设置</span>
        </a-menu-item>
        <a-menu-divider/>
        <a-menu-item @click="logout" style="color: #F06450;">
          <a-icon style="margin-right: 8px;" type="poweroff"/>
          <span>退出登录</span>
        </a-menu-item>
      </a-menu>
    </a-dropdown>

    <!--个人设置-->
    <user-info-form-modal modal-title="个人设置" ref="settingModal" @submitSuccess="onUpdateAccount()"></user-info-form-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { logout } from '@/services/user';
import UserInfoFormModal from '../../pages/userManagement/userInfoFormModal';
import { UserInfoTypeEnum } from '../../services/userManagement';

export default {
  name: 'HeaderAvatar',
  components: { UserInfoFormModal },
  filters: {
    userTypeFilter: (type) => {
      return UserInfoTypeEnum[type];
    }
  },
  // data: { userInfoTypeEnum: UserInfoTypeEnum },
  computed: {
    ...mapGetters('account', ['user']),
  },
  methods: {
    logout() {
      this.$confirm({
        title: '提示：',
        content: h => <div style="color:#F06450;">确定退出当前账号？</div>,
        onOk: () => {
          logout();
          this.$router.push('/login');
        },
      });
    },
    openSettingModal() {
      let settingModal = this.$refs.settingModal;
      if (settingModal) {
        settingModal.openModal(this.user);
      }
    },
    onUpdateAccount() {//账号更新成功
      this.$confirm({
        title: '提示：',
        content: h => <div>用户信息修改成功，是否重新登录？</div>,
        onOk: () => {
          logout();
          this.$router.push('/login');
        },
      });
    }
  },
};
</script>

<style lang="less">
.header-avatar {
  display: inline-flex;

  .avatar, .name {
    align-self: center;
  }

  .avatar {
    margin-right: 8px;
  }

  .name {
    font-weight: 500;
  }
}

.avatar-menu {
  width: 150px;
}

</style>
