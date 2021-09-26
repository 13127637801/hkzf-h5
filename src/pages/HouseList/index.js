import React from "react";

import { Flex } from "antd-mobile";
import { API } from "../../utils/api";
import SearchHeader from "../../components/SearchHeader";
import Filter from "./components/Filter";

// 导入样式
import styles from "./index.module.css";

// 获取当前定位城市信息
const { label, value } = JSON.parse(localStorage.getItem("hkzf_city"));

export default class HouseList extends React.Component {
  state = {
     // 列表数据
     list: [],
     // 总条数
     count: 0
  }
  filters = {}
  componentDidMount() {
    this.searchHouseList()
  }
  async searchHouseList() {
    
    const res = await API.get("/houses", {
      params: {
        cityId: value,
        ...this.filters,
        start: 1,
        end: 20,
      },
    });
    const { list, count } = res.data.body
    console.log(res)
    this.setState({
      list,
      count
    })
  }
  onFilter = (filters) => {
    this.filters = filters;
    this.searchHouseList();
  };
  render() {
    return (
      <div>
        <Flex className={styles.header}>
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.go(-1)}
          />
          <SearchHeader
            cityName={label}
            className={styles.searchHeader}
          ></SearchHeader>
        </Flex>
        {/* 条件筛选栏 */}
        <Filter onFilter={this.onFilter} />
      </div>
    );
  }
}
