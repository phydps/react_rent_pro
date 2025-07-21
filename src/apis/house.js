import { request } from "@/utils/http";

//根据区域id查询房源数据
const getAreaHouseApi = (inputId) => {
  return request({
    url: "/area/map",
    method: "GET",
    params: {
      id: inputId,
    },
  });
};

//根据小区id查询小区房源数据
const getCommunityHousesApi = (inputId) => {
  return request({
    url: "/houses",
    method: "GET",
    params: {
      id: inputId,
    },
  });
};

export { getAreaHouseApi, getCommunityHousesApi };
