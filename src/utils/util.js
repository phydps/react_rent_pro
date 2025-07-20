//数据格式化
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

export { formatDataList };
