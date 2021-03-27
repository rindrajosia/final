/* eslint-disable max-len */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { imgCheck } from '../logic/checkImg';
import { URL, CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_UPLOAD_URL } from '../constants';
import { updateProduct } from '../actions';
import {
  getUserInfo, getCategoriesList, getProductById, getProductList,
} from '../redux/selectors';

const EditeProduct = ({
  match, updateProduct, productData, userData, categoriesData,
}) => {
  const { id } = match.params;
  const details = getProductById(productData, id);
  const [success, setSuccess] = useState('');
  const [product, setProduct] = useState({
    title: details.title, description: details.description, category_id: details.category_id, imageurl: details.imageurl,
  });
  const [error, setError] = useState('');
  const handleChange = e => {
    const { name, value } = e.target;
    if (name !== 'imageurl') {
      setProduct({ ...product, [name]: value });
    } else {
      setProduct({ ...product, [name]: e.target.files[0] });
    }
  };

  const handleImageUpload = file => {
    const data = { ...product };
    if (file !== details.imageurl) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(response => {
          if (response.secure_url !== '') {
            data.imageurl = response.secure_url;
            updateProduct(id, `${URL.BASE}${URL.PRODUCTS}`, userData.user.auth_token, data);
            setSuccess(prevState => `${prevState} Update with success`);
          }
        })
        .catch(err => {
          setError(prevState => `${prevState} ${err}`);
        });
    } else {
      data.imageurl = product.imageurl;
      console.log(data);
      updateProduct(id, `${URL.BASE}${URL.PRODUCTS}`, userData.user.auth_token, data);
      setSuccess(prevState => `${prevState} Update with success`);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (product.title && product.description && product.category_id && product.imageurl) {
      if (((product.imageurl !== details.imageurl) && !imgCheck(product.imageurl.name)) || product.title.length < 10 || product.description.length < 10) {
        console.log(product);
        console.log(details.imageurl);
        setError(prevState => `${prevState}  Not an image or title and desription length < 10 `);
      } else {
        handleImageUpload(product.imageurl);
      }
    }
  };

  return (
    <main className="main-edit">
      {error && <h5 className="center">{error}</h5>}
      {success && (
      <h2>
        {success}
        {' '}
        <Redirect to="/products" />
      </h2>
      )}
      <div className="center">
        <img src={details.imageurl} className="img-edit" alt="product" />
      </div>
      <p className="sign" align="center">Edit product</p>
      <form className="form1">
        <input
          type="text"
          id="title"
          name="title"
          value={product.title}
          onChange={handleChange}
          placeholder="title"
          className="un"
        />

        <textarea
          id="description"
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="description"
          className="pass"
        />

        <select name="category_id" className="un" id="category" value={product.category_id} onChange={handleChange}>
          {categoriesData.categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <input name="imageurl" className="un" onChange={handleChange} type="file" multiple={false} accept="/images/*" />

        <div className="center">
          <button type="submit" className="btn" onClick={handleSubmit}>
            Edit
          </button>
        </div>
      </form>
    </main>
  );
};

EditeProduct.propTypes = {
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  userData: PropTypes.oneOfType([PropTypes.object]).isRequired,
  categoriesData: PropTypes.oneOfType([PropTypes.object]).isRequired,
  productData: PropTypes.oneOfType([PropTypes.object]).isRequired,
  updateProduct: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  const userData = getUserInfo(state);
  const categoriesData = getCategoriesList(state);
  const productData = getProductList(state);
  return { userData, categoriesData, productData };
};

export default connect(
  mapStateToProps,
  { updateProduct },
)(EditeProduct);

/* eslint-enable max-len */
