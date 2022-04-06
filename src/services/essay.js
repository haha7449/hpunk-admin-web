import request from 'umi-request';
/**
 * 
 * @param {查询文章列表} params 
 */
export async function queryEssay(params) {
  console.log("service-essay-queryEssay-params",params);
  return request('/api/essay/list', {
    method: 'GET',
    params,
  });
}
/**
 * 
 * @param {更新管理员} params 
 */
export async function updateDeleteStatus(params) {
  console.log("queryProduct-params",params);
  return request('/api/product/update/deleteStatus', {
    method: 'POST',
    params,
  });
}

/**
 *
 * @param {查询分类} params
 */
export async function queryCategory(params) {
    console.log('queryCategory-params', params);
    return request('/api/essayCategory/list', {
      method: 'GET',
      params,
    });
  }

/**
 * 
 * @param {查询菜单} params 
 */
export async function queryMenu(params) {
  console.log("service-auth-queryMenu-params",params);
  return request('/api/menu/list', {
    method: 'GET',
    params,
  });
}

/**
 * 
 * @param {查询资源} params 
 */
export async function queryResource(params) {
  console.log("service-auth-queryResource-params",params);
  return request('/api/resource/list', {
    method: 'GET',
    params,
  });
}

/**
 * 
 * @param {查询资源分类} params 
 */
export async function queryResourceCate(params) {
  console.log("service-auth-queryResourceCate-params",params);
  return request('/api/resourceCategory/listAll', {
    method: 'GET',
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
