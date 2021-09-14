import React from "react";
import "./index.scss";

export default class Map extends React.Component {
    componentDidMount() {
      
    // 初始化地图实例
    // 注意：在 react 脚手架中全局对象需要使用 window 来访问，否则，会造成 ESLint 校验错误
    const map = new BMapGL.Map('container')
    // 设置中心点坐标
    const point = new BMapGL.Point(116.404, 39.915)
    // 初始化地图
    map.centerAndZoom(point, 15)
  }
  render() {
    return (
      <div className="map">
        <div id="container">Map子路由的内容</div>
      </div>
    );
  }
}
