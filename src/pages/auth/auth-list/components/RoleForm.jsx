import React, { useState } from 'react';
import { Form, Button, DatePicker, Input, Modal, Radio, Select, Steps, Typography } from 'antd';
const FormItem = Form.Item;

const options = [
  { label: '普通管理员', value: 0 },
  { label: '超级管理员', value: 1 },
  { label: '商品管理员', value: 2 },
  { label: '订单管理员', value: 3 },
];

const RoleForm = (props) => {
  const [formVals, setFormVals] = useState({
    role: props.values.role,
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
        <FormItem label="账号">{props.values.username}</FormItem>
        <FormItem name="role" label="角色类型" required>
          <Radio.Group optionType="button" buttonStyle="solid" options={options} />
        </FormItem>
      </>
    );
  };

  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
        <Button
          type="primary"
          onClick={async () => {
            const fieldsValue = await form.validateFields();
            console.log('fieldsValue', fieldsValue);
            handleUpdate({ ...fieldsValue, adminId: props.values.id });
          }}
        >
          提交
        </Button>
      </>
    );
  };

  return (
    <Modal
      width={640}
      bodyStyle={{
        padding: '32px 40px 48px',
      }}
      destroyOnClose
      title="分配权限"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}
    >
      <Form
        form={form}
        initialValues={{
          role: formVals.role,
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default RoleForm;
