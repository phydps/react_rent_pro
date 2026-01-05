import { useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import { useParams } from "react-router-dom";
import { getHouseDetailApi } from "@/apis/house";
import { getUserFavorite } from "@/apis/user";
import { hasToken } from "@/utils/util";
import NavHeader from "@/components/NavHeader";
import { Carousel, Flex, Modal, Toast, Swiper } from "antd-mobile";
import { REQUEST_URL } from "@/components/CONST";
import { render } from "@testing-library/react";
import classnames from "classnames";
import HousePackage from "@/components/HousePackage";
import HouseItem from "@/components/HouseItem";

// 猜你喜欢
const recommendHouses = [
  {
    id: 1,
    houseImg: "/img/news/1.png",
    desc: "72.32㎡/南 北/低楼层",
    title: "安贞西里 3室1厅",
    price: 4500,
    tags: ["随时看房"],
  },
  {
    id: 2,
    houseImg: "/img/news/2.png",
    desc: "83㎡/南/高楼层",
    title: "天居园 2室1厅",
    price: 7200,
    tags: ["近地铁"],
  },
  {
    id: 3,
    houseImg: "/img/news/3.png",
    desc: "52㎡/西南/低楼层",
    title: "角门甲4号院 1室1厅",
    price: 4300,
    tags: ["集中供暖"],
  },
];

const HouseDetail = () => {
  const [houseInfo, setHouseInfo] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  let { id } = useParams();
  const mapRef = useRef(null);

  useEffect(() => {
    const getHouseDetail = async () => {
      try {
        getHouseDetailApi(id).then((res) => {
          if (200 == res.status) {
            setHouseInfo(res.body);
          }
          console.log("房屋id", res.body);
          const { community, coord } = res.body;
          renderMap(community, coord);
        });
      } catch (error) {
      } finally {
      }
    };

    // 发送请求判断是否收藏
    if (hasToken()) {
      checkLove(id);
    }
    getHouseDetail();
  }, []);

  const checkLove = () => {
    getUserFavorite(id);
  };

  // 渲染标签tags
  const renderTags = (tags) => {
    return tags.map((item, index) => {
      // 如果标签数量超过3个，后面的标签就都展示位第三个标签的样式
      let tagClass = "";
      if (index > 2) {
        tagClass = "tag3";
      } else {
        tagClass = "tag" + (index + 1);
      }

      return (
        <span key={`${item}_${index}`} className={classnames("tag", tagClass)}>
          {item}
        </span>
      );
    });
  };

  const BMap = window.BMap;
  // 渲染地图
  function renderMap(community, coord) {
    const { latitude, longitude } = coord;

    const map = new BMap.Map(mapRef.current);
    const point = new BMap.Point(longitude, latitude);
    map.centerAndZoom(point, 17);

    const label = new BMap.Label(
      `<span>${community}</span>
      <div class="mapArrow"></div>`,
      {
        position: point,
        offset: new BMap.Size(0, -36),
      }
    );

    label.setStyle({
      position: "absolute",
      zIndex: -7982820,
      backgroundColor: "rgb(238, 93, 91)",
      color: "rgb(255, 255, 255)",
      height: 25,
      padding: "5px 10px",
      lineHeight: "14px",
      borderRadius: 3,
      boxShadow: "rgb(204, 204, 204) 2px 2px 2px",
      whiteSpace: "nowrap",
      fontSize: 12,
      userSelect: "none",
    });
    map.addOverlay(label);
  }

  function handleFavorite() {}
  return (
    <div className={styles.detail}>
      {/* <NavHeader>{houseInfo.community}</NavHeader> */}
      {houseInfo && <NavHeader>{houseInfo.community}</NavHeader>}

      {/* 轮播图 */}
      <div className="slides">
        {houseInfo && (
          <Swiper
            loop
            autoplay
            onIndexChange={(i) => {
              console.log(i, "onIndexChange1");
            }}
          >
            {houseInfo.houseImg.map((item, index) => (
              <Swiper.Item key={`${item}_${index}`}>
                <a href="http://www.alipay.com" key={item}>
                  <img src={`${REQUEST_URL}${item}`} alt="" />
                </a>
              </Swiper.Item>
            ))}
          </Swiper>
        )}
      </div>

      {/* 房屋基础信息 */}
      <div className="info">
        {houseInfo && <h3 className="infoTitle">{houseInfo.title}</h3>}
        <div className="tags">{houseInfo && renderTags(houseInfo.tags)}</div>
        <div className="infoPrice">
          <div className="infoPriceItem">
            <div>
              {houseInfo && houseInfo.price}
              <span className="month">/月</span>
            </div>
            <div>租金</div>
          </div>
          <div className="infoPriceItem">
            <div> {houseInfo && houseInfo.roomType}</div>
            <div>房型</div>
          </div>
          <div className="infoPriceItem">
            <div>
              {houseInfo && houseInfo.size}
              平米
            </div>
            <div>面积</div>
          </div>
        </div>
        <div className="infoBasic">
          <div className="infoBasicItem">
            <div>
              <span className="title">装修：</span>
              精装
            </div>
            <div>
              <span className="title">楼层：</span>
              {houseInfo && houseInfo.floor}
            </div>
          </div>
          <div className="infoBasicItem">
            <div>
              <span className="title">朝向：</span>
              {houseInfo && houseInfo.oriented.join("、")}
            </div>
            <div>
              <span className="title">类型：</span>普通住宅
            </div>
          </div>
        </div>
      </div>

      {/* 渲染百度地图 */}
      <div className="house_map">
        <div className="mapTitle">
          小区：
          <span>{houseInfo && houseInfo.community}</span>
        </div>
        <div ref={mapRef} className="mapContainer" id="map">
          地图
        </div>
      </div>

      {/* 房屋配套 */}
      <div className="about">
        <div className="houseTitle">房屋配套</div>
        {houseInfo ? (
          houseInfo.supporting.length == 0 ? (
            <div className="titleEmpty">暂无数据</div>
          ) : (
            <HousePackage list={houseInfo.supporting} />
          )
        ) : null}
      </div>

      {/* 房屋概况 */}
      <div className="set">
        <div className="houseTitle">房源概况</div>
        <div>
          <div className="contact">
            <div className="user">
              <img src={`${REQUEST_URL}/img/avatar.png`} alt="头像" />
              <div className="useInfo">
                <div>王女士</div>
                <div className="userAuth">
                  <i className="iconfont icon-auth" />
                  已认证房主
                </div>
              </div>
            </div>
            <span className="userMsg">发消息</span>
          </div>

          {houseInfo && (
            <div className="descText">
              {houseInfo.description || "暂无房屋描述"}
            </div>
          )}
        </div>
      </div>

      {/* 猜你喜欢 */}
      <div className="recommend">
        <div className="houseTitle">猜你喜欢</div>
        <div className="items">
          {recommendHouses.map((item) => (
            <HouseItem item={item} key={item.id} />
          ))}
        </div>
      </div>

      {/* 底部收藏按钮 */}
      <div className="fixedBottom">
        <div onClick={handleFavorite}>
          <img
            src={
              REQUEST_URL + (isFavorite ? "/img/star.png" : "/img/unstar.png")
            }
            className="favoriteImg"
            alt="收藏"
          />
          <span className="favorite">{isFavorite ? "已收藏" : "收藏"}</span>
        </div>
        <div>在线咨询</div>
        <div>
          <a href="tel:400-618-4000" className="telephone">
            电话预约
          </a>
        </div>
      </div>
    </div>
  );
};

export default HouseDetail;
