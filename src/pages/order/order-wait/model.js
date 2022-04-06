import { message } from 'antd';
import { queryOrderWait,deleteOrder,delivery,getOrderItemList } from '../../../services/order';
const Model = {
  namespace: 'orderAndorderWait',

  state: {
    orderWaitList: [], //所有分类
    orderItemList:[],//某个order的orderItemList
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
  },

  effects: {
    *queryOrderWait({ payload }, { call, put }) {
      console.log('queryOrderWait-payload', payload);
      const { current, ...rest } = payload;
      const newPayload = { pageNum: current, ...rest };
      console.log('showOrder-newPayload', newPayload);

      const response = yield call(queryOrderWait, newPayload);
      if (response.code === 200) {
        // message.success('获取数据成功');
      } else {
        // message.error('获取数据失败');
      }
      yield put({
        type: 'show',
        payload: response,
      });
    },

    *getOrderItemList({ payload }, { call, put }) {
      console.log("-----获取数据中-----");
      console.log('getOrderItemList-payload', payload);

      const response = yield call(getOrderItemList, payload);
      //操作成功
      if (response.code === 200) {
        if (response.data != null) {
          console.log('-----获取数据成功-----');
        } else {
          console.log('-----没有数据-----');
        }

        //处理数据response
        yield put({
          type: 'showOrderItemList',
          payload: response,
        });
        return true;
      }
      //操作成功
      else {
        console.log('-----获取数据失败-----');
        return false;
      }
    },

    *delivery({ payload }, { call, put }) {
      console.log('-----发货中-----');
      const response = yield call(delivery, payload);

      //操作成功
      if (response.code === 200) {
        console.log('-----发货成功-----');
        return true;
      }
      //操作成功
      else {
        console.log('-----发货失败-----');
        return false;
      }
    },

    *deleteOrder({ payload }, { call, put }) {
      console.log('-----删除数据中-----');
      console.log('deleteOrder-payload', payload);
      const response = yield call(deleteOrder, payload);
      //操作成功
      if (response.code === 200) {
        console.log('-----删除数据成功-----');
        return true;
      }
      //操作失败
      else {
        console.log('-----删除数据失败-----');
        return false;
      }
    },
  },

  reducers: {
    //将 payload 传过来的数据，保存到预设 state 里。所以当 state 数据发生改变后，页面也会随之重新渲染。
    show(state, { payload }) {
      // message.success('展示数据中....');
      console.log('show-payload', payload);
      const { list } = payload.data;
      const { total, pageNum, pageSize } = payload.data;
      const pagination = { total, current: pageNum, pageSize };
      console.log('showOrder-pagination', pagination);
      return {
        ...state,
        orderWaitList: list,
        pagination,
      };
    },
    showOrderItemList(state, { payload }) {
      // message.success('展示数据中....');
      console.log('showOrderItemList-payload', payload);
      return {
        ...state,
        orderItemList: payload.data,
      };
    },
  },
};
export default Model;
