import React,{useEffect} from 'react';
import { Modal, Form, Typography,Select,Button } from 'antd';
import { connect } from 'umi';

const { Title } = Typography;
const {Option} = Select;

const TransferForm = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onCancel,onSubmit } = props;
  const {
    dispatch,
    productAndproductCategory: { cateTwoList },
  } = props;

  //初始化二级分类
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'productAndproductCategory/queryCateTwo',
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

  const renderFooter = () => {
    return (
      <>
        <Button
          type="primary"
          onClick={async () => {
            const fieldsValue = await form.validateFields();

            console.log('fieldsValue', fieldsValue);
            onSubmit({ ...fieldsValue, fromId: props.values.id });
          }}
          style={{ marginRight: 8 }}
        >
          转移
        </Button>
        <Button onClick={() => onCancel()}>取消</Button>
      </>
    );
  };

  return (
    <Modal
      destroyOnClose
      title="转移商品"
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={renderFooter()}
      hideRequiredMark
    >
      {cateTwoList && Object.keys(cateTwoList).length ? (
        <Form form={form} layout="horizontal">
          <Form.Item label="分类名称">
            <Title level={5}>{props.values.name}</Title>
          </Form.Item>
          <Form.Item
            label="转移至"
            name="toId"
            rules={[
              {
                required: true,
                message: '请选择转移到的分类',
              },
            ]}
          >
            <Select placeholder="二级分类" allowClear>
              {cateTwoList.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      ) : null}
    </Modal>
  );
};

export default connect(({ productAndproductCategory }) => ({
  productAndproductCategory,
}))(TransferForm);