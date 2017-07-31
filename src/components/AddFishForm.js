import React from 'react';
import PropTypes from "prop-types";

class AddFishForm extends React.Component {
  createFish(e) {
    e.preventDefault();
    const fish = {
      name: this.formInput.name.value,
      price: this.formInput.price.value,
      status: this.formInput.status.value,
      desc: this.formInput.desc.value,
      image: this.formInput.image.value
    };
    this.props.addFish(fish);
    this.formInput.reset();
  }

  render() {
    return (
      <form ref={(i) => this.formInput = i} className="fish-edit" onSubmit={this.createFish.bind(this)}>
        <input name="name" type="text" placeholder="Fish Name"/>
        <input name="price" type="text" placeholder="Fish Price"/>
        <select name="status" >
          <option value="available">Fresh !</option>
          <option value="unavailable">Sold Out</option>
        </select>
        <textarea name="desc" placeholder="Fish Descriptions"/>
        <input name="image" type="text" placeholder="Fish Image"/>
        <button type="submit">Add Item</button>
      </form>
    );
  }
}

AddFishForm.propTypes = {
  addFish: PropTypes.func.isRequired
};

export default AddFishForm;
