import request from 'umi-request';
/**
 *
 * @param {查询分类} params
 */
export async function queryCategory(params) {
  console.log('queryCategory-params', params);
  return request('/api/productCategory/list', {
    method: 'GET',
    params,
  });
}
/**
 * 
 * @param {更新分类信息} params 
 */
export async function updateCategory(params) {
  console.log("service-product-updateCategory-params",params);
  const {id} = params;
  return request(`/api/productCategory/update/${id}`, {
    method: 'POST',
    data:params,
  });
}
/**
 * 
 * @param {更新分类导航栏显示状态} params 
 */
export async function updateNavStatus(params) {
  console.log("updateNavStatus-params",params);
  return request('/api/productCategory/update/navStatus', {
    method: 'POST',
    params,
  });
}
/**
 * 
 * @param {更新分类显示状态} params 
 */
export async function updateShowStatus(params) {
  console.log("updateShowStatus-params",params);
  return request('/api/productCategory/update/showStatus', {
    method: 'POST',
    params,
  });
}
/**
 *
 * @param {删除分类：不可批量删除，因为删除之前还需要转移商品} params
 */
export async function deleteCategory(params) {
  console.log('deleteCategory-params', params);
  const {id} =params;
  return request(`/api/productCategory/delete/${id}`, {
    method: 'GET',
  })
}
/**
 *
 * @param {增加分类} params
 */
export async function addCategory(params) {
  console.log('deleteCategory-params', params);
  return request('/api/productCategory/create', {
    method: 'POST',
    params,
  });
}
/**
 *
 * @param {获取所有一级分类} params
 */
export async function queryCateOne() {
  return request('/api/productCategory/listLevelOne', {
    method: 'GET',
  });
}

/**
 * 
 * @param {获取二级分类} params 
 */
export async function queryCateTwo() {
  return request('/api/productCategory/listAll', {
    method: 'GET',
  });
}

/**
 *
 * @param {转移分类下所有商品} params
 */
export async function transfer(params) {
  console.log('transfer-params', params);
  return request('/api/productCategory/transfer', {
    method: 'POST',
    params,
  });
}