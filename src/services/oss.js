import request from 'umi-request';

export function policy() {
  return request('/api/aliyun/oss/policy', {
    method: 'GET',
  });
}
