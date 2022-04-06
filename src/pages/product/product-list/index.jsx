import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { Button, message, Drawer, Modal, Tag, Space } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import ViewForm from '././components/ViewForm';
import UpdateForm from './components/UpdateForm';
import SkuForm from './components/SkuForm';
import { useHistory } from 'react-router';
import { connect } from 'umi';

const TableList = (props) => {
  const [skuModalVisible, handleSkuModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [viewModalVisible, handleViewModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [productItemValues, setProductItemValues] = useState({});
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const history = useHistory();
  const {
    loading,
    dispatch,
    productAndproductList: { productList, cateList, pagination, skuInit },
  } = props;

  const dataColumns = [
    {
      title: '图片',
      dataIndex: 'pic',
      valueType: 'image',
      hideInSearch: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'textarea',
      width: 200,
      sorter: true,
      copyable: true,
    },
    {
      title: '价格',
      dataIndex: 'price',
      valueType: 'money',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '货号',
      dataIndex: 'productSn',
      valueType: 'textarea',
    },
    {
      title: '分类',
      dataIndex: 'productCategoryId',
      valueEnum: cateList,
      hideInTable: true,
    },
    {
      title: '分类名称',
      dataIndex: 'productCategoryName',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '上架状态',
      dataIndex: 'publishStatus',
      valueType: 'select',
      valueEnum: {
        0: {
          text: '未上架',
        },
        1: {
          text: '已上架',
        },
      },
      render: (_, record) => {
        let color = '';
        let name = '';
        if (record.publishStatus === 0) {
          color = 'red';
          name = '未上架';
        } else {
          color = 'green';
          name = '已上架';
        }
        return (
          <Space>
            <Tag color={color} key={record.id} value={record.publishStatus}>
              {name}
            </Tag>
          </Space>
        );
      },
    },
    {
      title: '销量',
      dataIndex: 'sale',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      valueType: 'option',
      width: 48,
      render: (_, record) => [
        <Button type="primary" shape="circle" onClick={() => querySku(record)}>
          <EditOutlined />
        </Button>,
      ],
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 150,
      render: (_, record) => [
        <a
          onClick={() => {
            setProductItemValues(record);
            handleViewModalVisible(true);
          }}
        >
          查看
        </a>,
        <a
          onClick={() => {
            console.log('record', record);
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
   */
  const queryProduct = async (values) => {
    console.log('values', values);
    dispatch({
      type: 'productAndproductList/queryProduct',
      payload: values,
    })
      .then(function (res) {
        console.log('res', res);
        // res ? message.success('获取数据成功') : message.error('获取数据失败');
        if (res) {
          queryCategory();
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  /**
   * 更新商品
   *
   */
  const updateProduct = async (values) => {
    console.log('values', values);
    dispatch({
      type: 'productAndproductList/updateProduct',
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
   * 查询分类
   *
   */
  const queryCategory = async () => {
    dispatch({
      type: 'productAndproductList/queryCategory',
      payload: {},
    })
      .then(function (res) {
        console.log('res', res);
        // res ? message.success('获取分类数据成功') : message.error('获取分类数据失败');
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  /**
   * 查询节点Sku库存
   *
   */
  const querySku = async (values) => {
    console.log('values', values);
    const { id } = values;
    const res = await dispatch({
      type: 'productAndproductList/querySku',
      payload: id,
    });
    console.log('querySku-res', res);
    console.log('querySku-skuInit', skuInit);
    if (res) {
      handleSkuModalVisible(true);
      // setSkuInitValues(skuInit);
    }
  };

  /**
   * 清空model里面存的skuInit
   *
   */
  const clearSku = async (values) => {
    dispatch({
      type: 'productAndproductList/clearSku',
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
      type: 'productAndproductList/updateDeleteStatus',
      payload: {
        ids,
        deleteStatus: 1,
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
   * 上架:
   *
   * @param id
   */
  const handlePublish = async (publishId, type) => {
    let ids = [];
    if (type === 'publish') {
      ids.push(publishId);
    } else if (type === 'publishBatch') {
      for (let i = 0; i < publishId.length; i++) {
        ids.push(publishId[i].id);
      }
    }

    dispatch({
      type: 'productAndproductList/updatePublishStatus',
      payload: {
        ids,
        publishStatus: 1,
      },
    })
      .then(function (res) {
        console.log('res', res);
        if (res) {
          message.success('上架成功');
          //重新刷新
          if (actionRef.current) {
            actionRef.current.reload();
          }
        } else {
          message.error('上架失败');
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
          <Button type="primary" onClick={() => history.push(`/product/product-add`)}>
            <PlusOutlined /> 添加商品
          </Button>,
        ]}
        request={async (params) => queryProduct({ ...params })}
        dataSource={productList}
        columns={dataColumns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        pagination={pagination}
        loading={loading}
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
          <Button
            type="primary"
            onClick={async () => {
              await handlePublish(selectedRowsState, 'publishBatch');
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量上架
          </Button>
        </FooterToolbar>
      )}
      {productItemValues && Object.keys(productItemValues).length ? (
        <ViewForm
          onCancel={() => {
            handleViewModalVisible(false);
            setProductItemValues({});
          }}
          modalVisible={viewModalVisible}
          values={productItemValues}
        />
      ) : null}
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={(value) => updateProduct(value)}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
          cateList={cateList}
        />
      ) : null}
      {skuInit.skuStockList && Object.keys(skuInit.skuStockList).length ? (
        <SkuForm
          onCancel={() => {
            handleSkuModalVisible(false);
            clearSku();
          }}
          modalVisible={skuModalVisible}
          skuInit={skuInit}
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

export default connect(({ productAndproductList, loading }) => ({
  productAndproductList,
  loading: loading.models.productAndproductList,
}))(TableList);
