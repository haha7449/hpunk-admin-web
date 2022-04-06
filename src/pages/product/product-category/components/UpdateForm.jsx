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
  name: '分类名称',
  parentId: '上级分类',
  level: '级别',
  productCount: '商品数量',
  navStatus: '导航栏显示',
  showStatus: '显示',
  description: '分类介绍',
};

const UpdateForm = (props) => {
  console.log('props', props);
  const [formVals, setFormVals] = useState({
    name: props.values.name,
    parentId: props.values.parentId,
    level: props.values.level === 0 ? '一级' : '二级',
    productCount: props.values.productCount,
    // navStatus: props.values.navStatus === 0 ? false : true,
    showStatus: props.values.showStatus === 0 ? false : true,
    description: props.values.description,
  });
  const [form] = Form.useForm();
  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
    cateOneList,
  } = props;

  const renderContent = () => {
    return (
      <>
        <Form.Item
          label={fieldLabels.name}
          name="name"
          rules={[
            {
              required: true,
              message: '请输入分类名称',
            },
          ]}
        >
          <Input placeholder="分类名称" />
        </Form.Item>
        <Form.Item
          label={fieldLabels.parentId}
          name="parentId"
          rules={[
            {
              required: false,
              message: '请选择上级分类',
            },
          ]}
        >
          <Select placeholder="上级分类" allowClear disabled={props.values.parentId?false:true}>
            {cateOneList.map((item, index) => (
              <Option value={index} key={index} disabled={index?false:true}>
                {item.text}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label={fieldLabels.level} name="level">
          <Input placeholder="-" disabled />
        </Form.Item>
        <Form.Item label={fieldLabels.productCount} name="productCount">
          <Input placeholder="商品数量" disabled />
        </Form.Item>
        {/* <Form.Item label={fieldLabels.navStatus} name="navStatus" valuePropName="checked">
          <Switch />
        </Form.Item> */}
        <Form.Item label={fieldLabels.showStatus} name="showStatus" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item
          label={fieldLabels.description}
          name="description"
          rules={[
            {
              required: false,
              message: '请输入内容',
            },
          ]}
        >
          <Input.TextArea />
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
            // if (fieldsValue['navStatus']) {
            //   fieldsValue['navStatus'] = 1;
            // } else {
            //   fieldsValue['navStatus'] = 0;
            // }
            if (fieldsValue['showStatus']) {
              fieldsValue['showStatus'] = 1;
            } else {
              fieldsValue['showStatus'] = 0;
            }
            fieldsValue['level'] = props.values.level;
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
      title="商品信息"
      visible={updateModalVisible}
      footer={renderFooter()}
      onClose={() => handleUpdateModalVisible()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          name: formVals.name,
          parentId: formVals.parentId,
          level: formVals.level,
          productCount: formVals.productCount,
          // navStatus: formVals.navStatus,
          showStatus: formVals.showStatus,
          description: formVals.description,
        }}
        layout="horizontal"
      >
        {renderContent()}
      </Form>
    </Drawer>
  );
};

export default UpdateForm;
