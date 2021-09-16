import React from "react";
import {  Toast } from "antd-mobile";
import { getCurrentCity } from "../../utils";

import { List, AutoSizer } from "react-virtualized";

// 导入封装好的 NavHeader 组件
import NavHeader from "../../components/NavHeader";

// 导入axios
import axios from "axios";
import "./index.scss";

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

// 封装处理字母索引的方法
const formatCityIndex = (letter) => {
  switch (letter) {
    case "#":
      return "当前定位";
    case "hot":
      return "热门城市";
    default:
      return letter.toUpperCase();
  }
};

// 索引（A、B等）的高度
const TITLE_HEIGHT = 36;
// 每个城市名称的高度
const NAME_HEIGHT = 50;

// 有房源的城市
const HOUSE_CITY = ["北京", "上海", "广州", "深圳"];

export default class CityList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cityList: {},
      cityIndex: [],
      // 指定右侧字母索引列表高亮的索引号
      activeIndex: 0,
    };
    // 创建ref对象
    this.cityListComponent = React.createRef();
  }

  async componentDidMount() {
    await this.getCityList();
    this.cityListComponent.current.measureAllRows();
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

    this.setState({
      cityList,
      cityIndex,
    });
  }

  rowRenderer = ({
    key, // Unique key within array of rows
    index, // 索引号
    isScrolling, // 当前项是否正在滚动中
    isVisible, // 当前项在 List 中是可见的
    style, // 注意：重点属性，一定要给每一个行数据添加该样式！作用：指定每一行的位置
  }) => {
    // 获取每一行的字母索引
    const { cityIndex, cityList } = this.state;
    const letter = cityIndex[index];

    // 获取指定字母索引下的城市列表数据
    // console.log(cityList[letter])

    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCityIndex(letter)}</div>
        {cityList[letter].map((item) => (
          <div
            className="name"
            key={item.value}
            onClick={() => this.changeCity(item)}
          >
            {item.label}
          </div>
        ))}
      </div>
    );
  };
  // 切换城市
  changeCity({ label, value }) {
    console.log(label);
    if (HOUSE_CITY.indexOf(label) > -1) {
      localStorage.setItem("hkzf_city", JSON.stringify({ label, value }));
      this.props.history.go(-1);
    } else {
      Toast.info("该城市暂无房源数据", 1, null, false);
    }
  }

  // 创建动态计算每一行高度的方法
  getRowHeight = ({ index }) => {
    const { cityIndex, cityList } = this.state;
    const citySum = cityList[cityIndex[index]];
    return TITLE_HEIGHT + NAME_HEIGHT * citySum.length;
  };

  renderCityIndex() {
    const { cityIndex, activeIndex } = this.state;
    return cityIndex.map((item, index) => (
      <li
        className="city-index-item"
        key={item}
        onClick={() => {
          this.cityListComponent.current.scrollToRow(index);
        }}
      >
        <span className={activeIndex === index ? "index-active" : ""}>
          {item === "hot" ? "热" : item.toUpperCase()}
        </span>
      </li>
    ));
  }
  // 用于获取List组件中渲染行的信息
  onRowsRendered = ({ startIndex }) => {
    if (this.state.activeIndex !== startIndex) {
      this.setState({
        activeIndex: startIndex,
      });
    }
  };
  render() {
    return (
      <div className="citylist">
        
        <NavHeader>城市选择</NavHeader>
        
        {/* 城市列表 */}
        <AutoSizer>
          {({ width, height }) => (
            <List
              ref={this.cityListComponent}
              width={width}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
              onRowsRendered={this.onRowsRendered}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>

        <ul className="city-index">{this.renderCityIndex()}</ul>
      </div>
    );
  }
}
