import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Drawer, Modal, Space, Tag } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import RoleForm from '././components/RoleForm';
import UpdateForm from '././components/UpdateForm';
import { updateRule, addRule, removeRule } from '../../../services/auth';
import { useHistory } from 'react-router';
import { connect } from 'umi';

/**
 * 添加节点
 *
 * @param fields
 */

const handleAdd = async (fields) => {
  const hide = message.loading('正在添加');

  try {
    await addRule({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

const TableList = (props) => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [roleModalVisible, handleRoleModalVisible] = useState(false);
  const [viewModalVisible, handleViewModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [updateFormValues, setUpdateFormValues] = useState({});
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const {
    dispatch,
    authAndauthList: { adminList, pagination },
  } = props;
  const dataColumns = [
    {
      title: '账号',
      dataIndex: 'username',
      valueType: 'text',
      copyable: true,
      hideInForm:true,
    },
    {
      title: '密码',
      dataIndex: 'password',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: true,
      hideInForm:true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
      copyable: true,
    },
    {
      title: '角色',
      dataIndex: 'role',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '普通管理员',
        },
        1: {
          text: '超级管理员',
        },
        2: {
          text: '商品管理员',
        },
        3: {
          text: '订单管理员',
        },
      },
      render: (_, record) => {
        let color = '';
        let name = '';
        if (record.role === 0) {
          color = 'cyan';
          name = '普通管理员';
        } else if (record.role === 1) {
          color = 'gold';
          name = '超级管理员';
        } else if (record.role === 2) {
          color = 'green';
          name = '商品管理员';
        } else if (record.role === 3) {
          color = 'purple';
          name = '订单管理员';
        }
        return (
          <Space>
            <Tag color={color} key={record.id} value={record.role}>
              {name}
            </Tag>
          </Space>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'date',
      hideInForm: true,
    },
    {
      title: '最后登录',
      dataIndex: 'loginTime',
      valueType: 'date',
      hideInForm: true,
    },
    {
      title: '是否启用',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '禁用',
        },
        1: {
          text: '启用',
        },
      },
      render: (_, record) => {
        let color = '';
        let name = '';
        if (record.status === 0) {
          color = 'red';
          name = '禁用';
        } else if (record.status === 1) {
          color = 'green';
          name = '启用';
        }
        return (
          <Space>
            <Tag color={color} key={record.id} value={record.status}>
              {name}
            </Tag>
          </Space>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 250,
      render: (_, record) => [
        <a
          onClick={() => {
            handleRoleModalVisible(true);
            setStepFormValues(record);
          }}
        >
          分配权限
        </a>,
        <a
          onClick={() => {
            handleUpdateModalVisible(true);
            setUpdateFormValues(record);
          }}
        >
          编辑
        </a>,
        <a
          onClick={() => {
            //console.log("index-record",record);
            Modal.confirm({
              title: '编辑管理员状态',
              content: record.status ? '确定禁用该管理员吗？' : '确定启用该管理员吗？',
              okText: '确认',
              cancelText: '取消',
              onOk: () => handleUpdateStatus({ id: record.id, status: record.status ? 0 : 1 }),
            });
          }}
        >
          {record.status ? '禁用' : '启用'}
        </a>,
        <a
          onClick={() => {
            //console.log("index-record",record);
            Modal.confirm({
              title: '删除管理员',
              content: '请尽量使用“禁用”管理员，而不是删除管理员。确定删除该管理员吗？',
              okText: '确认',
              cancelText: '取消',
              onOk: () => handleRemove(record.id, 'remove'),
            });
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  /**
   * 查询节点
   *
   */
  const queryAdmin = async (values) => {
    console.log('values', values);
    dispatch({
      type: 'authAndauthList/queryAdmin',
      payload: values,
    })
      .then(function (res) {
        console.log('res', res);
        // res ? message.success('获取数据成功') : message.error('获取数据失败');
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

   /**
   * 分配权限
   *
   */
  const addAdmin = async (values) => {
    console.log('values', values);
    dispatch({
      type: 'authAndauthList/addAdmin',
      payload: values,
    })
      .then(function (res) {
        console.log('res', res);
        if (res) {
          message.success('添加成功');
          handleModalVisible(false);

          if (actionRef.current) {
            actionRef.current.reload();
          }
        } else {
          message.error('添加失败');
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  /**
   * 分配权限
   *
   */
  const allocRole = async (values) => {
    console.log('values', values);
    dispatch({
      type: 'authAndauthList/allocRole',
      payload: values,
    })
      .then(function (res) {
        console.log('res', res);
        if (res) {
          message.success('分配权限成功');
          handleRoleModalVisible(false);
          setStepFormValues({});

          if (actionRef.current) {
            actionRef.current.reload();
          }
        } else {
          message.error('分配权限失败');
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  /**
   * 更新用户状态
   *
   */
  const handleUpdateStatus = async (values) => {
    console.log('values', values);
    dispatch({
      type: 'authAndauthList/updateStatus',
      payload: values,
    })
      .then(function (res) {
        console.log('res', res);
        if (res) {
          message.success('更新状态成功');

          if (actionRef.current) {
            actionRef.current.reload();
          }
        } else {
          message.error('更新状态失败');
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  /**
   * 删除节点:
   */
  const handleRemove = async (deleteId, type) => {
    let ids = [];
    if (type === 'remove') {
      ids.push(deleteId);
    } else if (type === 'removeBatch') {
      for (let i = 0; i < deleteId.length; i++) {
        ids.push(deleteId[i].id);
      }
    }

    dispatch({
      type: 'authAndauthList/deleteAdmin',
      payload: {
        ids,
      },
    })
      .then(function (res) {
        console.log('res', res);
        if (res) {
          message.success('删除成功');
          //重新刷新
          if (actionRef.current) {
            actionRef.current.reload();
          }
        } else {
          message.error('删除失败');
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  /**
   * 更新管理员
   */
  const updateAdmin = async (values) => {
    console.log('values', values);
    dispatch({
      type: 'authAndauthList/updateAdmin',
      payload: values,
    })
      .then(function (res) {
        console.log('res', res);
        if (res) {
          message.success('更新数据成功');
          handleUpdateModalVisible(false);
          setUpdateFormValues({});

          if (actionRef.current) {
            actionRef.current.reload();
          }
        } else {
          message.error('更新数据失败');
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  return (
    <PageContainer>
      <ProTable
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 添加管理员
          </Button>,
        ]}
        request={async (params) => queryAdmin({ ...params })}
        dataSource={adminList}
        columns={dataColumns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        pagination={pagination}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState, 'removeBatch');
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量上架</Button>
        </FooterToolbar>
      )}
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable
          onSubmit={async (value) => {
            addAdmin(value);
          }}
          rowKey="key"
          type="form"
          columns={dataColumns}
        />
      </CreateForm>
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <RoleForm
          onSubmit={async (value) => {
            allocRole(value);
          }}
          onCancel={() => {
            handleRoleModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={roleModalVisible}
          values={stepFormValues}
        />
      ) : null}
      {updateFormValues && Object.keys(updateFormValues).length ? (
        <UpdateForm
          onSubmit={(value) => updateAdmin(value)}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setUpdateFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={updateFormValues}
        />
      ) : null}

      <Drawer
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.name && (
          <ProDescriptions
            column={2}
            title={row?.name}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.name,
            }}
            columns={dataColumns}
          />
        )}
      </Drawer>
      <Drawer
        width={640}
        placement="right"
        closable={false}
        onClose={() => handleViewModalVisible(false)}
        visible={viewModalVisible}
      >
        Drawer
      </Drawer>
    </PageContainer>
  );
};

export default connect(({ authAndauthList }) => ({
  authAndauthList,
}))(TableList);
