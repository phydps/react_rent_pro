// const HouseList = () => {
//   return <div>我是HouseList组件</div>;
// };
import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import Sticky from "@/components/Sticky";
import { useNavigate } from "react-router-dom";
import classnames from "classnames";
import { getHouseListApi } from "@/apis/house";
import { getCurrentCity } from "@/utils/util";
import { Toast } from "antd-mobile";
import {
  List,
  AutoSizer,
  WindowScroller,
  InfiniteLoader,
} from "react-virtualized";
import noDataList from "@/assets/images/not-found.png";
import { REQUEST_URL } from "@/components/CONST";
import HouseListItem from "./components/ListItem/index";
import Filter from "./components/Filter";

const HouseList = () => {
  const [cityName, setCityName] = useState("");
  const [cityId, setCityId] = useState("");
  const [showList, setShowList] = useState([]);
  const [count, setCount] = useState(0);
  const [filter, setFilter] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getCurrentCityInfo();
    getHouseList();
  }, []);

  // 获取当前ip定位城市 name和id
  const getCurrentCityInfo = async () => {
    const { label, value } = await getCurrentCity();
    console.log("currentCityInfo", label, value);
    setCityName(label);
    setCityId(value);
  };

  //获取房屋列表数据
  const getHouseList = async (start = 1, end = 30) => {
    Toast.show({
      icon: "loading",
      content: "加载中…",
      duration: 0,
    });
    const params = {
      cityId: cityId,
      start,
      end,
    };
    try {
      const res = await getHouseListApi(params);
      console.log("房屋数据列表", res.body);
      const { list, count } = res.body;
      const totalList = [...showList, ...list];

      setCount(count);
      setShowList(totalList);
    } catch (error) {
    } finally {
      Toast.clear();
      setIsLoaded(true);
    }
  };

  const isRowLoaded = ({ index }) => {
    // console.log("index", index);
    // 判断list中index是否有对应的数据
    return !!showList[index];
  };

  const loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise(async (resolve) => {
      await getHouseList(startIndex + 1, stopIndex + 1);
      resolve();
    });
  };

  //渲染每一行item
  const rowRenderer = ({ key, index, style }) => {
    const item = showList[index];
    // item没有值时
    if (!item) {
      return (
        <div key={key} style={style} className="tips">
          <p />
        </div>
      );
    }
    // console.log("每一行渲染参数", item);
    return <HouseListItem key={key} item={item} style={style}></HouseListItem>;
  };

  const renderList = () => {
    // debugger;
    if (count === 0 && isLoaded) {
      return (
        <div className={styles["no-house"]}>
          <img className="img" src={noDataList} alt="暂无数据" />
          <p className="msg">{"没有找到房源，请您换个搜索条件吧~"}</p>
        </div>
      );
    }
    return (
      <InfiniteLoader
        isRowLoaded={isRowLoaded.bind(this)}
        loadMoreRows={loadMoreRows.bind(this)}
        rowCount={count}
        minimumBatchSize={20}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, isScrolling, scrollTop }) => (
              <AutoSizer>
                {({ width }) => (
                  <List
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    autoHeight
                    width={width}
                    height={height}
                    rowCount={count}
                    rowHeight={120}
                    rowRenderer={rowRenderer.bind(this)}
                    isScrolling={isScrolling}
                    scrollTop={scrollTop}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    );
  };
  const onFilter = (selectedValues) => {
    // const filters = this.formatFilters(selectedValues);
    // this.setState(
    //   {
    //     filters,
    //   },
    //   () => {
    //     // 发送ajax请求
    //     this.getHouseList();
    //   }
    // );
    console.log("onFilter", selectedValues);
    window.scrollTo(0, 0);
  };

  return (
    <div className={styles.house}>
      <div className="house-title">
        <i className="iconfont icon-back" onClick={() => navigate(-1)} />
        {/* <SearchHeader className="house-search" cityName={this.state.label} /> */}
        {/* 搜索区 */}
        <div className={classnames("house-search", styles["search-box"])}>
          <div className="search-form">
            <div className="location" onClick={() => navigate("/city")}>
              <span className="name">{cityName}</span>
              <i className="iconfont icon-arrow"> </i>
            </div>
            <div className="search-input" onClick={() => navigate("/search")}>
              <i className="iconfont icon-seach" />
              <span className="text">请输入小区地址</span>
            </div>
          </div>
          {/* 右侧地图图标 */}
          <i className="iconfont icon-map" onClick={() => navigate("/map")} />
        </div>
      </div>
      <Sticky>
        <div>
          <Filter onFilter={onFilter}></Filter>
        </div>
      </Sticky>
      {/* 渲染房屋长列表 */}
      {renderList()}
    </div>
  );
};

export default HouseList;
