import { stringify } from 'querystring';
import { history } from 'umi';
import {  login } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';
import storageUtils from '../utils/storageUtils';
const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      console.log('login-response', response);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully

      if (response.code === 200) {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        message.success('🎉 🎉 🎉  登录成功！');
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        // history.replace(redirect || '/');
        history.replace('/account/settings' || '/');
      }
    },

    logout() {
      storageUtils.removeAdmin();
      storageUtils.removeRole();
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note

      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      const { data, code } = payload;

      let status = '';
      if (code === 200) {
        //存储user
        const { username, id,icon, ...rest } = data;
        const admin = { name: username, userid: id,avatar:icon, ...rest };
        console.log("admin",admin);
        storageUtils.saveAdmin(admin);

        //设置权限
        let role = '';
        if (data.role === 0) {
          role = 'admin';
        } else if (data.role === 1) {
          role = 'adminSuper';
        } else if (data.role === 2) {
          role = 'adminProduct';
        } else if (data.role === 3) {
          role = 'adminOrder';
        }
        console.log('role', role);
        setAuthority(role);
        status = 'ok';
      } else {
        status = 'error';
      }
      //只实现了账号密码登录：type默认为account
      return { ...state, status, type: 'account' };
    },
  },
};
export default Model;
