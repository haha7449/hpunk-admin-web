import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Popover, Row, Select, Switch, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { connect } from 'umi';
import TableForm from './components/TableForm';
import styles from './style.less';
import AliyunOSSUpload from '../../../components/AliyunOssUpload';

const { Option } = Select;
const fieldLabels = {
  productCategoryName: '商品分类',
  name: '商品名称',
  subTitle: '副标题',
  brandName: '商品品牌',
  description: '商品介绍',
  productSn: '商品货号',
  price: '商品售价',
  stock: '商品库存',
  sort: '商品排序',
  publishStatus: '商品上架',
  note: '备注',
  pic: '商品图片',
};
const tableData = [];

const AdvancedForm = (props) => {
  const [form] = Form.useForm();
  const [error, setError] = useState([]);
  const {
    dispatch,
    submitting,
    productAndProductAdd: { cateOptions },
  } = props;

  //初始化品牌、分类
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'productAndProductAdd/queryCategory',
        payload: '',
      })
        .then(function (res) {
          console.log('res', res);
          if (res) {
            console.log('初始化分类成功');
          } else {
            console.log('初始化分类失败');
          }
        })
        .catch((error) => {
          console.log('error', error);
        });
    }
  }, [0]);

  const getErrorInfo = (errors) => {
    const errorCount = errors.filter((item) => item.errors.length > 0).length;

    if (!errors || errorCount === 0) {
      return null;
    }

    const scrollToField = (fieldKey) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);

      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };

    const errorList = errors.map((err) => {
      if (!err || err.errors.length === 0) {
        return null;
      }

      const key = err.name[0];
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <CloseCircleOutlined className={styles.errorIcon} />
          <div className={styles.errorMessage}>{err.errors[0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={(trigger) => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode;
            }

            return trigger;
          }}
        >
          <CloseCircleOutlined />
        </Popover>
        {errorCount}
      </span>
    );
  };

  const onFinish = (values) => {
    //是否上架
    if (values['publishStatus']) {
      values['publishStatus'] = 1;
    } else {
      values['publishStatus'] = 0;
    }
    //[分类名称，分类id]
    const { productCategoryName } = values;
    values.productCategoryId = productCategoryName[1];
    values.productCategoryName = productCategoryName[0];
    //商品图处理
    const { pic } = values;
    values.pic = pic[0].url;

    console.log('values', values);
    setError([]);

    dispatch({
      type: 'productAndProductAdd/submitForm',
      payload: values,
    })
      .then(function (res) {
        console.log('res', res);
        if (res) {
          message.success('新增成功');
          form.resetFields();
          //重新刷新
          if (actionRef.current) {
            actionRef.current.reload();
          }
        } else {
          message.error('新增失败');
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const onFinishFailed = (errorInfo) => {
    setError(errorInfo.errorFields);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        skus: tableData,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <PageContainer content="">
        <Card title="商品信息" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item
                label={fieldLabels.productCategoryName}
                name="productCategoryName"
                rules={[
                  {
                    required: true,
                    message: '请选择商品分类',
                  },
                ]}
              >
                <Select placeholder="test@example.com" showSearch>
                  {cateOptions.map((item) => (
                    <Option value={[item.name, item.id]} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col
              xl={{
                span: 6,
                offset: 2,
              }}
              lg={{
                span: 8,
              }}
              md={{
                span: 12,
              }}
              sm={24}
            >
              <Form.Item
                label={fieldLabels.name}
                name="name"
                rules={[
                  {
                    required: true,
                    message: '请输入商品名称',
                  },
                ]}
              >
                <Input.TextArea placeholder="商品名称" showCount maxLength={64} />
              </Form.Item>
            </Col>
            <Col
              xl={{
                span: 8,
                offset: 2,
              }}
              lg={{
                span: 10,
              }}
              md={{
                span: 24,
              }}
              sm={24}
            >
              <Form.Item
                label={fieldLabels.subTitle}
                name="subTitle"
                rules={[
                  {
                    required: true,
                    message: '请输入副标题',
                  },
                ]}
              >
                <Input.TextArea placeholder="请输入副标题" showCount maxLength={255} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item
                label={fieldLabels.publishStatus}
                name="publishStatus"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col
              xl={{
                span: 6,
                offset: 2,
              }}
              lg={{
                span: 8,
              }}
              md={{
                span: 12,
              }}
              sm={24}
            >
              <Form.Item
                label={fieldLabels.price}
                name="price"
                rules={[
                  {
                    required: true,
                    message: '请输入商品售价',
                  },
                  {
                    pattern: /^(\d+)((?:\.\d+)?)$/,
                    message: '请输入合法金额数字',
                  },
                ]}
              >
                <Input prefix="￥" placeholder="请输入金额" />
              </Form.Item>
            </Col>
            <Col
              xl={{
                span: 8,
                offset: 2,
              }}
              lg={{
                span: 10,
              }}
              md={{
                span: 24,
              }}
              sm={24}
            >
              <Form.Item
                label={fieldLabels.productSn}
                name="productSn"
                rules={[
                  {
                    required: true,
                    message: '请输入商品货号',
                  },
                ]}
              >
                <Input.TextArea placeholder="请输入商品货号" showCount maxLength={64} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item
                label={fieldLabels.pic}
                name="pic"
                rules={[
                  {
                    required: true,
                    message: '至少一张图片',
                  },
                ]}
              >
                <AliyunOSSUpload />
              </Form.Item>
            </Col>
            <Col
              xl={{
                span: 16,
                offset: 2,
              }}
              lg={{
                span: 10,
              }}
              md={{
                span: 24,
              }}
              sm={24}
            >
              <Form.Item
                label={fieldLabels.description}
                name="description"
                rules={[
                  {
                    required: true,
                    message: '请输入描述',
                  },
                ]}
              >
                <Input.TextArea showCount maxLength={1000} />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title="商品规格SKU" className={styles.card} bordered={false}>
          <Form.Item
            name="skuStockList"
            rules={[
              {
                required: true,
                message: '至少一个库存信息',
              },
            ]}
          >
            <TableForm />
          </Form.Item>
        </Card>
      </PageContainer>
      <FooterToolbar>
        {getErrorInfo(error)}
        <Button
          type="primary"
          onClick={() => form?.submit()}
          loading={submitting}
          style={{ width: 200 }}
        >
          提交
        </Button>
      </FooterToolbar>
    </Form>
  );
};

export default connect(({ productAndProductAdd, loading }) => ({
  productAndProductAdd,
  submitting: loading.effects['productAndProductAdd/submitForm'],
}))(AdvancedForm);
