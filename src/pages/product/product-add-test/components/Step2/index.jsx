import React, { useState } from 'react';
import { Form, Button, message, Card } from 'antd';
import { connect } from 'umi';
import TableForm from './TableForm';
import styles from './index.less';
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

const Step2 = (props) => {
  const [form] = Form.useForm();
  const { data, dispatch, submitting } = props;

  if (!data) {
    return null;
  }

  const { validateFields, getFieldsValue } = form;

  const onPrev = () => {
    if (dispatch) {
      const values = getFieldsValue();
      dispatch({
        type: 'productAndProductAdd/saveStepFormData',
        payload: { ...data, ...values },
      });
      dispatch({
        type: 'productAndProductAdd/saveCurrentStep',
        payload: 'productInfo',
      });
    }
  };

  const onValidateForm = async () => {
    message.success('前面');
    const values = await validateFields();
    message.success('后面');

    if (dispatch) {
      dispatch({
        type: 'productAndProductAdd/saveStepFormData',
        payload: values,
      });
      dispatch({
        type: 'productAndProductAdd/saveCurrentStep',
        payload: 'productAttribute',
      });
    }
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      layout="horizontal"
      className={styles.stepForm}
      initialValues={data}
    >
      <Form.Item
        label=""
        name="productSku"
        rules={[
          {
            required: false,
            message: '请输入内容',
          },
        ]}
      >
        <TableForm style={{
          width: '100%',
        }}/>
      </Form.Item>
      <Form.Item
        style={{
          marginBottom: 8,
        }}
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
        <Button
          onClick={onPrev}
          style={{
            marginLeft: 8,
          }}
        >
          上一步
        </Button>
      </Form.Item>
    </Form>
  );
};

export default connect(({ productAndProductAdd, loading }) => ({
  submitting: loading.effects['productAndProductAdd/submitStepForm'],
  data: productAndProductAdd.step,
}))(Step2);
