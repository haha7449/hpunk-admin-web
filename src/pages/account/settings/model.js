import { queryCity, queryCurrent, queryProvince, query as queryUsers,updatePassword } from './service';
const Model = {
  namespace: 'accountAndsettings',
  state: {
    currentUser: {},
    province: [],
    city: [],
    isLoading: false,
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },

    *fetchProvince(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryProvince);
      yield put({
        type: 'setProvince',
        payload: response,
      });
    },

    *fetchCity({ payload }, { call, put }) {
      const response = yield call(queryCity, payload);
      yield put({
        type: 'setCity',
        payload: response,
      });
    },

    *updatePassword({ payload }, { call, put }) {
      console.log("payload",payload);
      const response = yield call(updatePassword, payload);
      console.log("response",response);
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
    
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },

    changeNotifyCount(state = {}, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },

    setProvince(state, action) {
      return { ...state, province: action.payload };
    },

    setCity(state, action) {
      return { ...state, city: action.payload };
    },

    changeLoading(state, action) {
      return { ...state, isLoading: action.payload };
    },
  },
};
export default Model;