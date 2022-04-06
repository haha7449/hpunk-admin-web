import React, { useState } from 'react';
import {
  Form,
  Button,
  Input,
  Radio,
  Select,
  Drawer,
  Switch,
  InputNumber,
} from 'antd';
import AliyunOSSUpload from "../../../../components/AliyunOssUpload";

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

const UpdateForm = (props) => {
  console.log('UpdateForm-props', props);
  const [formVals, setFormVals] = useState({
    productCategoryName: [props.values.productCategoryName, props.values.productCategorId],
    name: props.values.name,
    subTitle: props.values.subTitle,
    price: props.values.price,
    stock: props.values.stock,
    productSn: props.values.productSn,
    publishStatus: props.values.publishStatus === 0 ? false : true,
    description: props.values.description,
    note: props.values.note,
    pic: {uid:'-1',status:'done',url:props.values.pic,thumbUrl:props.values.pic},
  });
  const [form] = Form.useForm();
  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
    cateList,
  } = props;

  const renderContent = () => {
    return (
      <>
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
          <Select placeholder="test@example.com">
            {cateList.map((item, index) => (
              <Option value={[item.text, index]} key={index}>
                {item.text}
              </Option>
            ))}
          </Select>
        </Form.Item>
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
          <Input placeholder="商品名称" />
        </Form.Item>
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
          <Input placeholder="请输入副标题" />
        </Form.Item>
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
        <Form.Item
          label={fieldLabels.stock}
          name="stock"
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
          label={fieldLabels.productSn}
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
        <Form.Item label={fieldLabels.publishStatus} name="publishStatus" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item
          label={fieldLabels.description}
          name="description"
          rules={[
            {
              required: true,
              message: '请输入内容',
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label={fieldLabels.note}
          name="note"
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
          label={fieldLabels.pic}
          name="pic"
          rules={[
            {
              required: false,
              message: '请输入内容',
            },
          ]}
        >
          <AliyunOSSUpload fileList={formVals.pic}/>
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
            if (fieldsValue['publishStatus']) {
              fieldsValue['publishStatus'] = 1;
            } else {
              fieldsValue['publishStatus'] = 0;
            }
            const { productCategoryName } = fieldsValue;
            fieldsValue.productCategoryId = productCategoryName[1];
            fieldsValue.productCategoryName = productCategoryName[0];

            const {pic} = fieldsValue;
            if(pic && Object.keys(pic).length > 0){
              fieldsValue.pic = pic[0].url;
            }
            

            console.log('new-fieldsValue', fieldsValue);
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
          productCategoryName: formVals.productCategoryName,
          name: formVals.name,
          subTitle: formVals.subTitle,
          price: formVals.price,
          stock: formVals.stock,
          productSn: formVals.productSn,
          publishStatus: formVals.publishStatus,
          description: formVals.description,
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
