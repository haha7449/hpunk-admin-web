import request from 'umi-request';
/**
 * 
 * @param {查询用户} params 
 */
export async function queryMember(params) {
  console.log("service-auth-queryAdmin-params",params);
  return request('/api/ums_member/list', {
    method: 'GET',
    params,
  });
}
/**
 * 
 * @param {更新用户状态} params 
 */
export async function updateStatus(params) {
  console.log("updateStatus-params",params);
  return request('/api/ums_member/update/status', {
    method: 'POST',
    params,
  });
}

/**
 * @param {删除用户} params 
 */
export async function deleteMember(params) {
  console.log("deleteMember-params",params);
  return request('/api/ums_member/deleteMember', {
    method: 'POST',
    params,
  });
}

/**
 * 
 * @param {更新用户信息} params 
 */
export async function updateMemberInfo(params) {
  console.log("updateMemberInfo-params",params);
  return request('/api/ums_member/updateInfo', {
    method: 'POST',
    data:params,
  });
}
