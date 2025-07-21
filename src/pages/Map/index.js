import { useEffect, useState } from "react";
import React from "react";
import "./index.scss";
import NavHeader from "@/components/NavHeader";
import { getAreaHouseApi, getCommunityHousesApi } from "@/apis/house";
import styles from "./index.module.css";
import { Link } from "react-router-dom";
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

export default class Map extends React.Component {
  state = {
    housesList: [],
    isShowList: false,
  };
  componentDidMount() {
    this.initMap();
  }

  initMap = () => {
    // 获取当前定位城市
    const { label, value } = JSON.parse(localStorage.getItem("current_city"));
    // console.log("城市数据", label, value);

    //初始化地图实例
    const map = new BMap.Map("container");
    this.map = map;
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

          this.renderOverlays(value);
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

          //   const areaPoint = new BMap.Point(longitude, latitude);
          //   const options = {
          //     position: areaPoint,
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
          //     map.centerAndZoom(areaPoint, 13);

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
  /*渲染覆盖物入口
  1.接收区域id参数，获取该区域下的房源数据
  2.获取房源类型以及下级地图缩放比例
  */
  renderOverlays = async (id) => {
    //获取房源数据
    const res = await getAreaHouseApi(id);
    // console.log("城市数据", res);
    //获取地图缩放级别和覆盖物类型
    const { nextZoom, type } = this.getTypeAndZoom();

    res.body.forEach((element) => {
      //创建覆盖物
      this.createOverlays(element, nextZoom, type);
    });
  };

  //创建覆盖物函数
  createOverlays = (data, zoom, type) => {
    const {
      count,
      label: areaName,
      value,
      coord: { latitude, longitude },
    } = data;
    const areaPoint = new BMap.Point(longitude, latitude);

    if (type === "circle") {
      this.createCircle(areaPoint, areaName, count, value, zoom);
    } else {
      this.createRect(areaPoint, areaName, count, value);
    }
  };

  //计算要绘制的覆盖物的类型和下一级缩放级别
  // 区：缩放级别 -》11 范围>=10&&<12
  // 镇：缩放级别 -》13 范围>=12&&<14
  // 小区：缩放级别 -》15 范围>=14&&<16
  getTypeAndZoom = () => {
    //获取当前地图对象的缩放级别
    const zoom = this.map.getZoom();
    console.log("当前缩放级别", zoom);
    let nextZoom, type;
    if (zoom >= 10 && zoom < 12) {
      nextZoom = 13;
      type = "circle";
    } else if (zoom >= 12 && zoom < 14) {
      nextZoom = 15;
      type = "circle";
    } else if (zoom >= 14 && zoom < 16) {
      type = "rect";
    }

    return {
      nextZoom,
      type,
    };
  };
  createCircle = (point, name, count, id, zoom) => {
    const options = {
      position: point,
      offset: new BMap.Size(-35, -35),
    };
    //为每条数据创建覆盖物
    const label = new BMap.Label("", options);
    // 给label对象添加唯一标识
    label.id = id;
    //设置房源覆盖物样式
    label.setContent(`
      <div class="${styles.bubble}">
        <p class="${styles.name}">${name}</p>
        <p>${count}套</p>
      </div>
      `);
    // 设置样式
    label.setStyle(labelStyle);
    //添加点击事件
    label.addEventListener("click", () => {
      // 调用renderOverlays方法，获取该区域下的房源数据
      this.renderOverlays(id);

      //放大地图，以当前点击的覆盖物为中心方法地图
      this.map.centerAndZoom(point, zoom);

      //清除覆盖物
      setTimeout(() => {
        this.map.clearOverlays();
      }, 0);
    });
    //添加覆盖物到地图中
    this.map.addOverlay(label);
  };
  createRect = (point, name, count, id) => {
    // console.log("进入createRect");
    const options = {
      position: point,
      offset: new BMap.Size(-50, -28),
    };
    //为每条数据创建覆盖物
    const label = new BMap.Label("", options);
    // 给label对象添加唯一标识
    label.id = id;
    //设置房源覆盖物样式
    label.setContent(`
      <div class="${styles.rect}">
        <span class="${styles.housename}">${name}</span>
        <span class="${styles.housenum}">${count}套</span>
        <i class="${styles.arrow}"></i>
      </div>
      `);
    // 设置样式
    label.setStyle(labelStyle);
    //添加点击事件
    label.addEventListener("click", () => {
      // 调用接口方法，获取该小区的房源数据
      this.fetchCommunityHousesApi(id);
    });
    //添加覆盖物到地图中
    this.map.addOverlay(label);
  };

  fetchCommunityHousesApi = async (id) => {
    const res = await getCommunityHousesApi(id);
    console.log("小区房源数据：", res);
    this.setState({
      housesList: res.body.list,
      isShowList: true,
    });
  };

  render() {
    return (
      <div className={styles.map}>
        {/* 导航栏 */}
        <NavHeader>地图找房</NavHeader>
        <div id="container" className={styles.container}></div>
        {/* 房源列表 */}
        <div
          className={[
            styles.houseList,
            this.state.isShowList ? styles.show : "",
          ].join(" ")}
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <Link className={styles.titleMore} to="/home/list">
              更多房源
            </Link>
          </div>

          <div className={styles.houseItems}>
            {/* 房屋结构 */}
            {this.state.housesList.map((item) => (
              <div className={styles.house} key={item.houseCode}>
                <div className={styles.imgWrap}>
                  <img
                    className={styles.img}
                    src={`http://localhost:8080${item.houseImg}`}
                    alt=""
                  />
                </div>
                <div className={styles.content}>
                  <h3 className={styles.title}>{item.title}</h3>
                  <div className={styles.desc}>{item.desc}</div>
                  <div>
                    {item.tags.map((tag) => (
                      <span
                        className={[styles.tag, styles.tag1].join(" ")}
                        key={tag}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className={styles.price}>
                    <span className={styles.priceNum}>{item.price}</span> 元/月
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
