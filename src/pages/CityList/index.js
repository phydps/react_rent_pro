import { getCityListApi } from "@/apis/home";
import { useEffect } from "react";
import { NavBar } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import { formatDataList } from "@/utils/util";

const CityList = () => {
  useEffect(() => {
    const getCityList = async () => {
      const res = await getCityListApi(1);
      console.log("数据", res);
      const { cityList, cityIndex } = formatDataList(res.body);
      console.log("数据1", cityList, cityIndex);
    };
    getCityList();
  }, []);
  const navigate = useNavigate();
  return (
    <div className="citylist">
      <NavBar className="navbar" onBack={() => navigate(-1)}>
        城市选择
      </NavBar>
    </div>
  );
};

export default CityList;
