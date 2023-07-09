import {IUserApi} from '../types/user';
import fetch from '../fetch';

// export const apiService = {
//   // Example GET request
//   async getUsers(): Promise<AxiosResponse<User[]>> {
//     return api.get('/users');
//   },
//   // Example POST request
//   async createUser(userData: User): Promise<AxiosResponse<User>> {
//     return api.post('/users', userData);
//   },
//   // Add more API methods as needed
// };
// export default apiService;

const UserApi: IUserApi = {
  // 登录
  login: (params) => {
    return fetch({
      method: 'post',
      url: '/login',
      data: params,
    })
  }
}

export default UserApi