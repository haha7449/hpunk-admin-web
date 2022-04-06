import { message } from 'antd';
import { queryResource } from '../../../services/auth';
const Model = {
  namespace: 'authAndauthResource',

  state: {
    resourceList: [], //所有分类
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
  },

  effects: {
    *queryResource({ payload }, { call, put }) {
      message.success('获取资源数据中');
      console.log("queryResource-payload",payload);
      const { current, ...rest } = payload;
      const newPayload = { pageNum:current, ...rest };
      console.log('queryResource-newPayload', newPayload);
      
      const response = yield call(queryResource, newPayload);
      if (response === null) {
        message.error('获取资源数据失败');
      } else {
        message.success('获取资源数据成功');
      }
      yield put({
        type: 'showResource',
        payload: response,
      });
    },
  },

  reducers: {
    //将 payload 传过来的数据，保存到预设 state 里。所以当 state 数据发生改变后，页面也会随之重新渲染。
    showResource(state, { payload }) {
      message.success('展示数据中....');
      console.log('showResource-payload', payload);
      const { list } = payload.data;
      const { total, pageNum, pageSize } = payload.data;
      const pagination = { total, current:pageNum, pageSize };
      console.log('showResource-pagination', pagination);
      return {
        ...state,
        resourceList: list,
        pagination,
      };
    },
  },
};
export default Model;
