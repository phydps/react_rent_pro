import { useEffect, useState } from "react";
import styles from "./filter.module.scss";
import classnames from "classnames";
// import { useSpring, animated } from "@react-spring/web";
import { PickerView } from "antd-mobile";
import FilterPicker from "../FilterPicker";
import { getCurrentCity } from "@/utils/util";
import { getHouseCondition } from "@/apis/house";

const titleList = [
  { title: "区域", type: "area" },
  { title: "方式", type: "mode" },
  { title: "租金", type: "price" },
  { title: "筛选", type: "more" },
];

const Filter = ({ onFilter }) => {
  const calculateSelected = (type) => {
    return titleSelectedStatus[type];
  };

  const [titleSelectedStatus, setTitleSelectedStatus] = useState({
    // area:区域  mode:方式  price:租金  more:筛选
    // true代表高亮  false:不选中
    area: false,
    mode: false,
    price: false,
    more: false,
  });
  // 记录点击的标题的type值， 用于控制FilterPicker组件的显示和隐藏
  // openType: area/mode/price  FilterPicker就应该显示
  // openType: more/''  FilterPicker就应该隐藏
  const [openType, setOpenType] = useState("");
  const [filtersData, setFiltersData] = useState({});
  // 用于存储所有已经选择过的筛选的条件
  const [selectedValues, setSelectedValues] = useState({
    area: ["area", "null"],
    mode: ["null"],
    price: ["null"],
    more: [],
  });

  const changeStatus = (type) => {
    console.log("type", type);
    document.body.style.overflow = "hidden";
    let newTitleSelectedStatus = { ...titleSelectedStatus };
    Object.keys(selectedValues).forEach((key) => {
      if (key === type) {
        newTitleSelectedStatus[key] = true;
      } else {
        const result = getTitleSelected(key, selectedValues[key]);
        // console.log(result)
        // 把result放到newTitleSelectedStatus
        // newTitleSelectedStatus[key] = result[key]

        // 合并一个获取多个对象到目标对象
        Object.assign(newTitleSelectedStatus, result);
      }
    });
    setOpenType(type);
    setTitleSelectedStatus(newTitleSelectedStatus);
  };

  /*
    接收一个title和 title对应的值
    返回：一个对象，对象包含了这个title是否高亮
  */
  const getTitleSelected = (title, value) => {
    // console.log(title, value)
    const obj = {};
    const selectedVal = value.toString();
    if (title === "area" && selectedVal !== "area,null") {
      obj[title] = true;
    } else if (title === "mode" && selectedVal !== "null") {
      obj[title] = true;
    } else if (title === "price" && selectedVal !== "null") {
      obj[title] = true;
    } else if (title === "more" && value.length > 0) {
      obj[title] = true;
    } else {
      obj[title] = false;
    }
    return obj;
  };

  const onCancel = () => {
    document.body.style.overflow = "";
    // 取消只需要判断当前的标题的高亮问题
    // 从state中获取需要处理的数据
    const selectedVal = selectedValues[openType];
    const result = getTitleSelected(openType, selectedVal);

    // 把openType的值变成''
    setOpenType("");
    const temp = { ...titleSelectedStatus, ...result };
    setTitleSelectedStatus(temp);
  };

  const onSave = (val) => {
    console.log("确定按钮点击获取返回值", val);
    document.body.style.overflow = "";
    // 处理高亮
    const result = getTitleSelected(openType, val);
    console.log("result", result);
    const newSelectedValues = {
      ...selectedValues,
      [openType]: val,
    };
    setOpenType("");
    const newTitleSelectedStatus = {
      ...titleSelectedStatus,
      ...result,
    };
    setSelectedValues(newSelectedValues);
    setTitleSelectedStatus(newTitleSelectedStatus);
    //回调父组件方法
    onFilter(newSelectedValues);
  };
  const [visiable, setVisiable] = useState(false);
  useEffect(() => {
    const newVisiable = openType === "area" || "mode" || "price" ? true : false;
    setVisiable(newVisiable);
    console.log("visiable", visiable);
  }, [openType]);

  const renderFilterPicker = () => {
    // 如果openType是空或者是more，不渲染任何的内容
    if (openType === "" || openType === "more") return;

    // 处理：根据openType来处理需要渲染的data数据
    // defaultValue: 给子组件回显的默认值，，是子组件之前选择过的值
    let data, cols;
    const defaultValue = selectedValues[openType];
    if (openType === "area") {
      data = [filtersData.area, filtersData.subway];
      cols = 3;
    } else if (openType === "mode") {
      data = filtersData.rentType;
      cols = 1;
    } else if (openType === "price") {
      data = filtersData.price;
      cols = 1;
    }
    // console.log("ces", openType, data, cols, defaultValue);
    return (
      <FilterPicker
        key={openType}
        onCancel={onCancel}
        cascaderVisiable={visiable}
        onSave={onSave}
        data={data}
        cols={cols}
        defaultValue={defaultValue}
      />
    );
  };

  useEffect(() => {
    getFiltersData();
  }, []);

  // 获取筛选的条件数据
  const getFiltersData = async () => {
    // 获取当前城市的value值
    const { value } = await getCurrentCity();
    // 根据当前的城市获取筛选条件
    const res = await getHouseCondition(value);
    setFiltersData(res.body);
  };

  return (
    <div className={styles.filter}>
      {/* 测试 */}
      {/* <NewRendermask></NewRendermask> */}
      <div className="content">
        {/* filter组件的内容 */}
        {/* 标题 */}
        <div className="filter_title">
          {titleList.map((item) => {
            return (
              <div key={item.title}>
                <span
                  className={classnames("dropdown", {
                    selected: calculateSelected(item.type),
                  })}
                  onClick={() => changeStatus(item.type)}
                >
                  <span>{item.title}</span>
                  <i className="iconfont icon-arrow" />
                </span>
              </div>
            );
          })}
        </div>
        {/* picker */}
        {renderFilterPicker()}
        {/* more */}
        {/* {this.renderFilterMore()} */}
      </div>
    </div>
  );
};

export default Filter;
