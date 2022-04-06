import React, { useState } from 'react';
import { Form, Button, Input, Drawer } from 'antd';
const formLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 15,
  },
};
const fieldLabels = {
  username: '管理员账号',
  email: '邮箱',
  note: '备注',
  password:'密码',
};

const UpdateForm = (props) => {
  console.log('UpdateForm-props', props);
  const [formVals, setFormVals] = useState({
    username: props.values.username,
    email: props.values.email,
    note: props.values.note,
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
        <Form.Item label={fieldLabels.username} name="username">
          <Input placeholder="账号" disabled />
        </Form.Item>
        <Form.Item
          label={fieldLabels.email}
          name="email"
          rules={[
            {
              required: true,
              message: '请输入邮箱',
            },
          ]}
        >
          <Input placeholder="邮箱" />
        </Form.Item>
        <Form.Item
          label={fieldLabels.note}
          name="note"
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item label={fieldLabels.password} name="password">
          <Input.Password placeholder="谨慎修改！" />
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
        <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
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
      title="管理员信息"
      visible={updateModalVisible}
      footer={renderFooter()}
      onClose={() => handleUpdateModalVisible()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          username: formVals.username,
          email: formVals.email,
          note: formVals.note,
        }}
        layout="horizontal"
      >
        {renderContent()}
      </Form>
    </Drawer>
  );
};

export default UpdateForm;
