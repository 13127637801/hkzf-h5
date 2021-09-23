import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home";
import CityList from "./pages/CityList";
import Map from "./pages/Map";

function App() {
  return (
    <Router>
      <div className="App">
        {/* 默认路由 */}
        <Route exact path="/" render={() => <Redirect to="/home" />} />

        <Route path="/home" component={Home} />
        <Route path="/citylist" component={CityList} />
        <Route path="/Map" component={Map} />
      </div>
    </Router>
  );
}

export default App;
