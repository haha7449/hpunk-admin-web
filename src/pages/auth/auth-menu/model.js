import { message } from 'antd';
import { queryMenu} from '../../../services/auth';
const Model = {
  namespace: 'authAndauthMenu',

  state: {
    menuList: [], //所有分类
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
  },

  effects: {
    *queryMenu({ payload }, { call, put }) {
      message.success('获取菜单数据中');
      console.log("queryMenu-payload",payload);
      const { current, ...rest } = payload;
      const newPayload = { pageNum:current, ...rest };
      console.log('showMenu-newPayload', newPayload);
      
      const response = yield call(queryMenu, newPayload);
      if (response === null) {
        message.error('获取菜单数据失败');
      } else {
        message.success('获取菜单数据成功');
      }
      yield put({
        type: 'showMenu',
        payload: response,
      });
    },

    *updateDeleteStatus({ payload }, { call, put }) {
      message.success('更新商品删除状态中');
      const response = yield call(updateDeleteStatus, payload);
      if (response.code === 500) {
        message.error('更新商品删除状态失败');
      } else if(response.code === 200){
        message.success('更新商品删除状态成功');
      }
      yield put({
        type: 'showProduct',
        payload: response,
      });
    },
  },

  reducers: {
    //将 payload 传过来的数据，保存到预设 state 里。所以当 state 数据发生改变后，页面也会随之重新渲染。
    showMenu(state, { payload }) {
      message.success('展示数据中....');
      console.log('showMenu-payload', payload);
      const { list } = payload.data;
      const { total, pageNum, pageSize } = payload.data;
      const pagination = { total, current:pageNum, pageSize };
      console.log('showMenu-pagination', pagination);
      return {
        ...state,
        menuList: list,
        pagination,
      };
    },
  },
};
export default Model;
