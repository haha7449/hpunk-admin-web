import { submitForm } from '../../../services/product';
import { queryCateTwo } from '../../../services/productCate';
const Model = {
  namespace: 'productAndProductAdd',
  state: {
    cateOptions: [],
  },
  effects: {
    *queryCategory({ payload }, { call, put }) {
      const response = yield call(queryCateTwo, payload);
      //操作成功
      if (response.code === 200) {
        const { data } = response; //！！！！！！！！！
        if (response.data != null) {
          console.log('-----获取数据成功-----');       
          console.log('CategoryList', data);          
        } else {
          console.log('-----没有数据-----');
        }
        
        yield put({
          type: 'showCategory',
          payload: data,
        });
        return true;
      }
      //操作成功
      else {
        console.log('-----获取数据失败-----');
        return false;
      }
    },

    *submitForm({ payload }, { call }) {
      console.log('-----提交商品中-----');
      const response = yield call(submitForm, payload);

      //操作成功
      if (response.code === 200) {
        console.log('-----增加成功-----');
        return true;
      }
      //操作成功
      else {
        console.log('-----增加失败-----');
        return false;
      }
    },
  },

  reducers: {
    showCategory(state, { payload }) {
      console.log('-----showCategory:展示数据中-----');
      console.log('showCategory-payload', payload);
      return {
        ...state,
        cateOptions: payload,
      };
    },
  },
};
export default Model;
