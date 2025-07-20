import { request } from "@/utils/http";

//获取滚动图片列表
const getHomeSwiperAPI = () => {
  return request({
    url: "/home/swiper",
    method: "GET",
  });
};

// 获取租房小组信息
const getGroupListsAPI = (id) => {
  return request({
    url: "/home/groups",
    method: "GET",
    params: {
      area: id,
    },
  });
};

//获取资讯列表数据
const getInfoListAPI = (id) => {
  return request({
    url: "/home/news",
    method: "GET",
    params: {
      area: id,
    },
  });
};

//根据城市名称查询该城市信息
const getCurLocationApi = (cityName) => {
  return request({
    url: "/area/info",
    method: "GET",
    params: {
      name: cityName,
    },
  });
};

//获取城市列表
const getCityListApi = (levelInput) => {
  return request({
    url: "/area/city",
    method: "GET",
    params: {
      level: levelInput ? levelInput : 1,
      // level:获取哪一级的城市，1 表示获取所有城市数据 2 表示城市下区的数据
    },
  });
};

const getHotCityApi = () => {
  return request({
    url: "/area/hot",
    method: "GET",
  });
};

export {
  getHotCityApi,
  getCityListApi,
  getCurLocationApi,
  getHomeSwiperAPI,
  getGroupListsAPI,
  getInfoListAPI,
};
