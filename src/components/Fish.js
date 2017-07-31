import React from 'react';
import PropTypes from 'prop-types';
import {formatPrice} from '../helpers';

class Fish extends React.Component {
  render() {
    const {fish, addToOrder} = this.props;
    const isAvailable = fish.status === 'available';
    const buttonText = isAvailable ? 'Add To Order' : 'Sold Out!';
    return (
      <li className="menu-fish">
        <img src={fish.image} alt={fish.name}/>
        <h3 className="fish-name">
          {fish.name}
          <span className="price">{formatPrice(fish.price)}</span>
        </h3>
        <p>{fish.desc}</p>
        <button onClick={addToOrder} disabled={!isAvailable}>{buttonText}</button>
      </li>
    );
  }
}

Fish.propTypes = {
  fish: PropTypes.object.isRequired,
  addToOrder: PropTypes.func.isRequired
};

export default Fish;
