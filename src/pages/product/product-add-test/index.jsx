import React, { useState, useEffect } from 'react';
import { CloseCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Form, Upload, Button, Card, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'umi';
import moment from 'moment';
import AliyunOSSUpload from "../../../components/AliyunOssUpload";

const StepForm = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    productAndProductAddTest: {},
  } = props;

  const onFinish = (values) => {
    console.log('values', values);
  };

  return (
    <PageContainer content="测试">
      <Card bordered={false}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="上传图片" name="pic">
            <AliyunOSSUpload />
          </Form.Item>
        </Form>
        <Button type="primary" onClick={() => form?.submit()}>
          上传
        </Button>
      </Card>
    </PageContainer>
  );
};

export default connect(({ productAndProductAddTest }) => ({
  productAndProductAddTest,
}))(StepForm);
