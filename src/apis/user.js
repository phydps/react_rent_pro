import { request } from "@/utils/http";

//用户登录
const fetchUserLoginAPI = (params) => {
  return request({
    url: "/user/login",
    method: "POST",
    params: params,
  });
};

const getUserFavorite = (houseId) => {
  return request({
    url: `user/favorites/${houseId}`,
    method: "GET",
  });
};

export { fetchUserLoginAPI, getUserFavorite };
