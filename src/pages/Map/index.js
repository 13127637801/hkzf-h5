import React from "react";
// import "./index.scss";
import { Toast } from "antd-mobile";
import { Link } from "react-router-dom";
import styles from "./index.module.css";
// 导入封装好的 NavHeader 组件
import NavHeader from "../../components/NavHeader";
// 导入axios
// import axios from "axios";
import { API } from "../../utils/api"

// 覆盖物样式
const labelStyle = {
  cursor: "pointer",
  border: "0px solid rgb(255, 0, 0)",
  padding: "0px",
  whiteSpace: "nowrap",
  fontSize: "12px",
  color: "rgb(255, 255, 255)",
  textAlign: "center",
};

export default class Map extends React.Component {
  state = {
    housesList: [],
    isShowList: false,
  };
  componentDidMount() {
    this.initMap();
  }
  initMap() {
    // 初始化地图实例
    // 注意：在 react 脚手架中全局对象需要使用 window 来访问，否则，会造成 ESLint 校验错误
    const map = new BMapGL.Map("container");
    this.map = map;
    // 设置中心点坐标
    // const point = new BMapGL.Point(116.404, 39.915);

    const myGeo = new BMapGL.Geocoder();
    // 获取地址
    const localCity = JSON.parse(localStorage.getItem("hkzf_city"));
    const { label, value } = localCity;

    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(
      label,
      async (point) => {
        if (point) {
          // 初始化地图
          map.centerAndZoom(point, 11);
          // map.addOverlay(
          //   new BMapGL.Marker(point, { title: "北京市海淀区上地10街" })
          // );
          map.addControl(new BMapGL.ZoomControl());
          map.addControl(new BMapGL.ScaleControl());

          // 调用 renderOverlays 方法
          this.renderOverlays(value);

          // const res = await API.get("/area/map", {
          //   params: {
          //     id: value,
          //   },
          // });

          // res.data.body.forEach((item) => {
          //   const {
          //     coord: { latitude, longitude },
          //     label: areaName,
          //     count,
          //     value,
          //   } = item;

          //   const areaPoint = new BMapGL.Point(longitude, latitude);

          //   var opts = {
          //     position: areaPoint, // 指定文本标注所在的地理位置
          //     offset: new BMapGL.Size(-35, -35), // 设置文本偏移量
          //   };
          //   // 创建覆盖物
          //   const label = new BMapGL.Label("", opts);
          //   // 给 label 对象添加一个唯一标识
          //   label.id = value;

          //   // 设置房源覆盖物内容
          //   label.setContent(`
          //     <div class="${styles.bubble}">
          //       <p class="${styles.name}">${areaName}</p>
          //       <p>${count}套</p>
          //     </div>
          //   `);

          //   // 设置样式
          //   label.setStyle(labelStyle);
          //   label.addEventListener("click", () => {
          //     map.centerAndZoom(areaPoint, 13);

          //     setTimeout(() => {
          //       // 清除当前覆盖物信息
          //       map.clearOverlays();
          //     }, 0);
          //   });
          //   map.addOverlay(label);
          // });
        } else {
          alert("您选择的地址没有解析到结果！");
        }
      },
      label
    );
    map.addEventListener("movestart", () => {
      // 地图移动隐藏列表
      if (this.state.isShowList) {
        this.setState({
          isShowList: false,
        });
      }
    });
  }
  async renderOverlays(id) {
    try {
      Toast.loading("加载中", 0, null, false);
      const res = await API.get("/area/map", {
        params: {
          id: id,
        },
      });
      Toast.hide();
      const data = res.data.body;
      const { nextZoom, type } = this.getTypeAndZoom();
      data.forEach((item) => {
        // 创建覆盖物
        this.createOverlays(item, nextZoom, type);
      });
    } catch (e) {
      Toast.hide();
    }
  }
  // 计算要绘制的覆盖物类型和下一个缩放级别
  // 区   -> 11 ，范围：>=10 <12
  // 镇   -> 13 ，范围：>=12 <14
  // 小区 -> 15 ，范围：>=14 <16
  getTypeAndZoom() {
    // 调用地图的 getZoom() 方法，来获取当前缩放级别
    const zoom = this.map.getZoom();
    let nextZoom, type;
    if (zoom >= 10 && zoom < 12) {
      nextZoom = 13;
      type = "circle";
    } else if (zoom >= 12 && zoom < 14) {
      nextZoom = 15;
      type = "circle";
    } else if (zoom >= 14 && zoom < 16) {
      type = "rect";
    }
    return {
      nextZoom,
      type,
    };
  }

  createOverlays(data, zoom, type) {
    const {
      coord: { latitude, longitude },
      label: areaName,
      count,
      value,
    } = data;

    const areaPoint = new BMapGL.Point(longitude, latitude);
    if (type === "circle") {
      this.createCircle(areaPoint, areaName, count, value, zoom);
    } else {
      this.createRect(areaPoint, areaName, count, value);
    }
  }
  // 创建区、镇覆盖物
  createCircle(point, areaName, count, id, zoom) {
    var opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new BMapGL.Size(-35, -35), // 设置文本偏移量
    };
    // 创建覆盖物
    const label = new BMapGL.Label("", opts);

    // 设置房源覆盖物内容
    label.setContent(`
       <div class="${styles.bubble}">
         <p class="${styles.name}">${areaName}</p>
         <p>${count}套</p>
       </div>
     `);

    // 设置样式
    label.setStyle(labelStyle);
    label.addEventListener("click", () => {
      this.renderOverlays(id);
      this.map.centerAndZoom(point, zoom);
      setTimeout(() => {
        // 清除当前覆盖物信息
        this.map.clearOverlays();
      }, 0);
    });
    this.map.addOverlay(label);
  }

  // 创建小区覆盖物
  createRect(point, areaName, count, id) {
    var opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new BMapGL.Size(-50, -28), // 设置文本偏移量
    };
    // 创建覆盖物
    const label = new BMapGL.Label("", opts);

    // 设置房源覆盖物内容
    label.setContent(`
      <div class="${styles.rect}">
        <span class="${styles.housename}">${areaName}</span>
        <span class="${styles.housenum}">${count}套</span>
        <i class="${styles.arrow}"></i>
      </div>
     `);

    // 设置样式
    label.setStyle(labelStyle);
    label.addEventListener("click", (e) => {
      this.getHousesList(id);
    });
    this.map.addOverlay(label);
  }
  // 获取小区房源数据
  async getHousesList(id) {
    try {
      Toast.loading("加载中", 0, null, false);
      const res = await API.get(`/houses?cityId=${id}`);
      Toast.hide();
      this.setState({
        housesList: res.data.body.list,
        // 展示房源列表
        isShowList: true,
      });
    } catch (e) {
      Toast.hide();
    }
  }
  // 渲染房源列表
  renderHousesList() {
    return this.state.housesList.map((item) => (
      <div className={styles.house} key={item.houseCode}>
        <div className={styles.imgWrap}>
          <img
            className={styles.img}
            src={`http://localhost:8080${item.houseImg}`}
            alt=""
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{item.title}</h3>
          <div className={styles.desc}>{item.desc}</div>
          <div>
            {item.tags.map((tag, index) => {
              const classTag = tag + (index + 1);
              return (
                <span
                  className={[styles.tag, styles[classTag]].join(" ")}
                  key={tag}
                >
                  {tag}
                </span>
              );
            })}
          </div>
          <div className={styles.price}>
            <span className={styles.priceNum}>{item.price}</span> 元/月
          </div>
        </div>
      </div>
    ));
  }
  render() {
    return (
      <div className={styles.map}>
        <NavHeader>地图找房</NavHeader>
        <div id="container" className={styles.container}></div>
        {/* 房源列表 */}
        {/* 添加 styles.show 展示房屋列表 */}
        <div
          className={[
            styles.houseList,
            this.state.isShowList ? styles.show : "",
          ].join(" ")}
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <Link className={styles.titleMore} to="/home/list">
              更多房源
            </Link>
          </div>

          <div className={styles.houseItems}>
            {/* 房屋结构 */}
            {this.renderHousesList()}
          </div>
        </div>
      </div>
    );
  }
}
