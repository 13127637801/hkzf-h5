import React from "react";
import { Carousel, Flex, Grid, WingBlank } from "antd-mobile";
import { getCurrentCity } from "../../utils";

import SearchHeader from "../../components/SearchHeader";

// 导入axios
import axios from "axios";

import Nav1 from "../../assets/images/nav-1.png";
import Nav2 from "../../assets/images/nav-2.png";
import Nav3 from "../../assets/images/nav-3.png";
import Nav4 from "../../assets/images/nav-4.png";
import "./index.scss";

// 导航菜单数据
const navs = [
  {
    id: 1,
    img: Nav1,
    title: "整租",
    path: "/home/list",
  },
  {
    id: 2,
    img: Nav2,
    title: "合租",
    path: "/home/list",
  },
  {
    id: 3,
    img: Nav3,
    title: "地图找房",
    path: "/map",
  },
  {
    id: 4,
    img: Nav4,
    title: "去出租",
    path: "/rent/add",
  },
];

export default class Index extends React.Component {
  state = {
    swipers: [],
    isSwiperLoaded: false,
    // 租房小组数据
    groups: [],
    // 最新资讯
    news: [],
    // 当前城市名称
    curCityName: "上海",
  };
  // 获取轮播图数据
  async getWipers() {
    const res = await axios.get("http://localhost:8080/home/swiper");
    this.setState({
      swipers: res.data.body,
      isSwiperLoaded: true,
    });
  }
  // 获取租房小组数据
  async getGroups() {
    const res = await axios.get("http://localhost:8080/home/groups", {
      params: {
        area: "AREA%7C88cff55c-aaa4-e2e0",
      },
    });

    this.setState({
      groups: res.data.body,
    });
  }
  // 获取最新资讯数据
  async getNews() {
    const res = await axios.get("http://localhost:8080/home/news", {
      params: {
        area: "AREA|88cff55c-aaa4-e2e0",
      },
    });
    this.setState({
      news: res.data.body,
    });
  }

  async componentDidMount() {
    this.getWipers();
    this.getGroups();
    this.getNews();
    const curCity = await getCurrentCity();
    this.setState({
      curCityName: curCity.label,
    });
  }
  renderSwipers() {
    return this.state.swipers.map((item) => (
      <a
        key={item.id}
        href="http://www.baidu.com"
        style={{
          display: "inline-block",
          width: "100%",
          height: 212,
        }}
      >
        <img
          src={`http://localhost:8080${item.imgSrc}`}
          alt=""
          style={{ width: "100%", verticalAlign: "top" }}
        />
      </a>
    ));
  }
  renderNavs() {
    return navs.map((item) => (
      <Flex.Item
        key={item.id}
        onClick={() => this.props.history.push(item.path)}
      >
        <img src={item.img} alt="" />
        <h2>{item.title}</h2>
      </Flex.Item>
    ));
  }

  renderNews() {
    return this.state.news.map((item) => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={`http://localhost:8080${item.imgSrc}`}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ));
  }

  render() {
    return (
      <div className="index">
        <div className="swiper">
          {/* 轮播图 */}
          {this.state.isSwiperLoaded ? (
            <Carousel autoplay infinite>
              {this.renderSwipers()}
            </Carousel>
          ) : (
            ""
          )}

          {/* 搜索框 */}
          <SearchHeader cityName={this.state.curCityName}></SearchHeader>
        </div>

        <Flex className="nav">{this.renderNavs()}</Flex>

        <div className="group">
          <h3 className="group-title">
            租房小组 <span className="more">更多</span>
          </h3>
          {/* 宫格组件 */}
          <Grid
            data={this.state.groups}
            columnNum={2}
            square={false}
            hasLine={false}
            renderItem={(item) => (
              <Flex className="group-item" justify="around" key={item.id}>
                <div className="desc">
                  <p className="title">{item.title}</p>
                  <span className="info">{item.desc}</span>
                </div>
                <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
              </Flex>
            )}
          />
        </div>
        {/* 最新资讯 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    );
  }
}
