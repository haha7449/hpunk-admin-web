import request from 'umi-request';
export async function queryCurrent() {
  return request('/api/currentUser');
}
export async function queryProvince() {
  return request('/api/geographic/province');
}
export async function queryCity(province) {
  return request(`/api/geographic/city/${province}`);
}
export async function query() {
  return request('/api/users');
}

/**
 * 
 * @param {更新密码} params 
 */
export async function updatePassword(params) {
  console.log("updatePassword-params",params);
  return request('/api/admin/updatePassword', {
    method: 'POST',
    data:params,
  });
}