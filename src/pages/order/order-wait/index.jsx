import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Drawer, Modal } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import UpdateForm from './components/UpdateForm';
import { connect } from 'umi';

const TableList = (props) => {
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [viewModalVisible, handleViewModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [enable, setEnable] = useState(false); //是否能够展开订单
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const {
    dispatch,
    orderAndorderWait: { orderWaitList, orderItemList, pagination },
  } = props;
  const dataColumns = [
    {
      title: '订单编号',
      dataIndex: 'orderSn',
      valueType: 'textarea',
      copyable: true,
    },
    {
      title: '提交时间',
      dataIndex: 'createTime',
      valueType: 'date',
      width: 200,
      sorter: true,
    },
    {
      title: '用户账号',
      dataIndex: 'memberUsername',
      valueType: 'textarea',
      copyable: true,
    },
    {
      title: '订单金额',
      dataIndex: 'totalAmount',
      valueType: 'money',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Button
          type="primary"
          onClick={() => {
            //console.log("index-record",record);
            Modal.confirm({
              title: '订单发货',
              content: '确定发货吗？',
              okText: '确认',
              cancelText: '取消',
              onOk: () => delivery(record.id, 'delivery'),
            });
          }}
        >
          发货
        </Button>,
        <a
          onClick={() => {
            //console.log("index-record",record);
            Modal.confirm({
              title: '删除订单',
              content: '确定删除该订单吗？',
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

  useEffect(() => {
    setEnable(true);
    console.log('orderItemList', orderItemList);
  }, [orderItemList]);

  /**
   * 查询节点
   *
   */
  const queryOrderWait = async (values) => {
    console.log('values', values);
    dispatch({
      type: 'orderAndorderWait/queryOrderWait',
      payload: values,
    });
  };

  /**
   * 发货:
   *
   * @param id
   */
  const delivery = async (Id, type) => {
    let ids = [];
    if (type === 'delivery') {
      ids.push(Id);
    } else if (type === 'deliveryBatch') {
      for (let i = 0; i < Id.length; i++) {
        ids.push(Id[i].id);
      }
    }

    dispatch({
      type: 'orderAndorderWait/delivery',
      payload: {
        ids,
      },
    })
      .then(function (res) {
        console.log('res', res);
        if (res) {
          message.success('发货成功');
          //重新刷新
          if (actionRef.current) {
            actionRef.current.reload();
          }
        } else {
          message.error('发货失败');
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
      type: 'orderAndorderList/deleteOrder',
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
   *
   * @param {查询订单单元列表} id
   */
  const getOrderItemList = async ({ id }) => {
    console.log('id', id);
    dispatch({
      type: 'orderAndorderWait/getOrderItemList',
      payload: {
        id,
      },
    })
      .then(function (res) {
        console.log('res', res);
        if (res) {
          console.log('-----订单单元展示成功-----');
        } else {
          console.log('-----订单单元展示失败-----');
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  /**
   * 嵌套订单单元表格
   */
  const expandedRowRender = (values) => {
    console.log('values', values);
    const { status } = values;
    const orderItemColumns = [
      {
        title: '商品图',
        dataIndex: 'productPic',
        valueType: 'image',
        width: 70,
      },
      {
        title: '名称',
        dataIndex: 'productName',
        valueType: 'textarea',
        width: 250,
      },
      {
        title: '属性',
        dataIndex: 'productAttr',
        valueType: 'textarea',
      },
      {
        title: '单价',
        dataIndex: 'productPrice',
        valueType: 'money',
        width: 100,
      },
      {
        title: '数量',
        dataIndex: 'productQuantity',
        valueType: 'digit',
        width: 100,
      },
      {
        title: '金额',
        dataIndex: 'productTotalPrice',
        valueType: 'money',
        width: 100,
      },
    ];
    return (
      <ProTable
        columns={orderItemColumns}
        headerTitle={false}
        search={false}
        options={false}
        dataSource={orderItemList}
        pagination={false}
        rowKey="id"
      />
    );
  };

  /**
   *
   * @param {*} expanded
   * @param {*} record
   * 点击调用getOrderItemListByOid
   */
  const onExpand = async (expanded, record) => {
    if (expanded) {
      setEnable(true);
      console.log('record', record);
      const { id } = record;
      getOrderItemList({ id });
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
        toolBarRender={() => []}
        request={async (params) => queryOrderWait({ ...params })}
        dataSource={orderWaitList}
        columns={dataColumns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        pagination={pagination}
        expandable={{
          expandedRowRender: enable ? expandedRowRender : undefined,
          onExpand,
        }}
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
              await delivery(selectedRowsState, 'deliveryBatch');
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量发货
          </Button>
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState, 'removeBatch');
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
          onSubmit={async (value) => {
            // const success = await handleUpdate(value);
            // if (success) {
            //   handleUpdateModalVisible(false);
            //   setStepFormValues({});
            //   if (actionRef.current) {
            //     actionRef.current.reload();
            //   }
            // }
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

export default connect(({ orderAndorderWait }) => ({
  orderAndorderWait,
}))(TableList);
