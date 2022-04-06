import { queryMember,updateStatus,deleteMember,updateMemberInfo } from '../../../services/member';
const Model = {
  namespace: 'memberAndmemberList',

  state: {
    memberList: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
  },

  effects: {
    *queryMember({ payload }, { call, put }) {
      console.log('-----获取数据中-----');
      console.log('queryMember-payload', payload);
      const { current, ...rest } = payload;
      const newPayload = { pageNum: current, ...rest };
      console.log('queryMember-newPayload', newPayload);

      const response = yield call(queryMember, newPayload);
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

    *updateStatus({ payload }, { call, put }) {
      console.log('-----更新用户状态中-----');
      const response = yield call(updateStatus, payload);

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

    *deleteMember({ payload }, { call, put }) {
      console.log('-----删除用户中-----');
      const response = yield call(deleteMember, payload);

      //操作成功
      if (response.code === 200) {
        console.log('-----删除成功-----');
        return true;
      }
      //操作成功
      else {
        console.log('-----删除失败-----');
        return false;
      }
    },

    *updateMemberInfo({ payload }, { call, put }) {
      console.log('-----更新用户信息中-----');
      const response = yield call(updateMemberInfo, payload);

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
    //将 payload 传过来的数据，保存到预设 state 里。所以当 state 数据发生改变后，页面也会随之重新渲染。
    show(state, { payload }) {
      console.log('-----show:展示数据中-----');
      console.log('show-payload', payload);
      return {
        ...state,
        memberList: payload.list,
        pagination: payload.pagination,
      };
    },
  },
};
export default Model;
