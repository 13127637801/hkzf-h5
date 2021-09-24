import React from "react";

import { Flex } from "antd-mobile";

import { withRouter } from "react-router";

import PropTypes from "prop-types";

// 导入样式
import './index.scss'

function SearchHeader(props) {
  const defaultHandler = () => props.history.go("-1");
  return (
    <Flex className={["search-box",props.className || ""].join(" ")}>
      {/* 左侧白色区域 */}
      <Flex className="search">
        {/* 位置 */}
        <div
          className="location"
          onClick={() => props.history.push("/citylist")}
        >
          <span className="name">{props.cityName}</span>
          <i className="iconfont icon-arrow" />
        </div>

        {/* 搜索表单 */}
        <div
          className="form"
          onClick={() => props.history.push("/search")}
        >
          <i className="iconfont icon-seach" />
          <span className="text">请输入小区或地址</span>
        </div>
      </Flex>
      {/* 右侧地图图标 */}
      <i
        className="iconfont icon-map"
        onClick={() => props.history.push("/map")}
      />
    </Flex>
  );
}
// 添加props校验
SearchHeader.propTypes = {
  cityName: PropTypes.string.isRequired
};

// withRouter(NavHeader) 函数的返回值也是一个组件
export default withRouter(SearchHeader);
