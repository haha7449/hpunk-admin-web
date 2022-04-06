import { message } from 'antd';
import {
  queryProduct,
  querySku,
  updateDeleteStatus,
  updatePublishStatus,
  updateSku,
  updateProduct,
  queryProductById,
} from '../../../services/product';
import {queryCateTwo} from '../../../services/productCate';
const Model = {
  namespace: 'productAndproductList',

  state: {
    productList: [],
    cateList: [], //所有分类
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
    skuInit: {}, //某个商品的Sku库存+productId
    productItem: {},
  },

  effects: {
    *queryProduct({ payload }, { call, put }) {
      console.log('-----获取数据中-----');
      console.log('queryProduct-payload', payload);
      const { current, ...rest } = payload;
      const newPayload = { pageNum: current, ...rest };
      console.log('showProduct-newPayload', newPayload);

      const response = yield call(queryProduct, newPayload);
      //操作成功
      if (response.code === 200) {
        if (response.data != null) {
          console.log('-----获取数据成功-----');
        } else {
          console.log('-----没有数据-----');
        }

        //处理数据response
        const { list } = response.data;
        const { total, pageNum, pageSize } = response.data;
        const pagination = { total, current: pageNum, pageSize };
        yield put({
          type: 'show',
          payload: { list, pagination },
        });
        return true;
      }
      //操作成功
      else {
        console.log('-----获取数据失败-----');
        return false;
      }
    },

    *queryProductById({ payload }, { call, put }) {
      console.log('-----获取数据中-----');
      console.log('queryProductById-payload', payload);
      const response = yield call(queryProductById, payload);
      //操作成功
      if (response.code === 200) {
        if (response.data != null) {
          console.log('-----获取数据成功-----');
          const {data} = response;
          //处理数据response
          yield put({
            type: 'showProduct',
            payload: { data },
          });
        } else {
          console.log('-----没有数据-----');
        }

        return true;
      }
      //操作成功
      else {
        console.log('-----获取数据失败-----');
        return false;
      }
    },

    *updateProduct({ payload }, { call, put }) {
      console.log('-----更新数据中-----');
      console.log('updateProduct-payload', payload);
      const response = yield call(updateProduct, payload);
      //操作成功
      if (response.code === 200) {
        console.log('-----更新数据成功-----');
        return true;
      }
      //操作失败
      else {
        console.log('-----更新数据失败-----');
        return false;
      }
    },

    *querySku({ payload }, { call, put }) {
      // message.success('-----获取Sku数据中-----');
      console.log('querySku-payload', payload);
      const response = yield call(querySku, payload);
      if (response.code === 200) {
        message.success('获取商品数据成功');
        const skuInit = { pid: payload, skuStockList: response.data };
        yield put({
          type: 'showSku',
          payload: skuInit,
        });
        return true;
      } else {
        message.error('获取商品数据失败');
      }
    },

    *updateSku({ payload }, { call, put }) {
      // message.success('更新商品Sku数据中');
      console.log('updateSku-payload', payload);
      const response = yield call(updateSku, payload);
      if (response.code === 200) {
        return true;
      } else {
        return false;
      }
    },

    *clearSku({ payload }, { call, put }) {
      const skuInit = {};
      yield put({
        type: 'showSku',
        payload: skuInit,
      });
    },

    *updateDeleteStatus({ payload }, { call, put }) {
      console.log('-----删除商品中-----');
      const response = yield call(updateDeleteStatus, payload);

      //操作成功
      if (response.code === 200) {
        console.log('-----删除数据成功-----');
        return true;
      }
      //操作成功
      else {
        console.log('-----获取数据失败-----');
        return false;
      }
    },

    *updatePublishStatus({ payload }, { call, put }) {
      console.log('-----上架商品中-----');
      const response = yield call(updatePublishStatus, payload);

      //操作成功
      if (response.code === 200) {
        console.log('-----上架成功-----');
        return true;
      }
      //操作成功
      else {
        console.log('-----上架失败-----');
        return false;
      }
    },

    *queryCategory({ payload }, { call, put }) {
      const response = yield call(queryCateTwo, payload);
      //操作成功
      if (response.code === 200) {
        if (response.data != null) {
          console.log('-----queryCategory:获取数据成功-----');
        } else {
          console.log('-----queryCategory:没有数据-----');
        }

        //处理数据response
        const { data } = response;
        const cateList = [];
        data.map((item) => {
          cateList[`${item.id}`] = { text: item.name };
        });
        console.log('cateList', cateList);
        yield put({
          type: 'showCate',
          payload: { cateList },
        });
        return true;
      }
      //操作成功
      else {
        console.log('-----queryCategory:获取数据失败-----');
        return false;
      }
    },
  },

  reducers: {
    //将 payload 传过来的数据，保存到预设 state 里。所以当 state 数据发生改变后，页面也会随之重新渲染。
    show(state, { payload }) {
      console.log('-----show:展示数据中-----');
      console.log('show-payload', payload);
      return {
        ...state,
        productList: payload.list,
        pagination: payload.pagination,
      };
    },

    showProduct(state, { payload }) {
      console.log('-----showProduct:展示数据中-----');
      console.log('showProduct-payload', payload);
      return {
        ...state,
        productItem: payload.data,
      };
    },

    showSku(state, { payload }) {
      // message.success('-----showSku:展示Sku数据中-----');
      console.log('showSku-payload', payload);
      return {
        ...state,
        skuInit: payload,
      };
    },

    showCate(state, { payload }) {
      console.log('-----showCate:展示数据中-----');
      console.log('showCate-payload', payload);
      return {
        ...state,
        cateList: payload.cateList,
      };
    },
  },
};
export default Model;
