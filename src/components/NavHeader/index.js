import React from "react";

import { NavBar } from "antd-mobile";

import { withRouter } from "react-router";

import PropTypes from "prop-types";

// 导入样式
import styles from "./index.module.css";

function NavHeader(props) {
  const defaultHandler = () => props.history.go("-1");
  return (
    <NavBar
      className={styles.navBar}
      mode="light"
      icon={<i className="iconfont icon-back" />}
      onLeftClick={props.onLeftClick || defaultHandler}
    >
      {props.children}
    </NavBar>
  );
}
// 添加props校验
NavHeader.propTypes = {
    children: PropTypes.string.isRequired,
    onLeftClick: PropTypes.func
  }
  
// withRouter(NavHeader) 函数的返回值也是一个组件
export default withRouter(NavHeader);
