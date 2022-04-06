import request from 'umi-request';
/**
 * 
 * @param {查询商品} params 
 */
export async function queryProduct(params) {
  console.log("service-product-queryProduct-params",params);
  return request('/api/product/list', {
    method: 'GET',
    params,
  });
}
/**
 * 
 * @param {查询商品ById} params 
 */
export async function queryProductById(params) {
  console.log("service-product-queryProductById-params",params);
  const {id} = params;
  return request(`/api/product/getProduct/${id}`, {
    method: 'GET',
  });
}
/**
 * 
 * @param {更新商品信息} params 
 */
export async function updateProduct(params) {
  console.log("service-product-updateProduct-params",params);
  const {id} = params;
  return request(`/api/product/updateProduct/${id}`, {
    method: 'POST',
    data:params,
  });
}
/**
 * 
 * @param {查询商品Sku库存} params 
 */
export async function querySku(params) {
  console.log("service-product-querySku-params",params);
  return request(`/api/sku/selectByPid/${params}`, {
    method: 'GET',
  });
}
/**
 * 
 * @param {更新商品Sku库存} params 
 */
export async function updateSku(params) {
  console.log("service-product-updateSku-params",params);
  const {pid} = params;
  const {skuStockList} = params
  return request(`/api/sku/update/${pid}`, {
    method: 'POST',
    data:skuStockList,
  });
}
/**
 * 
 * @param {更新商品删除状态} params 
 */
export async function updateDeleteStatus(params) {
  console.log("updateDeleteStatus-params",params);
  return request('/api/product/update/deleteStatus', {
    method: 'POST',
    params,
  });
}
/**
 * 
 * @param {更新商品上架状态} params 
 */
export async function updatePublishStatus(params) {
  console.log("updatePublishStatus-params",params);
  return request('/api/product/update/publishStatus', {
    method: 'POST',
    params,
  });
}
/**
 * 
 * @param {添加商品} params 
 */
export async function submitForm(params) {
  return request('/api/product/create', {
    method: 'POST',
    data: params,
  });
}
/**
 * 
 * @param {查询商品评价} params 
 */
export async function getComment(params) {
  console.log("getComment-params",params);
  const {id} = params;
  return request(`/api/comment/getComment/${id}`, {
    method: "GET",
  })
}
/**
 * 
 * @param {获取品牌} params 
 */
export async function queryBrand() {
  return request('/api/brand/listAll', {
    method: 'GET',
  });
}
