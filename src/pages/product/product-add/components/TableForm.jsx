import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Popconfirm, Table, message, Upload, InputNumber } from 'antd';
import React, { useState } from 'react';
import styles from '../style.less';

const TableForm = ({ value, onChange }) => {
  const [clickedCancel, setClickedCancel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [cacheOriginData, setCacheOriginData] = useState({});
  const [data, setData] = useState(value);

  const getRowByKey = (key, newData) => (newData || data)?.filter((item) => item.key === key)[0];

  const toggleEditable = (e, key) => {
    e.preventDefault();
    const newData = data?.map((item) => ({ ...item }));
    const target = getRowByKey(key, newData);

    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        cacheOriginData[key] = { ...target };
        setCacheOriginData(cacheOriginData);
      }

      target.editable = !target.editable;
      setData(newData);
    }
  };

  const newSku = () => {
    const newData = data?.map((item) => ({ ...item })) || [];
    newData.push({
      key: `NEW_TEMP_ID_${index}`,
      spData: '',
      price: '',
      stock: '',
      skuCode: '',
      // pic: '',
      editable: true,
      isNew: true,
    });
    setIndex(index + 1);
    setData(newData);
  };

  const remove = (key) => {
    const newData = data?.filter((item) => item.key !== key);
    setData(newData);

    if (onChange) {
      onChange(newData);
    }
  };

  const handleFieldChange = (e, fieldName, key) => {
    const newData = [...data];
    const target = getRowByKey(key, newData);
    console.log('target', e.target);
    if (target) {
      target[fieldName] = e.target.value;
      setData(newData);
    }
  };

  //图片上传
  const handleChange = ({ file }) => {
    if (file.status === 'done') {
      message.success('上传成功');
      const result = file.response;
      console.log('result', result);
    } else {
      message.error('上传失败');
    }
  };

  const saveRow = (e, key) => {
    e.persist();
    setLoading(true);
    setTimeout(() => {
      if (clickedCancel) {
        setClickedCancel(false);
        return;
      }

      const target = getRowByKey(key) || {};

      if (!target.spData || !target.price || !target.stock || !target.skuCode) {
        message.error('请填写完整成员信息。');
        e.target.focus();
        setLoading(false);
        return;
      }

      delete target.isNew;
      toggleEditable(e, key);

      if (onChange) {
        onChange(data);
      }

      setLoading(false);
    }, 500);
  };

  const handleKeyPress = (e, key) => {
    if (e.key === 'Enter') {
      saveRow(e, key);
    }
  };

  const cancel = (e, key) => {
    setClickedCancel(true);
    e.preventDefault();
    const newData = [...data]; // 编辑前的原始数据

    let cacheData = [];
    cacheData = newData.map((item) => {
      if (item.key === key) {
        if (cacheOriginData[key]) {
          const originItem = { ...item, ...cacheOriginData[key], editable: false };
          delete cacheOriginData[key];
          setCacheOriginData(cacheOriginData);
          return originItem;
        }
      }

      return item;
    });
    setData(cacheData);
    setClickedCancel(false);
  };

  const columns = [
    {
      title: '商品属性',
      dataIndex: 'spData',
      key: 'spData',
      width: '25%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input.TextArea
              value={text}
              autoFocus
              onChange={(e) => handleFieldChange(e, 'spData', record.key)}
              onKeyPress={(e) => handleKeyPress(e, record.key)}
              placeholder="商品属性"
              showCount
              maxLength={255}
            />
          );
        }

        return text;
      },
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: '15%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              prefix="￥"
              value={text}
              onChange={(e) => handleFieldChange(e, 'price', record.key)}
              onKeyPress={(e) => handleKeyPress(e, record.key)}
              placeholder="价格"
            />
          );
        }

        return text;
      },
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      width: '10%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={(e) => handleFieldChange(e, 'stock', record.key)}
              onKeyPress={(e) => handleKeyPress(e, record.key)}
              placeholder="库存"
            />
          );
        }

        return text;
      },
    },
    {
      title: 'SKU编号',
      dataIndex: 'skuCode',
      key: 'skuCode',
      width: '20%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={(e) => handleFieldChange(e, 'skuCode', record.key)}
              onKeyPress={(e) => handleKeyPress(e, record.key)}
              placeholder="SKU编号"
            />
          );
        }

        return text;
      },
    },
    // {
    //   title: '上传图片',
    //   dataIndex: 'pic',
    //   key: 'pic',
    //   width: '15%',
    //   render: (text, record) => {
    //     if (record.editable) {
    //       return (
    //         <Upload
    //           action="/pic/upload"
    //           listType="picture"
    //           maxCount={1}
    //           onChange={handleChange}
    //         >
    //           <Button icon={<UploadOutlined />} />
    //         </Upload>
    //       );
    //     }

    //     return text;
    //   },
    // },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        if (!!record.editable && loading) {
          return null;
        }

        if (record.editable) {
          if (record.isNew) {
            return (
              <span>
                <a onClick={(e) => saveRow(e, record.key)}>添加</a>
                <Divider type="vertical" />
                <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
                  <a>删除</a>
                </Popconfirm>
              </span>
            );
          }

          return (
            <span>
              <a onClick={(e) => saveRow(e, record.key)}>保存</a>
              <Divider type="vertical" />
              <a onClick={(e) => cancel(e, record.key)}>取消</a>
            </span>
          );
        }

        return (
          <span>
            <a onClick={(e) => toggleEditable(e, record.key)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];
  return (
    <>
      <Table
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={false}
        rowClassName={(record) => (record.editable ? styles.editable : '')}
      />
      <Button
        style={{
          width: '100%',
          marginTop: 16,
          marginBottom: 8,
        }}
        type="dashed"
        onClick={newSku}
      >
        <PlusOutlined />
        新增SKU
      </Button>
    </>
  );
};

export default TableForm;
