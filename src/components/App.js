import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Inventory from './Inventory';
import Order from './Order';
import Fish from "./Fish";
import Base from '../base';
import sampleFishes from '../sample-fishes';

class App extends React.Component {
  constructor () {
    super();
    this.loadSamples = this.loadSamples.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
    this.removeOrder = this.removeOrder.bind(this);
    this.updateFish = this.updateFish.bind(this);
    this.removeFish = this.removeFish.bind(this);
    this.state = {
      fishes: {},
      order: {}
    };
  }

  componentWillMount() {
    this.ref = Base.syncState(`${this.props.params.storeId}/fishes`, {
      context: this,
      state: 'fishes'
    });

    const orderRef = localStorage.getItem(`order-${this.props.params.storeId}`);
    if (orderRef) {
      this.setState({order: JSON.parse(orderRef)});
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.order !== nextState.order) {
      localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
    }
  }

  componentWillUnmount() {
    Base.removeBinding(this.ref);
  }

  addFish(fish) {
    const fishes = this.state.fishes;
    const timestamp = Date.now();
    fishes[`fish-${timestamp}`] = fish;
    this.setState({fishes});
  }

  updateFish(key, updatedFish) {
    const fishes = this.state.fishes;
    fishes[key] = updatedFish;
    this.setState({fishes});
  }

  removeFish(key) {
    const fishes = this.state.fishes;
    fishes[key] = null;
    this.setState({fishes});
  }

  addToOrder(key) {
    const order = {...this.state.order};
    order[key] = order[key] + 1 || 1;
    this.setState({order});
  }

  removeOrder(key) {
    const order = {...this.state.order};
    delete order[key];
    this.setState({order});
  }

  loadSamples() {
    this.setState({fishes: sampleFishes})
  }

  render() {
    const {fishes, order} = this.state;
    const renderFishes = Object.keys(fishes).map(key => {
      return <Fish addToOrder={() => this.addToOrder(key)} key={key} fish={fishes[key]}/>;
    });
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="list-of-fish">{renderFishes}</ul>
        </div>
        <Order fishes={fishes} order={order} removeOrder={this.removeOrder} />
        <Inventory
          addFish={this.addFish.bind(this)} fishes={fishes}
          loadSamples={this.loadSamples}
          updateFish={this.updateFish}
          removeFish={this.removeFish}
          storeId={this.props.params.storeId}
        />
      </div>
    );
  }
}

App.propTypes = {
  params: PropTypes.object.isRequired
};
App.defaultProps = {};

export default App;

