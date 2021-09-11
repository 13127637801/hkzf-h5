import React from "react";
import { Route } from "react-router-dom";
import News from "../News";
import List from "../List";
import Profile from "../Profile";
import Index from "../Index";

import { TabBar } from "antd-mobile";
import "./index.css";

export default class Home extends React.Component {
  state = {
    selectedTab: "redTab",
    hidden: false,
  };
  
  render() {
    return (
      <div className="home">
        
        {/* 子路由 */}
        <Route path="/home/index" component={Index} />
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
            <TabBar.Item
              title="首页"
              key="home"
              icon={<i className="iconfont icon-ind"></i>}
              selectedIcon={<i className="iconfont icon-ind"></i>}
              selected={this.state.selectedTab === "blueTab"}
              onPress={() => {
                this.setState({
                  selectedTab: "blueTab",
                });
                this.props.history.push("/home/index")
              }}
              data-seed="logId"
            >
              
            </TabBar.Item>
            <TabBar.Item
              icon={<i className="iconfont icon-findHouse"></i>}
              selectedIcon={<i className="iconfont icon-findHouse"></i>}
              title="找房"
              key="Koubei"
              selected={this.state.selectedTab === "redTab"}
              onPress={() => {
                this.setState({
                  selectedTab: "redTab",
                });
                this.props.history.push("/home/list")
              }}
              data-seed="logId1"
            >
              
            </TabBar.Item>
            <TabBar.Item
              icon={<i className="iconfont icon-infom"></i>}
              selectedIcon={<i className="iconfont icon-infom"></i>}
              title="资讯"
              key="Friend"
              selected={this.state.selectedTab === "greenTab"}
              onPress={() => {
                this.setState({
                  selectedTab: "greenTab",
                });
                this.props.history.push("/home/news")
              }}
            >
              
            </TabBar.Item>
            <TabBar.Item
              icon={<i className="iconfont icon-my"></i>}
              selectedIcon={<i className="iconfont icon-my"></i>}
              title="我的"
              key="my"
              selected={this.state.selectedTab === "yellowTab"}
              onPress={() => {
                this.setState({
                  selectedTab: "yellowTab",
                });
                this.props.history.push("/home/profile")
              }}
            >
              
            </TabBar.Item>
          </TabBar>
        </div>
      </div>
    );
  }
}
