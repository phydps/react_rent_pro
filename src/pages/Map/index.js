import { useEffect } from "react";
import "./index.scss";
import NavHeader from "@/components/NavHeader";
const Map = () => {
  useEffect(() => {
    //初始化地图实例
    const map = new window.BMap.Map("container");
    //设置地图中心点坐标
    const point = new window.BMap.Point(116.404, 39.915);
    //初始化地图
    map.centerAndZoom(point, 15);
  }, []);
  return (
    <div className="map">
      {/* 导航栏 */}
      <NavHeader>地图找房</NavHeader>
      <div id="container"></div>
    </div>
  );
};

export default Map;
