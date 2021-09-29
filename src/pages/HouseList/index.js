import React from "react";

import { Flex } from "antd-mobile";
import { API } from "../../utils/api";
import { BASE_URL } from "../../utils/url";
import { getCurrentCity } from '../../utils'

import SearchHeader from "../../components/SearchHeader";
import Filter from "./components/Filter";
import Sticky from "../../components/Sticky";

import {
  List,
  AutoSizer,
  WindowScroller,
  InfiniteLoader,
} from "react-virtualized";
import HouseItem from "../../components/HouseItem";
// 导入样式
import styles from "./index.module.css";
import { concatFn } from "@react-spring/core/dist/declarations/src/helpers";

// 获取当前定位城市信息
// const { label, value } = JSON.parse(localStorage.getItem("hkzf_city"));

export default class HouseList extends React.Component {
  state = {
    // 列表数据
    list: [],
    // 总条数
    count: 0,
  };
  filters = {};
  // 初始化默认值
  label = ''
  value = ''
 async componentDidMount() {
    const {label, value } = await getCurrentCity();
    this.value = value;
    this.label = label;
    this.searchHouseList();
  }
  async searchHouseList() {
    const res = await API.get("/houses", {
      params: {
        cityId: this.value,
        ...this.filters,
        start: 1,
        end: 20,
      },
    });
    const { list, count } = res.data.body;

    this.setState({
      list,
      count,
    });
  }
  onFilter = (filters) => {
    window.scrollTo(0,0)
    this.filters = filters;
    this.searchHouseList();
  };

  renderHouseList = ({ key, index, style }) => {
    // 根据索引号来获取当前这一行的房屋数据
    const { list } = this.state;
    const house = list[index];
    // 如果不存在，就渲染 loading 元素占位
    if (!house) {
      return (
        <div key={key} style={style}>
          <p className={styles.loading} />
        </div>
      );
    }

    return (
      <HouseItem
        key={key}
        onClick={() => {this.props.history.push(`detail/${house.houseCode}`)}}
        style={style}
        src={BASE_URL + house.houseImg}
        title={house.title}
        desc={house.desc}
        tags={house.tags}
        price={house.price}
      />
    );
  };
  // 判断列表中的每一行是否加载完成
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index];
  };

  // 用来获取更多房屋列表数据
  // 注意：该方法的返回值是一个 Promise 对象，并且，这个对象应该在数据加载完成时，来调用 resolve 让Promise对象的状态变为已完成。
  loadMoreRows = ({ startIndex, stopIndex }) => {
    // return fetch(`path/to/api?startIndex=${startIndex}&stopIndex=${stopIndex}`)
    //   .then(response => {
    //     // Store response data in list...
    //   })
    console.log(startIndex, stopIndex);

    return new Promise(async (resolve, reject) => {
      // 数据加载完成时，调用 resolve 即可
      try {
        const res = await API.get("/houses", {
          params: {
            cityId: this.value,
            ...this.filters,
            start: startIndex,
            end: stopIndex,
          },
        });
        const { list } = res.data.body;

        this.setState({
          list: [...this.state.list, ...list],
        });
        resolve(res.data.body);
      } catch (e) {
        reject(e);
      }
    });
  };

  render() {
    const { count } = this.state;
    return (
      <div>
        <Flex className={styles.header}>
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.go(-1)}
          />
          <SearchHeader
            cityName={this.label}
            className={styles.searchHeader}
          ></SearchHeader>
        </Flex>
        {/* 条件筛选栏 */}

        <Sticky height={40}>
          <Filter onFilter={this.onFilter} />
        </Sticky>

        {/* 房屋列表 */}
        <div className={styles.houseItems}>
          <InfiniteLoader
            isRowLoaded={this.isRowLoaded}
            loadMoreRows={this.loadMoreRows}
            rowCount={count}
          >
            {({ onRowsRendered, registerChild }) => (
              <WindowScroller>
                {({ height, isScrolling, scrollTop }) => (
                  <AutoSizer>
                    {({ width }) => (
                      <List
                        onRowsRendered={onRowsRendered}
                        ref={registerChild}
                        autoHeight // 设置高度为 WindowScroller 最终渲染的列表高度
                        width={width} // 视口的宽度
                        height={height} // 视口的高度
                        rowCount={count} // List列表项的行数
                        rowHeight={120} // 每一行的高度
                        rowRenderer={this.renderHouseList} // 渲染列表项中的每一行
                        isScrolling={isScrolling}
                        scrollTop={scrollTop}
                      />
                    )}
                  </AutoSizer>
                )}
              </WindowScroller>
            )}
          </InfiniteLoader>
        </div>
      </div>
    );
  }
}
