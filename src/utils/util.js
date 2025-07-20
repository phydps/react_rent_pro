import { getCurLocationApi } from "@/apis/home";

// 封装处理字母索引的方法
const formatCityIndex = (cityFlag) => {
  switch (cityFlag) {
    case "#":
      return "当前定位";
    case "hot":
      return "热门城市";
    default:
      return cityFlag.toUpperCase();
  }
};

//城市列表数据格式化
const formatDataList = (arr) => {
  /*
// 接口返回的数据格式：
[{ "label": "北京", "value": "", "pinyin": "beijing", "short": "bj" }]

// 渲染城市列表的数据格式为：
{ a: [{}, {}], b: [{}, ...] }
// 渲染右侧索引的数据格式：
['a', 'b']
*/
  const cityList = {};
  arr.forEach((item) => {
    const firstShort = item.short.substr(0, 1);
    if (cityList[firstShort]) {
      cityList[firstShort].push(item);
    } else {
      cityList[firstShort] = [item];
    }
  });

  const cityIndex = Object.keys(cityList).sort();

  return {
    cityList,
    cityIndex,
  };
};

//获取当前城市数据方法
const getCurrentCity = () => {
  const localCity = JSON.parse(localStorage.getItem("current_city"));
  if (!localCity) {
    return new Promise((resolve, reject) => {
      var myCity = new window.BMap.LocalCity();
      myCity.get(async (res) => {
        const cityName = res.name;
        // console.log("当前城市名称", cityName);

        try {
          const result = await getCurLocationApi(cityName);
          // console.log(result);
          localStorage.setItem("current_city", JSON.stringify(result.body));

          resolve(result.body);
        } catch (error) {
          reject(error);
        }
      });
    });
  } else {
    return Promise.resolve(localCity);
  }
};

export { formatDataList, getCurrentCity, formatCityIndex };
