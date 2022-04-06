import React, { useEffect, useState } from 'react';
import { Form, Button, Input, Modal, Rate, Typography, message } from 'antd';
import { connect } from 'umi';
const { Title } = Typography;

const CommentForm = (props) => {
  const {
    modalVisible,
    onCancel,
    orderItem,
    dispatch,
    orderAndorderList: { comment },
  } = props;

  const [commentContent, setCommentContent] = useState({});
  const [status, setStatus] = useState(false); //是否已经请求过评论

  useEffect(async () => {
    if (!status) {
      const { id } = orderItem;
      await getComment({ id });
      setStatus(true);
    } else {
      setCommentContent(comment);
    }
  }, [comment]);

  /**
   *
   * @param {查询评论} id
   */
  const getComment = async ({ id }) => {
    console.log('id', id);
    dispatch({
      type: 'orderAndorderList/getComment',
      payload: {
        id,
      },
    })
      .then(function (res) {
        console.log('res', res);
        if (res) {
          console.log('-----查询评论成功-----');
        } else {
          console.log('-----查询评论失败-----');
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  return (
    <Modal
      destroyOnClose
      title="订单商品评价"
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={
        <Button type="primary" onClick={() => onCancel()}>
          取消
        </Button>
      }
    >
      {commentContent && Object.keys(commentContent).length ? (
        <Form
          name="commentForm"
          initialValues={{
            star: commentContent.star,
            content: commentContent.content,
          }}
        >
          <Form.Item label="名称">
            <Title level={5}>{orderItem.productName}</Title>
          </Form.Item>
          <Form.Item name="star" label="评分">
            <Rate value={commentContent.star} disabled />
          </Form.Item>
          <Form.Item name="content" label="评价">
            <Input.TextArea value={commentContent.content} disabled />
          </Form.Item>
        </Form>
      ) : null}
    </Modal>
  );
};

export default connect(({ orderAndorderList }) => ({
  orderAndorderList,
}))(CommentForm);
