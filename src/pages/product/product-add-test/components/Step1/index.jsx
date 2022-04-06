import React, { useState, useEffect } from 'react';
import { Form, Button, Divider, Input, Select, InputNumber, message,Switch } from 'antd';
import { connect } from 'umi';
import styles from './index.less';
import { options } from 'numeral';
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

const Step1 = (props) => {
  const {
    dispatch,
    data,
    productAndProductAdd: { cateOptions, brandOptions },
  } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'productAndProductAdd/queryCategory',
        payload: '',
      });
      dispatch({
        type: 'productAndProductAdd/queryBrand',
        payload: '',
      });
    }
  }, [0]);

  if (!data) {
    return null;
  }

  const { validateFields } = form;

  const onValidateForm = async () => {
    const values = await validateFields();

    if (dispatch) {
      dispatch({
        type: 'productAndProductAdd/saveStepFormData',
        payload: values,
      });
      dispatch({
        type: 'productAndProductAdd/saveCurrentStep',
        payload: 'productPrice',
      });
    }
  };

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        layout="horizontal"
        className={styles.stepForm}
        initialValues={data}
      >
        <Form.Item
          label="商品分类"
          name="productCategory"
          rules={[
            {
              required: true,
              message: '请选择商品分类',
            },
          ]}
        >
          <Select placeholder="test@example.com">
            {cateOptions.map((item) => (
              <Option value={item.name}>{item.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="商品名称"
          name="productName"
          rules={[
            {
              required: true,
              message: '请输入商品名称',
            },
          ]}
        >
          <Input placeholder="商品名称" />
        </Form.Item>
        <Form.Item
          label="副标题"
          name="productSubTitle"
          rules={[
            {
              required: true,
              message: '请输入副标题',
            },
          ]}
        >
          <Input placeholder="请输入副标题" />
        </Form.Item>
        <Form.Item
          label="商品品牌"
          name="productBrand"
          rules={[
            {
              required: true,
              message: '请选择商品品牌',
            },
          ]}
        >
          <Select placeholder="test@example.com">
            {brandOptions.map((item) => (
              <Option value={item.name}>{item.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="商品介绍"
          name="productIntro"
          rules={[
            {
              required: false,
              message: '请输入内容',
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="商品货号"
          name="productSn"
          rules={[
            {
              required: true,
              message: '请输入商品货号',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="商品售价"
          name="productPrice"
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
        <Form.Item
          label="商品库存"
          name="productStock"
          rules={[
            {
              required: false,
              message: '请输入商品库存',
            },
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item
          label="商品排序"
          name="productSort"
          rules={[
            {
              required: false,
              message: '请输入商品排序',
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item name="productPublish" label="商品上架" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item
          label="商品备注"
          name="productNote"
          rules={[
            {
              required: false,
              message: '请输入内容',
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
          }}
        >
          <Button type="primary" onClick={onValidateForm}>
            下一步
          </Button>
        </Form.Item>
      </Form>
      <Divider
        style={{
          margin: '40px 0 24px',
        }}
      />
      <div className={styles.desc}>
        <h3>说明</h3>
        <h4>转账到支付宝账户</h4>
        <p>
          如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。
        </p>
        <h4>转账到银行卡</h4>
        <p>
          如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。
        </p>
      </div>
    </>
  );
};

export default connect(({ productAndProductAdd }) => ({
  productAndProductAdd,
  data: productAndProductAdd.step,
}))(Step1);
