import React from "react";

import { NavBar } from "antd-mobile";

import { withRouter } from "react-router";

// 导入样式
import "./index.scss";

function NavHeader(props) {
  console.log(props);
  const defaultHandler = () => props.history.go("-1");
  return (
    <NavBar
      className="navbar"
      mode="light"
      icon={<i className="iconfont icon-back" />}
      onLeftClick={props.onLeftClick || defaultHandler}
    >
      {props.children}
    </NavBar>
  );
}
// withRouter(NavHeader) 函数的返回值也是一个组件
export default withRouter(NavHeader);
