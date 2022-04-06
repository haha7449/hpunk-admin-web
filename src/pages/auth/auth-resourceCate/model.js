import { message } from 'antd';
import { queryResourceCate } from '../../../services/auth';
const Model = {
  namespace: 'authAndauthResourceCate',

  state: {
    resourceCateList: [], //所有分类
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
  },

  effects: {
    *queryResourceCate({ payload }, { call, put }) {
      message.success('获取资源数据中');
      console.log("queryResourceCate-payload",payload);
      const { current, ...rest } = payload;
      const newPayload = { pageNum:current, ...rest };
      console.log('queryResourceCate-newPayload', newPayload);
      
      const response = yield call(queryResourceCate, newPayload);
      if (response === null) {
        message.error('获取资源分类数据失败');
      } else {
        message.success('获取资源分类数据成功');
      }
      yield put({
        type: 'showResourceCate',
        payload: response,
      });
    },
  },

  reducers: {
    //将 payload 传过来的数据，保存到预设 state 里。所以当 state 数据发生改变后，页面也会随之重新渲染。
    showResourceCate(state, { payload }) {
      message.success('展示数据中....');
      console.log('showResourceCate-payload', payload);
      const { list } = payload.data;
      const { total, pageNum, pageSize } = payload.data;
      const pagination = { total, current:pageNum, pageSize };
      console.log('showResourceCate-pagination', pagination);
      return {
        ...state,
        resourceCateList: list,
        pagination,
      };
    },
  },
};
export default Model;
