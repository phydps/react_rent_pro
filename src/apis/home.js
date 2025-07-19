import { request } from "@/utils/http";
import { HttpStatusCode } from "axios";

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

export { getHomeSwiperAPI, getGroupListsAPI, getInfoListAPI };
