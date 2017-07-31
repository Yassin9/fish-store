import React from 'react';
import PropTypes from 'prop-types';
import { getFunName } from '../helpers';

class StorePicker extends React.Component {
  goToStore(e) {
    e.preventDefault();
    this.context.router.transitionTo(`/store/${this.input.value}`);
  }

  render() {
    return (
      <form className="store-selector" onSubmit={this.goToStore.bind(this)}>
        <h2>Please Enter A Store</h2>
        <input type="text" required
               placeholder="Store Name"
               ref={(i) => this.input = i}
               defaultValue={getFunName()}/>
        <button type="submit">Visit Store</button>
      </form>
    );
  }
}

StorePicker.contextTypes = {
  router: PropTypes.object
};

export default StorePicker;
