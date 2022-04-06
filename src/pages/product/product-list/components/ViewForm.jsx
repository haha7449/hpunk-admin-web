import React, { useEffect, useState } from 'react';
import { Drawer, Descriptions, List, Comment, Image, Table, Typography,Space,Rate } from 'antd';
import { connect } from 'umi';
import moment from 'moment';

const ViewForm = (props) => {
  const {
    modalVisible,
    onCancel,
    values,
    dispatch,
    productAndproductList: { productItem },
  } = props;
  const { Text } = Typography;

  const [productInfo, setProductInfo] = useState({});
  const [status, setStatus] = useState(false); //是否已经请求过信息
  const [commentList,setCommentList] = useState([]);

  useEffect(async () => {
    if (!status) {
      const { id } = values;
      await queryProductById({ id });
      setStatus(true);
    } else {
      setProductInfo(productItem);
      setCommentList(productItem.commentList);
    }
  }, [productItem]);

  //评论数据
  let data = [];
  if (commentList && Object.keys(commentList).length) {
    data = commentList.map((item) => {
      return {
        author: (
          <Space>
            <Text>{item.memberNickName}</Text>
            <Text>[属性:{item.productAttribute}]</Text>
            <Rate disabled defaultValue={item.star} />
          </Space>
        ),
        avatar: `${item.memberIcon}`,
        content: <p>{item.content}</p>,
        actions: [<span>{moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>],
      };
    });
  }

  const columns = [
    {
      title: '商品属性',
      dataIndex: 'spData',
      key: 'spData',
      width: 250,
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '销量',
      dataIndex: 'sale',
      key: 'sale',
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'SKU编号',
      dataIndex: 'skuCode',
      key: 'skuCode',
    },
  ];

  /**
   * 查询某个商品
   */
  const queryProductById = async (values) => {
    console.log('values', values);
    // const {id} = values;
    // payload: {id},//这样每次传到后端id都是String 而不是Long
    dispatch({
      type: 'productAndproductList/queryProductById',
      payload: values,
    })
      .then(function (res) {
        console.log('res', res);
        res ? message.success('获取数据成功') : message.error('获取数据失败');
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  return (
    <Drawer width={640} placement="right" onClose={() => onCancel()} visible={modalVisible}>
      {productInfo && Object.keys(productInfo).length ? (
        <>
          <Descriptions title="商品信息" bordered>
            <Descriptions.Item label="名称" span={3}>
              {values.name}
            </Descriptions.Item>
            <Descriptions.Item label="图片" span={3}>
              <Image width={100} src={values.pic} />
            </Descriptions.Item>
            <Descriptions.Item label="货号">{values.productSn}</Descriptions.Item>
            <Descriptions.Item label="上架">
              {values.publishStatus ? '已上架' : '未上架'}
            </Descriptions.Item>
            <Descriptions.Item label="销量">{values.sale}</Descriptions.Item>
            <Descriptions.Item label="售价">{values.price}</Descriptions.Item>
            <Descriptions.Item label="分类">{values.productCategoryName}</Descriptions.Item>
            <Descriptions.Item label="库存">{values.stock}</Descriptions.Item>
            <Descriptions.Item label="描述" span={3}>
              {values.description}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions title="商品库存" style={{ marginTop: 20 }}>
            <Descriptions.Item span={3}>
              <Table
                bordered={true}
                columns={columns}
                dataSource={productInfo.skuStockList}
                pagination={false}
                style={{ width: '100%' }}
              />
            </Descriptions.Item>
          </Descriptions>
          <Descriptions title="商品评价" style={{ marginTop: 20 }} bordered>
            <Descriptions.Item span={3}>
              {data && Object.keys(data).length ? (
                <List
                  className="comment-list"
                  header={`累计评价${data.length}`}
                  itemLayout="horizontal"
                  dataSource={data}
                  renderItem={(item) => (
                    <li>
                      <Comment
                        actions={item.actions}
                        author={item.author}
                        avatar={item.avatar}
                        content={item.content}
                        datetime={item.datetime}
                      />
                    </li>
                  )}
                />
              ) : (
                '暂无评价'
              )}
            </Descriptions.Item>
          </Descriptions>
        </>
      ) : null}
    </Drawer>
  );
};

export default connect(({ productAndproductList }) => ({
  productAndproductList,
}))(ViewForm);
