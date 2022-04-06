import React, { useState } from 'react';
import { Form, Button, Input, Select, Drawer, Switch } from 'antd';
const { Option } = Select;
const formLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 15,
  },
};
const fieldLabels = {
  username: '账号',
  phone: '手机',
  nickname: '昵称',
  gender: '性别',
};

const UpdateForm = (props) => {
  console.log('props', props);
  const [formVals, setFormVals] = useState({
    username: props.values.username,
    phone: props.values.phone,
    nickname: props.values.nickname,
    gender: props.values.gender,
  });
  const [form] = Form.useForm();
  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
  } = props;

  const renderContent = () => {
    return (
      <>
        <Form.Item
          label={fieldLabels.username}
          name="username"
          rules={[
            {
              required: true,
              message: '请输入账号',
            },
          ]}
        >
          <Input placeholder="账号" disabled />
        </Form.Item>
        <Form.Item
          label={fieldLabels.phone}
          name="phone"
          rules={[
            {
              required: true,
              message: '请输入手机号',
            },
            {
              type: 'string',
              required: true,
              pattern: /^1[3-9]\d{9}$/,
              transform(value) {
                return value.trim();
              },
              message: '手机号格式不正确',
            },
          ]}
        >
          <Input placeholder="手机号" />
        </Form.Item>
        <Form.Item
          label={fieldLabels.nickname}
          name="nickname"
          rules={[
            {
              required: true,
              message: '请输入昵称',
            },
          ]}
        >
          <Input placeholder="昵称" />
        </Form.Item>
      </>
    );
  };

  const renderFooter = () => {
    return (
      <>
        <Button
          type="primary"
          onClick={async () => {
            const fieldsValue = await form.validateFields();
            console.log('fieldsValue', fieldsValue);
            handleUpdate({ ...fieldsValue, id: props.values.id });
          }}
          style={{ marginRight: 8 }}
        >
          更新
        </Button>
        <Button onClick={() => handleUpdateModalVisible(false)}>取消</Button>
      </>
    );
  };

  return (
    <Drawer
      width={640}
      bodyStyle={{
        padding: '32px 40px 48px',
      }}
      destroyOnClose
      title="用户信息"
      visible={updateModalVisible}
      footer={renderFooter()}
      onClose={() => handleUpdateModalVisible()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          username: formVals.username,
          phone: formVals.phone,
          nickname: formVals.nickname,
          gender: formVals.gender,
        }}
        layout="horizontal"
      >
        {renderContent()}
      </Form>
    </Drawer>
  );
};

export default UpdateForm;
