import { getCityListApi, getHotCityApi } from "@/apis/home";
import { useEffect, useState, useRef } from "react";
import { NavBar, Toast } from "antd-mobile";
import { List, AutoSizer } from "react-virtualized";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import { formatDataList, getCurrentCity, formatCityIndex } from "@/utils/util";

// 索引（A、B等）的高度
const TITLE_HEIGHT = 36;
// 每个城市名称的高度
const NAME_HEIGHT = 50;

const CityList = () => {
  const [cityList, setCityList] = useState({});
  const [cityIndex, setCityIndex] = useState([]);
  // 右侧侧边栏高亮标志
  const [activeIndex, setActiveIndex] = useState(0);

  const listRef = useRef(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const getCityList = async () => {
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
    // console.log("数据1", cityList, cityIndex, currentCityInfo);

    return {
      cityList,
      cityIndex,
    };
    // setCityList(cityList);
    // setCityIndex(cityIndex);
  };
  useEffect(() => {
    async function fetchGetCityList() {
      const { cityList, cityIndex } = await getCityList();
      setCityList(cityList);
      setCityIndex(cityIndex);
      // console.log("数据", cityIndex, cityList);
      // console.log("异步操作完成");

      setDataLoaded(true);
    }
    fetchGetCityList();
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      //调用 measureAllRows，提前计算 List 中每一行的高度，实现 scrollToRow 的精确跳转
      // 注意：调用这个方法的时候，需要保证 List 组件中已经有数据了！如果 List 组件中的数据为空，就会导致调用方法报错！
      // 解决：只要保证这个方法是在 获取到数据之后 调用的即可。
      listRef.current && listRef.current.measureAllRows();
    }
  }, [dataLoaded]);

  const navigate = useNavigate();
  const HOUSE_CITY = ["北京", "上海", "广州", "深圳"];

  //点击城市列表
  const changeCity = ({ label, value }) => {
    // console.log("444", currentCityInfo);
    if (HOUSE_CITY.indexOf(label) > -1) {
      localStorage.setItem("current_city", JSON.stringify({ label, value }));
      navigate(-1);
    } else {
      Toast.show({
        content: "该城市暂无房源",
      });
    }
  };
  // List组件渲染每一行的方法：
  const rowRenderer = ({ key, index, isScrolling, isVisible, style }) => {
    // 获取每一行的字母索引
    const titleFlag = cityIndex[index];
    // console.log(cityIndex);
    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCityIndex(titleFlag)}</div>

        {cityList[titleFlag].map((item) => (
          <div
            className="name"
            key={item.value}
            onClick={() => changeCity(item)}
          >
            {item.label}
          </div>
        ))}
      </div>
    );
  };
  // 创建动态计算每一行高度的方法
  const getRowHeight = ({ index }) => {
    //每一行高度= 标题高度 + 每行城市标签高度 * 城市个数
    const height =
      TITLE_HEIGHT + NAME_HEIGHT * cityList[cityIndex[index]].length;
    return height;
  };

  // 渲染侧边栏城市索引列表
  const renderCityIndex = () => {
    return cityIndex.map((item, index) => (
      <li
        key={item}
        className="city-index-item"
        onClick={() => {
          // console.log("下标", index);
          listRef.current.scrollToRow(index);
        }}
      >
        <span className={activeIndex === index ? "index-active" : ""}>
          {item === "hot" ? "热" : item.toUpperCase()}
        </span>
      </li>
    ));
  };

  //用于获取List组件中渲染行的信息，以便和右侧快捷操作数据对比、同步
  const onRowsRendered = ({ startIndex }) => {
    if (activeIndex !== startIndex) {
      setActiveIndex(startIndex);
      // console.log("startIndex", startIndex);
    }
  };

  return (
    <div className="citylist">
      {/* 导航栏 */}
      <NavBar className="navbar" onBack={() => navigate(-1)}>
        城市选择
      </NavBar>
      {/* 城市列表 */}
      <AutoSizer>
        {({ width, height }) => (
          <List
            ref={listRef}
            width={width}
            height={height}
            rowCount={cityIndex.length}
            rowHeight={getRowHeight}
            rowRenderer={rowRenderer}
            onRowsRendered={onRowsRendered}
            scrollToAlignment="start"
          ></List>
        )}
      </AutoSizer>
      {/* 渲染侧边栏导航 */}
      <ul className="cityIndex">{renderCityIndex()}</ul>
    </div>
  );
};

export default CityList;
