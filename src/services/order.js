import request from 'umi-request';
/**
 * 
 * @param {查询订单} params 
 */
export async function queryOrder(params) {
  console.log("service-order-queryOrder-params",params);
  return request('/api/order/list', {
    method: 'GET',
    params,
  });
}
/**
 * 
 * @param {查询待发货订单} params 
 */
export async function queryOrderWait(params) {
  console.log("service-order-queryOrderWait-params",params);
  return request('/api/order/list', {
    method: 'GET',
    params:{...params,status:1}
  });
}
/**
 * 
 * @param {查询已发货订单} params 
 */
export async function queryOrderDelivery(params) {
  console.log("service-order-queryOrderDelivery-params",params);
  return request('/api/order/listDelivery', {
    method: 'GET',
    params,
  });
}
/**
 * 
 * @param {查询订单单元} params 
 */
export async function getOrderItemList(params) {
  console.log("getOrderItemList-params",params);
  const {id} = params;
  return request(`/api/order/orderItemList/${id}`, {
    method: 'GET',
  });
}
/**
 * 
 * @param {订单发货} params 
 */
export async function delivery(params) {
  console.log("delivery-params",params);
  return request('/api/order/update/delivery', {
    method: 'POST',
    params,
  });
}
/**
 * 
 * @param {删除订单及其订单单元} params 
 */
export async function deleteOrder(params) {
  console.log("deleteOrder-params",params);
  return request('/api/order/delete', {
    method: 'POST',
    params,
  });
}
export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'delete' },
  });
}
export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}
export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}
export async function test(params) {
  return request('/api/ums_admin/test', {
    method: 'POST',
  });
}
