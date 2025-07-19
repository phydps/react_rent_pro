import { Swiper, Grid } from "antd-mobile";
import { useEffect, useRef, useState } from "react";
import "./index.scss";
import {
  getHomeSwiperAPI,
  getGroupListsAPI,
  getInfoListAPI,
} from "@/apis/home";
import { REQUEST_URL } from "@/components/CONST";
import Nav1 from "@/assets/images/nav-1.png";
import Nav2 from "@/assets/images/nav-2.png";
import Nav3 from "@/assets/images/nav-3.png";
import Nav4 from "@/assets/images/nav-4.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// 导航菜单数据
const navs = [
  {
    id: 1,
    img: Nav1,
    title: "整租",
    path: "/list",
  },
  {
    id: 2,
    img: Nav2,
    title: "合租",
    path: "/list",
  },
  {
    id: 3,
    img: Nav3,
    title: "地图找房",
    path: "/map",
  },
  {
    id: 4,
    img: Nav4,
    title: "去出租",
    path: "/rent/add",
  },
];
// 获取地理位置信息
navigator.geolocation.getCurrentPosition((position) => {
  console.log("当前位置信息：", position);
});

const Home = () => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const [swiperImgs, setSwiperImgs] = useState([]);
  const [isSwiperLoaded, setIsSwiperLoaded] = useState(false);
  const [groups, setGroups] = useState([]);
  const [news, setNews] = useState([]);
  const [curCityName, setCurCityName] = useState("上海");
  useEffect(() => {
    //获取首页轮播图接口
    const getHomeSwiper = async () => {
      const res = await getHomeSwiperAPI();
      // console.dir(res);
      setSwiperImgs(res.body);
      setIsSwiperLoaded(true);
    };
    //获取租房小组
    const getGroupLists = async () => {
      const res = await getGroupListsAPI("AREA%7C88cff55c-aaa4-e2e0");
      setGroups(res.body);
    };
    // 获取最新资讯接口
    const getInfoList = async () => {
      const res = await getInfoListAPI("AREA%7C88cff55c-aaa4-e2e0");
      setNews(res.body);
    };

    getHomeSwiper();
    getGroupLists();
    getInfoList();

    //根据IP定位获取当前城市名
    var myCity = new window.BMap.LocalCity();
    myCity.get(async (res) => {
      const cityName = res.name;
      // console.log("当前城市名称", cityName);
      const result = await axios.get(
        `${REQUEST_URL}/area/info?name=${cityName}`
      );
      // console.log(result);
      setCurCityName(result.data.body.label);
    });
  }, []);
  return (
    <div className="homeSwiper">
      <div className="homeTop">
        <div className="topImageSwiper">
          {/* 轮播图数据加载完，再加载swiper */}
          {isSwiperLoaded && (
            <Swiper
              loop
              autoplay
              onIndexChange={(i) => {
                // console.log(i, "onIndexChange1");
              }}
            >
              {swiperImgs.map((item, index) => (
                <Swiper.Item key={item.id}>
                  <a
                    href="http://itcast.cn"
                    style={{
                      display: "inline-block",
                      width: "100%",
                      height: 212,
                    }}
                    key={item.id}
                  >
                    <img
                      src={`${REQUEST_URL}${item.imgSrc}`}
                      alt=""
                      style={{
                        width: "100%",
                        verticalAlign: "top",
                      }}
                    ></img>
                  </a>
                </Swiper.Item>
              ))}
            </Swiper>
          )}
          {/* 搜索框 */}
          <div className="search-box">
            <div className="search">
              {/* 位置 */}
              <div className="location" onClick={() => navigate("/citylist")}>
                <span className="name">{curCityName}</span>
                <i className="iconfont icon-arrow" />
              </div>

              {/* 搜索表单 */}
              <div className="form" onClick={() => navigate("/search")}>
                <i className="iconfont icon-seach" />
                <span className="text">请输入小区或地址</span>
              </div>
            </div>
            {/* 右侧地图图标 */}
            <i
              className="iconfont icon-map"
              onClick={() => navigate("/map")}
            />{" "}
          </div>
        </div>
      </div>
      {/* 导航菜单 */}
      <div className="menuNav">
        {navs.map((item) => (
          <div
            className="menuNavItem"
            key={item.id}
            onClick={() => navigate(item.path)}
          >
            <img src={item.img} alt=""></img>
            <div>{item.title}</div>
          </div>
        ))}
      </div>
      {/* 租房小组 */}
      <div className="group">
        <h3 className="group-title">
          租房小组 <span className="more">更多</span>
        </h3>

        {/* 宫格组件 */}
        <Grid columns={2}>
          {groups.map((item) => (
            <Grid.Item key={item.id}>
              {/* <div className="felxContainer"> */}
              <div className="desc">
                <p className="title">{item.title}</p>
                <span className="info">{item.desc}</span>
              </div>
              <img src={`${REQUEST_URL}${item.imgSrc}`} alt="" />
              {/* </div> */}
            </Grid.Item>
          ))}
        </Grid>
      </div>
      {/* 最新资讯 */}
      <div className="news">
        <h3 className="group-title">最新资讯</h3>
        {news.map((item) => (
          <div className="news-item" key={item.id}>
            <div className="imgwrap">
              <img
                className="img"
                src={`${REQUEST_URL}${item.imgSrc}`}
                alt=""
              />
            </div>
            {/* <Flex className="content" direction="column" justify="between">
              <h3 className="title">{item.title}</h3>
              <Flex className="info" justify="between">
                <span>{item.from}</span>
                <span>{item.date}</span>
              </Flex>
            </Flex> */}
            <div className="newsContent">
              <h3 className="title">{item.title}</h3>
              <div className="info">
                <span>{item.from}</span>
                <span>{item.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
