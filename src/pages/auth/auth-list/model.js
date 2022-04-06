import { message } from 'antd';
import { queryAdmin, allocRole,updateStatus,deleteAdmin,updateAdmin,addAdmin } from '../../../services/auth';
const Model = {
  namespace: 'authAndauthList',

  state: {
    adminList: [], //所有分类
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
  },

  effects: {
    *queryAdmin({ payload }, { call, put }) {
      console.log('-----获取数据中-----');
      console.log('queryAdmin-payload', payload);
      const { current, ...rest } = payload;
      const newPayload = { pageNum: current, ...rest };
      console.log('queryAdmin-newPayload', newPayload);

      const response = yield call(queryAdmin, newPayload);
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

    *addAdmin({ payload }, { call, put }) {
      console.log('-----添加数据中-----');
      console.log('addAdmin-payload', payload);
      const response = yield call(addAdmin, payload);
      //操作成功
      if (response.code === 200) {
        console.log('-----添加成功-----');
        return true;
      }
      //操作失败
      else {
        console.log('-----添加失败-----');
        return false;
      }
    },

    *updateAdmin({ payload }, { call, put }) {
      console.log('-----更新数据中-----');
      console.log('updateAdmin-payload', payload);
      const response = yield call(updateAdmin, payload);
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

    *allocRole({ payload }, { call, put }) {
      console.log('-----分配角色中-----');
      console.log('allocRole-payload', payload);

      const response = yield call(allocRole, payload);
      //操作成功
      if (response.code === 200) {
        console.log('-----分配角色操作成功-----');
        return true;
      }
      //操作失败
      else {
        console.log('-----分配角色操作失败-----');
        return false;
      }
    },

    *updateStatus({ payload }, { call, put }) {
      console.log('-----更新管理员状态中-----');
      console.log('updateStatus-payload', payload);

      const response = yield call(updateStatus, payload);
      //操作成功
      if (response.code === 200) {
        console.log('-----更新状态成功-----');
        return true;
      }
      //操作失败
      else {
        console.log('-----更新状态失败-----');
        return false;
      }
    },

    *deleteAdmin({ payload }, { call, put }) {
      console.log('-----删除管理员中-----');
      console.log('deleteAdmin-payload', payload);

      const response = yield call(deleteAdmin, payload);
      //操作成功
      if (response.code === 200) {
        console.log('-----删除成功-----');
        return true;
      }
      //操作失败
      else {
        console.log('-----删除失败-----');
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
        adminList: payload.list,
        pagination: payload.pagination,
      };
    },
  },
};
export default Model;
