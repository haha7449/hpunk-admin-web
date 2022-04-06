import { fakeSubmitForm } from './service';
import { message,Upload } from 'antd';
import { uploadTest } from '../../../services/test.js';
const Model = {
  namespace: 'productAndProductAddTest',
  state: {
    pic:'',
  },

  effects: {
    *uploadTest({ payload }, { call, put }) {
      const response = yield call(uploadTest, payload);
      if (response === null) {
        message.error('获取数据失败');
      } else {
        message.success('获取数据成功');
      }
      console.log('response', response);
      // yield put({
      //   type: 'showBrand',
      //   payload: data,
      // });
    },

  },
  reducers: {
    saveCurrentStep(state, { payload }) {
      return { ...state, current: payload };
    },

    saveStepFormData(state, { payload }) {
      return { ...state, step: { ...state.step, ...payload } };
    },

    showBrand(state, { payload }) {
      message.success('展示数据中....');
      console.log('payload', payload);
      return {
        ...state,
        brandOptions: payload,
      };
    },

    showCategory(state, { payload }) {
      message.success('展示数据中....');
      console.log('payload', payload);
      return {
        ...state,
        cateOptions: payload,
      };
    },
  },
};
export default Model;
