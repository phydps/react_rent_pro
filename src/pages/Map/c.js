import { useEffect, useState } from "react";
import "./index.scss";
import NavHeader from "@/components/NavHeader";
import { getAreaHouseApi } from "@/apis/house";
import styles from "./index.module.css";

const BMap = window.BMap;
// 覆盖物样式
const labelStyle = {
  cursor: "pointer",
  border: "0px solid rgb(255, 0, 0)",
  padding: "0px",
  whiteSpace: "nowrap",
  fontSize: "12px",
  color: "rgb(255, 255, 255)",
  textAlign: "center",
};
const Map = () => {
  const [map, setMap] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    initMap();
  }, []);

  //初始化地图
  const initMap = () => {
    // 获取当前定位城市
    const { label, value } = JSON.parse(localStorage.getItem("current_city"));
    // console.log("城市数据", label, value);

    //初始化地图实例
    const map = new BMap.Map("container");
    setMap(map);
    console.log("map数据", map);

    // 创建地址解析实例
    const myGeo = new BMap.Geocoder();
    myGeo.getPoint(
      label,
      async (point) => {
        if (point) {
          //初始化地图
          map.centerAndZoom(point, 11);

          //添加比例尺、缩放控件
          map.addControl(new BMap.NavigationControl());
          map.addControl(new BMap.ScaleControl());
          console.log("map数据----", map);

          renderOverlays(value);
          // //获取房源数据
          // const res = await getAreaHouseApi(value);
          // console.log("城市数据", res);

          // res.body.forEach((item) => {
          //   const {
          //     count,
          //     label: areaName,
          //     value,
          //     coord: { latitude, longitude },
          //   } = item;

          //   const areapoint = new BMap.Point(longitude, latitude);
          //   const options = {
          //     position: areapoint,
          //     offset: new BMap.Size(-35, -35),
          //   };
          //   //为每条数据创建覆盖物
          //   const label = new BMap.Label("", options);

          //   // 给label对象添加唯一标识
          //   label.id = value;

          //   //设置房源覆盖物样式
          //   label.setContent(`
          //   <div class="${styles.bubble}">
          //     <p class="${styles.name}">${areaName}</p>
          //     <p>${count}套</p>
          //   </div>
          //   `);
          //   // 设置样式
          //   label.setStyle(labelStyle);

          //   //添加点击事件
          //   label.addEventListener("click", () => {
          //     console.log("房源覆盖物被点击了", label.id);
          //     map.centerAndZoom(areapoint, 13);

          //     //清除覆盖物
          //     setTimeout(() => {
          //       map.clearOverlays();
          //     }, 0);
          //   });

          //   //添加覆盖物到地图中
          //   map.addOverlay(label);
          // });
        }
      },
      label
    );
  };

  // 解决map空值

  /*渲染覆盖物入口
  1.接收区域id参数，获取该区域下的房源数据
  2.获取房源类型以及下级地图缩放比例
  */
  const renderOverlays = (value) => {
    console.log("renderOverlays里面的map数据----", map, value);
  };
  const renderOverlays2 = async (id) => {
    console.log("renderOverlays里面的map数据----", map);

    //获取房源数据
    const res = await getAreaHouseApi(id);
    console.log("城市数据", res);

    res.body.forEach((element) => {
      createOverlays(element);
    });
  };

  useEffect(() => {}, []);

  //创建覆盖物
  const createOverlays = () => {
    getTypeAndZoom();
  };

  //计算要绘制的覆盖物的类型和下一级缩放级别
  // 区：缩放级别 -》11 范围>=10||<12
  // 镇：缩放级别 -》13 范围>=12||<14
  // 小区：缩放级别 -》15 范围>=14||<16
  const getTypeAndZoom = () => {
    //获取当前地图对象的缩放级别
    console.log("当前缩放级别里面的map", map);

    const zoom = map.getZoom();
    console.log("当前缩放级别", zoom);
  };

  return (
    <div className={styles.map}>
      {/* 导航栏 */}
      <NavHeader>地图找房</NavHeader>
      <div id="container" className={styles.container}></div>
    </div>
  );
};

export default Map;
