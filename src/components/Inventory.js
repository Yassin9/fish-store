import React from 'react';
import PropTypes from 'prop-types';
import AddFishForm from './AddFishForm';
import Base from '../base';

class Inventory extends React.Component {
  constructor () {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.renderInventory = this.renderInventory.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.authHandler = this.authHandler.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      uid: null,
      owner: null
    };
  }

  componentWillMount() {
    Base.onAuth((user) => {
      if (user) {
        this.authHandler(null, {user})
      }
    });
  }

  authenticate(provider) {
    Base.authWithOAuthPopup(provider, this.authHandler);
  }

  authHandler(err, authData) {
    if (err) {
      console.error(err);
      return;
    }

    const storeRef = Base.database().ref(this.props.storeId);
    storeRef.once('value', (snapshot) => {
      const data = snapshot.val() || {};

      const uid = authData.user.uid;
      const owner = data.owner;

      if (!owner) {
        storeRef.set({
          owner: uid
        });
      }

      this.setState({
        owner: owner || uid,
        uid: uid
      });
    });
  }

  logout() {
    Base.unauth();
    this.setState({uid: null});
  }

  handleChange(e, key) {
    const fish = this.props.fishes[key];
    const updatedFish = {...fish, [e.target.name]: e.target.value};
    this.props.updateFish(key, updatedFish);
  }

  renderLogin() {
    return (
      <nav>
        <h2>login</h2>
        <button className="github" onClick={() => this.authenticate('github')}>Login to Github</button>
        <button className="facebook" onClick={() => this.authenticate('facebook')}>Login to Facebook</button>
        <button className="twitter" onClick={() => this.authenticate('twitter')}>Login to Twitter</button>
      </nav>
    );
  }

  renderInventory(key) {
    const fish = this.props.fishes[key];
    return (
      <div className="fish-edit" key={key}>
        <input onChange={(e) => this.handleChange(e, key)} value={fish.name} name="name" type="text" placeholder="Fish Name"/>
        <input onChange={(e) => this.handleChange(e, key)} value={fish.price} name="price" type="text" placeholder="Fish Price"/>
        <select onChange={(e) => this.handleChange(e, key)} value={fish.status} name="status" >
          <option value="available">Fresh !</option>
          <option value="unavailable">Sold Out</option>
        </select>
        <textarea onChange={(e) => this.handleChange(e, key)} value={fish.desc} name="desc" placeholder="Fish Descriptions"/>
        <input onChange={(e) => this.handleChange(e, key)} value={fish.image} name="image" type="text" placeholder="Fish Image"/>
        <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
      </div>
    );
  }

  render() {
    const {addFish, loadSamples, fishes} = this.props;
    const {uid, owner} = this.state;

    const logoutButton = <button onClick={this.logout}>Log Out!</button>;

    if (!uid) {
      return <div>{this.renderLogin()}</div>;
    }

    if (uid !== owner) {
      return <div>{logoutButton}<p>Sorry you aren't the owner of this store!</p></div>
    }

    return (
      <div>
        <h2>Inventory</h2>
        {logoutButton}
        {Object.keys(fishes).map(this.renderInventory)}
        <AddFishForm addFish={addFish}/>
        <button onClick={loadSamples}>Load Samples</button>
      </div>
    );
  }
}

Inventory.propTypes = {
  fishes: PropTypes.object.isRequired,
  addFish: PropTypes.func.isRequired,
  updateFish: PropTypes.func.isRequired,
  removeFish: PropTypes.func.isRequired,
  loadSamples: PropTypes.func
};

export default Inventory;
