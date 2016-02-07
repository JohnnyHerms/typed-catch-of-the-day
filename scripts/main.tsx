import * as React from "react";
import { render } from "react-dom";

import { createHistory } from "history";
import { Router, Route } from "react-router";

// Import Components
import {NotFound} from "./components/NotFound";
import {StorePicker} from "./components/StorePicker";
import {Header} from "./components/Header";
import {Fish} from "./components/Fish";
import {Order} from "./components/Order";
import {UpdateFishForm} from "./components/UpdateFishForm";
import {AddFishForm} from "./components/AddFishForm";
import {Inventory} from "./components/Inventory";

// Import Interfaces
import {FishDataProps, FishObject, OrderProps, UpdateFishProps, InventoryProps} from "./interfaces";

// Stylus
import "../css/style.styl";

/**
 * App container
 */
class App extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      fishes: {},
      order: {}
    };
  };

  componentDidMount() {
    this.loadOrderData();
    this.loadFishesData();
  };

  componentWillUpdate(nextProps, nextState) {
    this.storeOrderData(nextState.order);
    this.storeFishesData(nextState.fishes);
  };

  private storeOrderData = (data: Object) => {
    let order = JSON.stringify(data);
    localStorage.setItem("order-" + this.props.params.storeId, order);
  };

  private loadOrderData = () => {
    let storeRefOrder: string = localStorage.getItem("order-" + this.props.params.storeId);

    if(storeRefOrder) {
      this.setState({"order": JSON.parse(storeRefOrder)});
    }
  };

  private storeFishesData = (data: Object) => {
    let fishes = JSON.stringify(data);
    localStorage.setItem("fishes-" + this.props.params.storeId, fishes);
  };

  private loadFishesData = () => {
    let storeRefFishes: string = localStorage.getItem("fishes-" + this.props.params.storeId);

    if(storeRefFishes) {
      this.setState({"fishes": JSON.parse(storeRefFishes)});
    }
  };

  public removeFish = (key: string) => {
    if(confirm("Are you sure you wish to remove fish?")) {
      delete this.state.fishes[key];
      this.setState({fishes: this.state.fishes});
    }
  };

  public removeFromOrder = (key: string) => {
    delete this.state.order[key];
    this.setState({ order: this.state.order });
  };

  public addFish = (fish: FishObject) => {
    let timestamp = (new Date()).getTime();
    this.state.fishes["fish-" + timestamp] = fish;
    this.setState({fishes: this.state.fishes});
  };

  public updateFish = (key: string, attr: string, value: string | number) => {
    this.state.fishes[key][attr] = value;
    this.setState({fishes: this.state.fishes});
  };

  public loadSamples = () => {
    this.setState({
      fishes: require("./sample-fishes")
    });
  };

  public renderFish = (key: any) => {
    let fishData: FishDataProps = {
      key: key,
      index: key,
      details: this.state.fishes[key],
      addToOrder: this.addToOrder
    };
    return <Fish {...fishData}/>;
  };

  public addToOrder = (key: number) => {
    this.state.order[key] = this.state.order[key] + 1 || 1;
    this.setState({ order: this.state.order });
  };

  render() {
    let orderProps: OrderProps = {
      fishes: this.state.fishes,
      order: this.state.order,
      removeFromOrder: this.removeFromOrder
    };
    let inventoryProps: InventoryProps = {
      addFish: this.addFish,
      loadSamples: this.loadSamples,
      fishes: this.state.fishes,
      updateFish: this.updateFish,
      removeFish: this.removeFish
    };
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="list-of-fishes">
            {Object.keys(this.state.fishes).map(this.renderFish)}
          </ul>
        </div>
        <Order {...orderProps}/>
        <Inventory {...inventoryProps}/>
      </div>
    );
  }
}

/**
 * Routes
 */
var routes = (
  <Router history={createHistory()}>
    <Route path="/" component={StorePicker}/>
    <Route path="/store/:storeId" component={App}/>
    <Route path="*" component={NotFound}/>
  </Router>
);

render(routes, document.getElementById("main"));