/**
 * local数据存储管理
 */
import store from 'store';
const ADMIN_KEY = "admin_key";
const ADMIN_ROLE_KEY = "antd-pro-authority";
export default {
  /**
   * 保存User
   */
  saveAdmin(admin) {
    // localStorage.setItem(USER_KEY, JSON.stringify(user));
    store.set(ADMIN_KEY,admin);
  },
  /**
   * 读取User
   */
  getAdmin() {
    return store.get(ADMIN_KEY) || {};
  },
  /**
   * 删除User
   */
  removeAdmin() {
    store.remove(ADMIN_KEY);
  },
  /**
   * 删除权限
   */
  removeRole() {
    store.remove(ADMIN_ROLE_KEY);
  },
};
