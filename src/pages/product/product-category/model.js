import {
  queryCategory,
  deleteCategory,
  addCategory,
  queryCateOne,
  updateCategory,
  updateNavStatus,
  updateShowStatus,
  transfer,
  queryCateTwo,
} from '../../../services/productCate';
const Model = {
  namespace: 'productAndproductCategory',

  state: {
    cateOneList: [], //一级分类
    cateTwoList: [], //二级分类
    categoryList: [], //所有分类
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
  },

  effects: {
    *queryCategory({ payload }, { call, put }) {
      console.log('-----获取数据中-----');
      console.log('queryCategory-payload', payload);
      const { current, ...rest } = payload;
      const newPayload = { pageNum: current, ...rest };
      console.log('queryCategory-newPayload', newPayload);

      const response = yield call(queryCategory, newPayload);
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

    *deleteCategory({ payload }, { call, put }) {
      console.log('-----删除数据中-----');
      console.log('deleteCategory-payload', payload);
      const response = yield call(deleteCategory, payload);
      //操作成功
      if (response.code === 200) {
        console.log('-----删除数据成功-----');
        return true;
      }
      //操作成功
      else {
        console.log('-----删除数据失败-----');
        return false;
      }
    },

    *addCategory({ payload }, { call, put }) {
      console.log('-----增加分类中-----');
      const response = yield call(addCategory, payload);
      //操作成功
      if (response.code === 200) {
        console.log('-----增加成功-----');
        return true;
      }
      //操作成功
      else {
        console.log('-----增加成功-----');
        return false;
      }
    },

    *queryCateOne({ payload }, { call, put }) {
      const response = yield call(queryCateOne, payload);
      console.log('queryCateOne-response', response);
      if (response.code === 200) {
        const list = [];
        if (response.data != null) {
          console.log('-----queryCateOne:获取数据成功-----');
          const { data } = response;          
          // 处理返回的数据，符合valueEnum的数据格式
          data.map((item) => {
            //使用接口返回值的id做为 代替原本的0，1
            list[`${item.id}`] = {text:item.name};
          });
          list[0]={text:'无'};
          console.log('list', list);
        } else {
          console.log('-----queryCateOne:没有数据-----');
        }

        yield put({
          type: 'showCateOne',
          payload: list,
        });
        return true;
      } else {
        console.log('-----queryCateOne:获取数据失败-----');
        return false;
      }
    },

    *queryCateTwo({ payload }, { call, put }) {
      const response = yield call(queryCateTwo, payload);
      console.log('queryCateTwo-response', response);
      if (response.code === 200) {
        if (response.data != null) {
          console.log('-----queryCateTwo:获取数据成功-----');
          const { data:list } = response;   
          yield put({
            type: 'showCateTwo',
            payload: list,
          });       
        } else {
          console.log('-----queryCateTwo:没有数据-----');
        }
        return true;
      } else {
        console.log('-----queryCateTwo:获取数据失败-----');
        return false;
      }
    },

    *updateCategory({ payload }, { call, put }) {
      console.log('-----更新数据中-----');
      console.log('updateCategory-payload', payload);
      const response = yield call(updateCategory, payload);
      //操作成功
      if (response.code === 200) {
        console.log('-----更新数据成功-----');
        return true;
      }
      //操作成功
      else {
        console.log('-----更新数据失败-----');
        return false;
      }
    },

    *updateNavStatus({ payload }, { call, put }) {
      console.log('-----更新导航栏显示中-----');
      const response = yield call(updateNavStatus, payload);

      //操作成功
      if (response.code === 200) {
        console.log('-----更新成功-----');
        return true;
      }
      //操作成功
      else {
        console.log('-----更新成功-----');
        return false;
      }
    },

    *updateShowStatus({ payload }, { call, put }) {
      console.log('-----更新显示中-----');
      const response = yield call(updateShowStatus, payload);

      //操作成功
      if (response.code === 200) {
        console.log('-----更新成功-----');
        return true;
      }
      //操作成功
      else {
        console.log('-----更新失败-----');
        return false;
      }
    },

    *transfer({ payload }, { call, put }) {
      console.log('-----转移商品中-----');
      const response = yield call(transfer, payload);

      //操作成功
      if (response.code === 200) {
        console.log('-----转移成功-----');
        return true;
      }
      //操作成功
      else {
        console.log('-----转移失败-----');
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
        categoryList: payload.list,
        pagination: payload.pagination,
      };
    },

    showCateOne(state, { payload }) {
      console.log('-----showCateOne:展示数据中-----');
      console.log('showCateOne-payload', payload);
      return {
        ...state,
        cateOneList: payload,
      };
    },

    showCateTwo(state, { payload }) {
      console.log('-----showCateTwo:展示数据中-----');
      console.log('showCateTwo-payload', payload);
      return {
        ...state,
        cateTwoList: payload,
      };
    },
  },
};
export default Model;
