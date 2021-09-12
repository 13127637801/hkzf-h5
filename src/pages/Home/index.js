import React from "react";
import { Route } from "react-router-dom";
import News from "../News";
import List from "../List";
import Profile from "../Profile";
import Index from "../Index";

import { TabBar } from "antd-mobile";
import "./index.css";

const tabItems = [
  {
    title: "首页",
    icon: "icon-ind",
    path: "/home",
  },
  {
    title: "找房",
    icon: "icon-findHouse",
    path: "/home/list",
  },
  {
    title: "资讯",
    icon: "icon-infom",
    path: "/home/news",
  },
  {
    title: "我的",
    icon: "icon-my",
    path: "/home/profile",
  },
];

export default class Home extends React.Component {
  state = {
    selectedTab: this.props.location.pathname,
    hidden: false,
  };

  renderTabBarItem() {
    return tabItems.map((item) => (
      <TabBar.Item
        title={item.title}
        key={item.title}
        icon={<i className={`iconfont ${item.icon}`}></i>}
        selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
        selected={this.state.selectedTab === item.path}
        onPress={() => {
          this.setState({
            selectedTab: item.path,
          });
          // 路由切换
          this.props.history.push(item.path);
        }}
      ></TabBar.Item>
    ));
  }

  render() {
    
    return (
      <div className="home">
        {/* 子路由 */}
        <Route exact path="/home" component={Index} />
        <Route path="/home/news" component={News} />
        <Route path="/home/list" component={List} />
        <Route path="/home/profile" component={Profile} />

        {/* tabBar菜单内容 */}
        <div>
          <TabBar
            unselectedTintColor="#888"
            tintColor="#21b97a"
            barTintColor="white"
            hidden={this.state.hidden}
            noRenderContent={true}
          >
           {this.renderTabBarItem()}
          </TabBar>
        </div>
      </div>
    );
  }
}
