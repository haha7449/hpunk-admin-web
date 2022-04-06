import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Drawer, Modal, Space, Tag } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { connect } from 'umi';

const TableList = (props) => {
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [viewModalVisible, handleViewModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const {
    dispatch,
    memberAndmemberList: { memberList, pagination },
  } = props;
  const dataColumns = [
    {
      title: '账号',
      dataIndex: 'username',
      valueType: 'text',
      copyable: true,
    },
    {
      title: '手机',
      dataIndex: 'phone',
      valueType: 'text',
      copyable: true,
    },
    {
      title: '密码',
      dataIndex: 'password',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: true,
      hideInForm: true,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      valueType: 'text',
      copyable: true,
      hideInForm: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'date',
      hideInForm: true,
    },
    {
      title: '是否启用',
      dataIndex: 'status',
      hideInForm: true,
      valueType: 'select',
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
      render: (_, record) => [
        <a
          onClick={() => {
            handleUpdateModalVisible(true);
            setStepFormValues(record);
          }}
        >
          编辑
        </a>,
        <a
          onClick={() => {
            Modal.confirm({
              title: '编辑用户状态',
              content: record.status ? '确定禁用该用户吗？' : '确定启用该用户吗？',
              okText: '确认',
              cancelText: '取消',
              onOk: () => handleUpdateStatus(record.id, 'updateStatus', record.status ? 0 : 1),
            });
          }}
        >
          {record.status ? '禁用' : '启用'}
        </a>,
        <a
          onClick={() => {
            //console.log("index-record",record);
            Modal.confirm({
              title: '删除用户',
              content: '删除用户后，与该用户相关信息将会全部删除！确定删除该用户吗？',
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
   * 查询商品
   *
   */
  const queryMember = async (values) => {
    console.log('values', values);
    dispatch({
      type: 'memberAndmemberList/queryMember',
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
   * 更新用户状态
   *
   */
  const handleUpdateStatus = async (Id, type, value) => {
    let ids = [];
    if (type === 'updateStatus') {
      ids.push(Id);
    } else if (type === 'updateStatusBatch') {
      for (let i = 0; i < Id.length; i++) {
        ids.push(Id[i].id);
      }
    }

    dispatch({
      type: 'memberAndmemberList/updateStatus',
      payload: {
        ids,
        status: value,
      },
    })
      .then(function (res) {
        console.log('res', res);
        if (res) {
          message.success('更新成功');
          //重新刷新
          if (actionRef.current) {
            actionRef.current.reload();
          }
        } else {
          message.error('更新失败');
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  /**
   * 更新用户信息
   *
   */
  const updateMemberInfo = async (values) => {
    console.log('values', values);
    dispatch({
      type: 'memberAndmemberList/updateMemberInfo',
      payload: values,
    })
      .then(function (res) {
        console.log('res', res);
        if (res) {
          message.success('更新数据成功');
          handleUpdateModalVisible(false);
          setStepFormValues({});

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

  /**
   * 删除节点:
   *
   * @param id
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
      type: 'memberAndmemberList/deleteMember',
      payload: {
        ids,
      },
    })
      .then(function (res) {
        console.log('res', res);
        if (res) {
          message.success('删除成功');
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

  return (
    <PageContainer>
      <ProTable
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => []}
        request={async (params) => queryMember({ ...params })}
        dataSource={memberList}
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
              await handleRemove(selectedRowsState,'removeBatch');
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={(value) => updateMemberInfo(value)}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
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

export default connect(({ memberAndmemberList }) => ({
  memberAndmemberList,
}))(TableList);
