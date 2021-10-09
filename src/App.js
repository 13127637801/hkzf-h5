import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home";
import CityList from "./pages/CityList";
import Map from "./pages/Map";
// 房源详情组件
import HouseDetail from './pages/HouseDetail';
// 登录
import Login from './pages/Login'
import Registe from './pages/Registe'

// 房源发布
import Rent from './pages/Rent'
import RentAdd from './pages/Rent/Add'
import RentSearch from './pages/Rent/Search'

import AuthRoute from './components/AuthRoute'

function App() {
  return (
    <Router>
      <div className="App">
        {/* 默认路由 */}
        <Route exact path="/" render={() => <Redirect to="/home" />} />

        <Route path="/home" component={Home} />
        <Route path="/citylist" component={CityList} />
        <AuthRoute path="/Map" component={Map} />
        <Route path="/detail/:id" component={HouseDetail} />

        <Route path="/login" component={Login} />
        <Route path="/registe" component={Registe} />
        
        {/* 配置登录后，才能访问的页面 */}
        <AuthRoute exact path="/rent" component={Rent} />
        <AuthRoute path="/rent/add" component={RentAdd} />
        <AuthRoute path="/rent/search" component={RentSearch} />
      </div>
    </Router>
  );
}

export default App;
