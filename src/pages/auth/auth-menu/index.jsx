import { PlusOutlined, EditOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Drawer, Modal, Space } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { updateRule, addRule, removeRule, queryMenu } from '../../../services/auth';
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
/**
 * 更新节点
 *
 * @param fields
 */

const handleUpdate = async (fields) => {
  const hide = message.loading('正在配置');

  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

const TableList = (props) => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [viewModalVisible, handleViewModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const history = useHistory();
  const {
    dispatch,
    authAndauthMenu: { menuList, pagination },
  } = props;
  const dataColumns = [
    {
      title: '菜单名称',
      dataIndex: 'title',
      valueType: 'text',
    },
    {
      title: '菜单级数',
      dataIndex: 'level',
      valueEnum: {
        0: {
          text: '一级',
          status: 'success',
        },
        1: {
          text: '二级',
          status: 'error',
        },
      },
    },
    {
      title: '前端名称',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '是否显示',
      dataIndex: 'hidden',
      valueEnum: {
        0: {
          text: '不显示',
          status: 'error',
        },
        1: {
          text: '显示',
          status: 'success',
        },
      },
    },
    {
      title: '排序',
      dataIndex: 'sort',
      valueType: 'digit',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 150,
      render: (_, record) => [
        <a
          onClick={() => {
            handleViewModalVisible(true);
            setStepFormValues(record);
          }}
        >
          查看
        </a>,
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
            //console.log("index-record",record);
            Modal.confirm({
              title: '删除商品',
              content: '确定删除该商品吗？',
              okText: '确认',
              cancelText: '取消',
              onOk: () => handleRemove(record.id),
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
  const queryMenu = async (values) => {
    console.log('values', values);
    dispatch({
      type: 'authAndauthMenu/queryMenu',
      payload: values,
    });
  };

  /**
   * 删除节点
   *
   * @param id
   */
  const handleRemove = async (id) => {
    let ids = [];
    ids.push(id);
    dispatch({
      type: 'productAndproductList/updateDeleteStatus',
      payload: {
        ids,
        deleteStatus: 1,
      },
    });
    //重新刷新
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };

  /**
   * 批量删除节点
   *
   * @param selectedRows
   */
  const handleBatchRemove = async (selectedRows) => {
    message.success('正在批量删除');
    if (!selectedRows) return true;
    //console.log("index-selectedRows",selectedRows)

    let ids = [];
    for (let i = 0; i < selectedRows.length; i++) {
      ids.push(selectedRows[i].id);
    }
    //console.log("index-ids",ids);
    dispatch({
      type: 'productAndproductList/updateDeleteStatus',
      payload: {
        ids,
        deleteStatus: 1,
      },
    });
    //重新刷新
    if (actionRef.current) {
      actionRef.current.reload();
    }
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
            <PlusOutlined /> 添加菜单
          </Button>,
        ]}
        request={async (params) => queryMenu({ ...params })}
        dataSource={menuList}
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
              await handleBatchRemove(selectedRowsState);
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
            const success = await handleAdd(value);

            if (success) {
              handleModalVisible(false);

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="key"
          type="form"
          columns={dataColumns}
        />
      </CreateForm>
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);

            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
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

export default connect(({ authAndauthMenu }) => ({
  authAndauthMenu,
}))(TableList);
