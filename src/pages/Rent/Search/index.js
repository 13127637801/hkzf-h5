import React, { Component } from "react";

import { SearchBar } from "antd-mobile";

import { getCity, API } from "../../../utils";

import styles from "./index.module.css";

export default class Search extends Component {
  // 当前城市id
  cityId = getCity().value;

  state = {
    searchTxt: "",
    tipsList: [],
  };

  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state;
    console.log(tipsList)
    return tipsList.map((item) => (
      <li key={item.value} className={styles.tip} onClick={() => this.onTipsClick(item)}>
        {item.label}
      </li>
    ));
  };

  handleSearchTxt = (value) => {
    this.setState({ searchTxt: value });

    if (!value) {
      // 文本框的值为空
      return this.setState({
        tipsList: [],
      });
    }

    // 清除上一次的定时器
    clearTimeout(this.timerId);

    this.timerId = setTimeout(async () => {
      // 获取小区数据
      const res = await API.get("/area/community", {
        params: {
          name: value,
          id: this.cityId,
        },
      });

      // console.log(res)

      this.setState({
        tipsList: res.data.body,
      });
    }, 500);
  };

  onTipsClick = item => {
    this.props.history.replace('/rent/add', {
      name: item.communityName,
      id: item.community
    })
  }

  render() {
    const { history } = this.props;
    const { searchTxt } = this.state;

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          showCancelButton={true}
          onChange={this.handleSearchTxt}
          onCancel={() => history.go(-1)}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    );
  }
}
