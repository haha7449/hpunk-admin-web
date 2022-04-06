import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Drawer, Modal, Tag, Space } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import TransferForm from './components/TransferForm';
import { connect } from 'umi';

const TableList = (props) => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [transferModalVisible, handleTransferModalVisible] = useState(false);
  const [transferFormValues, setTransferFormValues] = useState({});
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const {
    dispatch,
    productAndproductCategory: { cateOneList, categoryList, pagination },
  } = props;
  const dataColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'text',
      copyable: true,
    },
    {
      title: '上级分类',
      dataIndex: 'parentId',
      valueEnum: cateOneList,
    },
    {
      title: '级别',
      dataIndex: 'level',
      hideInForm: true,
      valueType: 'select',
      tip: '级别不可修改',
      valueEnum: {
        0: {
          text: '一级',
        },
        1: {
          text: '二级',
        },
      },
      render: (_, record) => {
        let color = '';
        let name = '';
        if (record.level === 0) {
          color = 'blue';
          name = '一级';
        } else {
          color = 'geekblue';
          name = '二级';
        }
        return (
          <Space>
            <Tag color={color} key={record.id} value={record.level}>
              {name}
            </Tag>
          </Space>
        );
      },
    },
    {
      title: '商品数量',
      dataIndex: 'productCount',
      valueType: 'digit',
      hideInSearch: true,
      hideInForm: true,
    },
    // {
    //   title: '导航栏',
    //   dataIndex: 'navStatus',
    //   tip: '是否在导航栏显示',
    //   valueType: 'select',
    //   valueEnum: {
    //     0: {
    //       text: '不显示',
    //     },
    //     1: {
    //       text: '显示',
    //     },
    //   },
    //   render: (_, record) => {
    //     let color = '';
    //     let name = '';
    //     if (record.navStatus === 0) {
    //       color = 'red';
    //       name = '不显示';
    //     } else {
    //       color = 'green';
    //       name = '显示';
    //     }
    //     return (
    //       <Space>
    //         <Tag color={color} key={record.id} value={record.navStatus}>
    //           {name}
    //         </Tag>
    //       </Space>
    //     );
    //   },
    // },
    {
      title: '是否显示',
      dataIndex: 'showStatus',
      valueType: 'select',
      valueEnum: {
        0: {
          text: '不显示',
        },
        1: {
          text: '显示',
        },
      },
      render: (_, record) => {
        let color = '';
        let name = '';
        if (record.showStatus === 0) {
          color = 'red';
          name = '不显示';
        } else {
          color = 'green';
          name = '显示';
        }
        return (
          <Space>
            <Tag color={color} key={record.id} value={record.showStatus}>
              {name}
            </Tag>
          </Space>
        );
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
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
            console.log("record.productCount",record.productCount);
            if (record.productCount === 0) {
              Modal.confirm({
                title: '删除分类',
                content: '确定删除该分类吗？',
                okText: '确认',
                cancelText: '取消',
                onOk: () => handleRemove(record.id),
              });
            } else {
              Modal.confirm({
                title: '提示',
                content: '商品数量不为空，不可删除！请先转移商品至其他分类或删除该分类下商品！',
                cancelText: '取消',
              });
            }
          }}
        >
          删除
        </a>,
        record.parentId ? (
          <a
            onClick={() => {
              handleTransferModalVisible(true);
              setTransferFormValues(record);
            }}
          >
            转移商品
          </a>
        ) : null,
      ],
    },
  ];

  /**
   * 查询一级分类
   *
   */
  const queryCateOne = async () => {
    dispatch({
      type: 'productAndproductCategory/queryCateOne',
      payload: '',
    })
      .then(function (res) {
        console.log('res', res);
        // res ? message.success('获取一级分类数据成功') : message.error('获取一级分类数据失败');
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  /**
   * 查询节点
   *
   */
  const queryCategory = async (values) => {
    console.log('values', values);
    dispatch({
      type: 'productAndproductCategory/queryCategory',
      payload: values,
    })
      .then(function (res) {
        console.log('res', res);
        // res ? message.success('获取数据成功') : message.error('获取数据失败');
        if (res) {
          //查询所有一级分类
          queryCateOne();
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  /**
   * 添加节点
   *
   * @param fields
   */
  const handleAdd = async (values) => {
    console.log('values', values);
    dispatch({
      type: 'productAndproductCategory/addCategory',
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
   * 删除节点
   *
   * @param id
   */

  const handleRemove = async (id) => {
    dispatch({
      type: 'productAndproductCategory/deleteCategory',
      payload: {
        id,
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

  /**
   * 更新分类
   *
   */
  const updateCategory = async (values) => {
    console.log('values', values);
    dispatch({
      type: 'productAndproductCategory/updateCategory',
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
   * 转移分类下商品
   *
   */
  const transfer = async (values) => {
    console.log('values', values);
    dispatch({
      type: 'productAndproductCategory/transfer',
      payload: values,
    })
      .then(function (res) {
        console.log('res', res);
        if (res) {
          message.success('转移成功');
          handleTransferModalVisible(false);
          setTransferFormValues({});

          if (actionRef.current) {
            actionRef.current.reload();
          }
        } else {
          message.error('转移失败');
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  /**
   * 导航栏显示或不显示
   *
   * @param Id
   */
  const handleNavStatus = async (Id, type, value) => {
    let ids = [];
    if (type === 'nav') {
      ids.push(Id);
    } else if (type === 'navBatch') {
      for (let i = 0; i < Id.length; i++) {
        ids.push(Id[i].id);
      }
    }

    dispatch({
      type: 'productAndproductCategory/updateNavStatus',
      payload: {
        ids,
        navStatus: value,
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
   * 显示或不显示
   *
   * @param Id
   */
  const handleShowStatus = async (Id, type, value) => {
    let ids = [];
    if (type === 'show') {
      ids.push(Id);
    } else if (type === 'showBatch') {
      for (let i = 0; i < Id.length; i++) {
        ids.push(Id[i].id);
      }
    }

    dispatch({
      type: 'productAndproductCategory/updateShowStatus',
      payload: {
        ids,
        publishStatus: value,
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
            <PlusOutlined /> 添加分类
          </Button>,
        ]}
        request={async (params) => {
          queryCategory({ ...params });
        }}
        dataSource={categoryList}
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
            type="primary"
            onClick={async () => {
              await handleShowStatus(selectedRowsState, 'showBatch', 1);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量显示
          </Button>
          <Button
            onClick={async () => {
              await handleShowStatus(selectedRowsState, 'showBatch', 0);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量不显示
          </Button>
          {/* <Button
            type="primary"
            onClick={async () => {
              await handleNavStatus(selectedRowsState, 'navBatch', 1);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量导航栏显示
          </Button>
          <Button
            onClick={async () => {
              await handleNavStatus(selectedRowsState, 'navBatch', 0);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量导航栏不显示
          </Button> */}
        </FooterToolbar>
      )}
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable
          onSubmit={async (value) => {
            handleAdd(value);
          }}
          rowKey="key"
          type="form"
          columns={dataColumns}
        />
      </CreateForm>
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={(value) => updateCategory(value)}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
          cateOneList={cateOneList}
        />
      ) : null}
      {transferFormValues && Object.keys(transferFormValues).length ? (
        <TransferForm
          onSubmit={(value) => transfer(value)}
          onCancel={() => {
            handleTransferModalVisible(false);
            setTransferFormValues({});
          }}
          modalVisible={transferModalVisible}
          values={transferFormValues}
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
    </PageContainer>
  );
};

export default connect(({ productAndproductCategory }) => ({
  productAndproductCategory,
}))(TableList);
