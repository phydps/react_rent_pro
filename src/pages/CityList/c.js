import { getCityListApi, getHotCityApi } from "@/apis/home";
import { useEffect, useState } from "react";
import { NavBar } from "antd-mobile";
import { List, AutoSizer } from "react-virtualized";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import { formatDataList, getCurrentCity } from "@/utils/util";
import React from "react";

const list = Array(100).fill("react-virtulized");

export default class CityList extends React.Component {
  state = {
    cityList: {},
    cityIndex: [],
    activeIndex: 0,
  };
  componentDidMount() {
    //获取城市列表
    this.getCityList();
  }
  async getCityList() {
    const res = await getCityListApi(1);
    const { cityList, cityIndex } = formatDataList(res.body);

    //添加热门城市数据
    const resHot = await getHotCityApi();
    cityList["hot"] = resHot.body;
    cityIndex.unshift("hot");

    //添加当前定位的城市数据
    const currentCityInfo = await getCurrentCity();
    cityList["#"] = [currentCityInfo];
    cityIndex.unshift("#");
    console.log("数据1", cityList, cityIndex, currentCityInfo);

    // setCityList(cityList);
    // setCityIndex(cityIndex);
    this.setState({
      cityList,
      cityIndex,
    });
  }

  rowRenderer = ({ key, index, isScrolling, isVisible, style }) => {
    const { cityIndex, cityList } = this.state;
    const titleFlag = cityIndex[index];

    console.log(cityIndex);

    return (
      <div key={key} style={style} className="city">
        {cityList[titleFlag].map((item) => (
          <div className="name" key={item.value}>
            {item.label}
          </div>
        ))}
      </div>
    );
  };

  render() {
    return (
      <div className="citylist">
        {/* 导航栏 */}
        <NavBar className="navbar" onBack={() => this.props.history.go(-1)}>
          城市选择
        </NavBar>
        {/* 城市列表 */}
        <AutoSizer className="">
          {({ width, height }) => (
            <List
              width={width}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={50}
              rowRenderer={this.rowRenderer}
            ></List>
          )}
        </AutoSizer>
      </div>
    );
  }
}
