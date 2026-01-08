import { PickerView, Picker, CascaderView, Cascader } from "antd-mobile";
import styles from "./index.module.scss";
import { useState, useEffect } from "react";

const CustomChildren = (props) => (
  <div
    onClick={props.onClick}
    style={{ backgroundColor: "#fff", paddingLeft: 15 }}
  >
    <div
      className="test"
      style={{
        display: "flex",
        height: "45px",
        lineHeight: "45px",
        position: "relative",
        borderBottom: 0,
      }}
    >
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {props.children}
      </div>
      <div style={{ textAlign: "right", color: "#888", marginRight: 15 }}>
        {props.label}
      </div>
    </div>
  </div>
);

const FilterPicker = ({
  onCancel,
  onSave,
  data,
  cols,
  defaultValue,
  cascaderVisiable,
}) => {
  const [pickerValue, setPickerValue] = useState(defaultValue);
  console.log(" picker数据", pickerValue, data, defaultValue);
  const handleChange = (value) => {
    // 通过value可以和获取到选中的值
    setPickerValue(value);
    // console.log(value)
  };
  const [height, setHeight] = useState("0px");
  useEffect(() => {
    // 假设根据某些条件计算高度并更新状态
    const windowHeight = window.screen.height;
    const newHeight = windowHeight - 125 + "px"; // 示例：新高度为200px
    setHeight(newHeight);
  }, []);

  const confirmHandler = () => {
    console.log("confirmHandler点击");
    // setPickerValue()
    onSave(pickerValue);
  };

  return (
    <div className={styles["filter-picker"]}>
      {/* 三级联动 */}
      {/* <PickerView
        data={data}
        columns={cols}
        value={value}
        onChange={handleChange}
      /> */}
      {/* <Picker
        data={data}
        value={pickerValue}
        onChange={(v) => this.setState({ pickerValue: v })}
        onOk={(v) => this.setState({ pickerValue: v })}
        onClick={() => {
          console.log("xx");
        }}
      >
        <CustomChildren>Customized children</CustomChildren>
      </Picker> */}
      {/* <CascaderView
        style={{ "--height": height }}
        options={data}
        value={pickerValue}
        onChange={(val, extend) => {
          setPickerValue(val);
          console.log("onChange", val, extend.items);
        }}
      /> */}
      <Cascader
        options={data}
        visible={cascaderVisiable}
        onClose={onCancel}
        onConfirm={confirmHandler}
        onSelect={(val, extend) => {
          console.log("onSelect", val, extend.items);
          setPickerValue(val);
        }}
      />
      {/* 底部 */}
    </div>
  );
};

export default FilterPicker;
