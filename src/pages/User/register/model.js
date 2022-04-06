import { fakeRegister,register } from './service';
const Model = {
  namespace: 'userAndregister',
  state: {
    status: undefined,
  },
  effects: {
    *submit({ payload }, { call, put }) {
      console.log("submit-payload",payload);
      const response = yield call(register, payload);
      console.log("submit-response",response);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
    *clearStatus({ payload }, { call, put }) {
      console.log("过来了");
      yield put({
        type: 'clearStatus',
        payload: {},
      });
    },
  },
  reducers: {
    registerHandle(state, { payload }) {
      return { ...state, status: payload.code };
    },
    clearStatus(state, { payload }) {
      return { ...state, status:undefined };
    },
  },
};
export default Model;
