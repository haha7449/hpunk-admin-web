import { message } from 'antd';
import { queryRole } from '../../../services/auth';
const Model = {
  namespace: 'authAndauthRole',

  state: {
    roleList: [], //所有分类
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
  },

  effects: {
    *queryRole({ payload }, { call, put }) {
      message.success('获取角色中');
      console.log("queryRole-payload",payload);
      const { current, ...rest } = payload;
      const newPayload = { pageNum:current, ...rest };
      console.log('queryRole-newPayload', newPayload);
      
      const response = yield call(queryRole, newPayload);
      if (response.code === 200) {
        message.success('获取角色成功');
      } else {
        message.error('获取角色失败');
      }
      yield put({
        type: 'showRole',
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

    *queryBrand({ payload }, { call, put }) {
      const response = yield call(queryBrand, payload);
      if (response === null) {
        message.error('获取品牌数据失败');
      } else {
        message.success('获取品牌数据成功');
      }
      const { list } = response.data;
      //处理返回的数据，符合valueEnum的数据格式
      list.map((item) => {
        //使用接口返回值的id做为 代替原本的0，1
        data[item.id] = {
          //使用接口返回值中的overdueValue属性作为原本的text:后面的值
          text: item.name,
        };
      });
      console.log('brandList', list);
      yield put({
        type: 'showBrand',
        payload: list,
      });
    },

    *queryCategory({ payload }, { call, put }) {
      const response = yield call(queryCategory, payload);
      if (response === null) {
        message.error('获取分类数据失败');
      } else {
        message.success('获取分类数据成功');
      }
      const { list } = response.data;
      list.map((item) => {
        //使用接口返回值的id做为 代替原本的0，1
        data[item.id] = {
          //使用接口返回值中的overdueValue属性作为原本的text:后面的值
          text: item.name,
        };
      });
      console.log('CategoryList', list);
      yield put({
        type: 'showCategory',
        payload: list,
      });
    },
  },

  reducers: {
    //将 payload 传过来的数据，保存到预设 state 里。所以当 state 数据发生改变后，页面也会随之重新渲染。
    showRole(state, { payload }) {
      message.success('展示数据中....');
      console.log('showRole-payload', payload);
      const { list } = payload.data;
      const { total, pageNum, pageSize } = payload.data;
      const pagination = { total, current:pageNum, pageSize };
      console.log('showRole-pagination', pagination);
      return {
        ...state,
        roleList: list,
        pagination,
      };
    },
  },
};
export default Model;
