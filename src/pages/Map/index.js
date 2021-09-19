import React from "react";
// import "./index.scss";
import styles from "./index.module.css";
// 导入封装好的 NavHeader 组件
import NavHeader from "../../components/NavHeader";

export default class Map extends React.Component {
  componentDidMount() {
    this.initMap()
  }
  initMap() {
    // 初始化地图实例
    // 注意：在 react 脚手架中全局对象需要使用 window 来访问，否则，会造成 ESLint 校验错误
    const map = new BMapGL.Map("container");
    // 设置中心点坐标
    const point = new BMapGL.Point(116.404, 39.915);

    const myGeo = new BMapGL.Geocoder();
    // 获取地址
    const localCity = JSON.parse(localStorage.getItem("hkzf_city"));
    const { label, value } = localCity;

    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(
      label,
      (point) => {
        if (point) {
          // 初始化地图
          map.centerAndZoom(point, 11);
          // map.addOverlay(
          //   new BMapGL.Marker(point, { title: "北京市海淀区上地10街" })
          // );
          map.addControl(new BMapGL.ZoomControl());
          map.addControl(new BMapGL.ScaleControl());
        } else {
          alert("您选择的地址没有解析到结果！");
        }
      },
      label
    );
  }
  render() {
    return (
      <div className={styles.map}>
        <NavHeader>地图找房</NavHeader>
        <div id="container" className={styles.container}></div>
      </div>
    );
  }
}
