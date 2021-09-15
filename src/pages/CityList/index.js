import React from "react";
import { NavBar } from "antd-mobile";
import { getCurrentCity } from "../../utils";

// 导入axios
import axios from "axios";
import './index.scss'

const formatCityData = (list) => {
  const cityList = {};
  list.forEach((item) => {
    const first = item.short.substr(0, 1);
    if (cityList[first]) {
      cityList[first].push(item);
    } else {
      cityList[first] = [item];
    }
  });
  const cityIndex = Object.keys(cityList).sort();

  return {
    cityList,
    cityIndex,
  };
};

export default class CityList extends React.Component {
  componentDidMount() {
    this.getCityList();
  }

  async getCityList() {
    const res = await axios.get("http://localhost:8080/area/city?level=1");
    const { cityList, cityIndex } = formatCityData(res.data.body);
    const hotRes = await axios.get("http://localhost:8080/area/hot");
    cityList["hot"] = hotRes.data.body;
    cityIndex.unshift("hot");

    const curCity = await getCurrentCity();
    cityList["#"] = [curCity];
    cityIndex.unshift("#");
  }

  render() {
    return (
      <div className="citylist">
        <NavBar
          className="navbar"
          mode="light"
          icon={<i className="iconfont icon-back" />}
          onLeftClick={() => this.props.history.go("-1")}
        >
          城市选择
        </NavBar>
      </div>
    );
  }
}
