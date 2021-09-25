import React, { Component } from "react";

import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker";
import FilterMore from "../FilterMore";

import styles from "./index.module.css";
// 导入axios
import { API } from "../../../../utils/api";
// 标题高亮状态
// true 表示高亮； false 表示不高亮
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false,
};

// FilterPicker 和 FilterMore 组件的选中值
const selectedValues = {
  area: ["area", "null"],
  mode: ["null"],
  price: ["null"],
  more: [],
};

export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    openType: "",
    // 所有筛选条件数据
    filtersData: {},
    selectedValues,
  };
  componentDidMount() {
    this.getFiltersData();
  }
  onTitleClick = (type) => {
    const { titleSelectedStatus, selectedValues } = this.state;
    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus };

    Object.keys(titleSelectedStatus).forEach((key) => {
      if (key === type) {
        newTitleSelectedStatus[type] = true;
        return;
      }

      const selectedVal = selectedValues[key];

      if (
        key === "area" &&
        (selectedVal.length !== 2 || selectedVal[0] !== "area")
      ) {
        newTitleSelectedStatus[key] = true;
      } else if (key === "mode" && selectedVal[0] !== "null") {
        // 高亮
        newTitleSelectedStatus[key] = true;
      } else if (key === "price" && selectedVal[0] !== "null") {
        // 高亮
        newTitleSelectedStatus[key] = true;
      } else if (key === "more" && selectedVal.length !== 0) {
        // 更多选择项 FilterMore 组件
        newTitleSelectedStatus[key] = true;
      } else {
        newTitleSelectedStatus[key] = false;
      }
    });

    this.setState({
      openType: type,
      titleSelectedStatus: newTitleSelectedStatus,
    });
  };
  onCancel = () => {
    this.setState({
      openType: "",
    });
  };
  onSave = (type, value) => {
    this.setState({
      openType: "",
      selectedValues: {
        ...this.state.selectedValues,
        [type]: value,
      },
    });
  };
  // 封装获取所有筛选条件的方法
  async getFiltersData() {
    // 获取当前定位城市id
    const { value } = JSON.parse(localStorage.getItem("hkzf_city"));
    const res = await API.get(`/houses/condition?id=${value}`);
    this.setState({
      filtersData: res.data.body,
    });
  }
  renderFilterPicker() {
    const {
      openType,
      filtersData: { area, subway, rentType, price },
      selectedValues,
    } = this.state;

    if (openType !== "area" && openType !== "mode" && openType !== "price") {
      return null;
    }
    let data = [];
    let cols = 3;
    let defaultValue = selectedValues[openType];
    switch (openType) {
      case "area":
        data = [area, subway];
        cols = 3;
        break;
      case "mode":
        data = rentType;
        cols = 1;
        break;
      case "price":
        data = price;
        cols = 1;
        break;
      default:
        break;
    }

    return (
      <FilterPicker
        key={openType}
        onCancel={this.onCancel}
        onSave={this.onSave}
        data={data}
        cols={cols}
        type={openType}
        defaultValue={defaultValue}
      />
    );
  }
  renderFilterMore() {
    const {
      openType,
      selectedValues,
      filtersData: { roomType, oriented, floor, characteristic },
    } = this.state;
    if (openType !== "more") {
      return;
    }
    const data = { roomType, oriented, floor, characteristic };
    const defaultValue = selectedValues.more;

    return (
      <FilterMore
        data={data}
        type={openType}
        onSave={this.onSave}
        onCancel={this.onCancel}
        defaultValue={defaultValue}
      />
    );
  }
  render() {
    const { titleSelectedStatus, openType } = this.state;
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {openType === "area" || openType === "mode" || openType === "price" ? (
          <div className={styles.mask} onClick={this.onCancel} />
        ) : null}
        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            titleSelectedStatus={titleSelectedStatus}
            onClick={this.onTitleClick}
          />

          {/* 前三个菜单对应的内容： */}
          {this.renderFilterPicker()}

          {/* 最后一个菜单对应的内容： */}
          {this.renderFilterMore()}
        </div>
      </div>
    );
  }
}
