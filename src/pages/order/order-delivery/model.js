import { message } from 'antd';
import { queryOrderDelivery ,deleteOrder,getOrderItemList} from '../../../services/order';
import { getComment } from '../../../services/product';
const Model = {
  namespace: 'orderAndorderDelivery',

  state: {
    orderDeliveryList: [], //所有分类
    orderItemList:[],//某个order的orderItemList
    comment:{},//某个orderItem的comment
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
  },

  effects: {
    *queryOrderDelivery({ payload }, { call, put }) {
      // message.loading('获取订单数据中');
      console.log('queryOrderDelivery-payload', payload);
      const { current, ...rest } = payload;
      const newPayload = { pageNum: current, ...rest };
      console.log('queryOrderDelivery-newPayload', newPayload);

      const response = yield call(queryOrderDelivery, newPayload);
      if (response.code === 200) {
        // message.success('获取订单数据成功');
      } else {
        // message.error('获取订单数据失败');
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

    *getComment({ payload }, { call, put }) {
      console.log("-----获取数据中-----");
      console.log('getComment-payload', payload);

      const response = yield call(getComment, payload);
      console.log("response",response);
      //操作成功
      if (response.code === 200) {
        if (response.data != null) {
          console.log('-----获取数据成功-----');
        } else {
          console.log('-----没有数据-----');
        }

        //处理数据response
        yield put({
          type: 'showComment',
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
  },

  reducers: {
    //将 payload 传过来的数据，保存到预设 state 里。所以当 state 数据发生改变后，页面也会随之重新渲染。
    show(state, { payload }) {
      // message.success('展示数据中....');
      console.log('show-payload', payload);
      const { list } = payload.data;
      const { total, pageNum, pageSize } = payload.data;
      const pagination = { total, current: pageNum, pageSize };
      console.log('show-pagination', pagination);
      return {
        ...state,
        orderDeliveryList: list,
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
    showComment(state, { payload }) {
      // message.success('展示数据中....');
      console.log('showComment-payload', payload);
      return {
        ...state,
        comment: payload.data,
      };
    },
  },
};
export default Model;
