import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { URL } from '../constants';
import { updateFavorite } from '../actions';
import { getUserInfo, getFavoriteById, getFavoriteList } from '../redux/selectors';

const EditeFavorite = ({
  match, updateFavorite, favoriteData, userData,
}) => {
  const { id } = match.params;
  const details = getFavoriteById(favoriteData, id);
  const [favorite, setFavorite] = useState({ name: details.name, priority: details.priority });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const handleChange = e => {
    const { name, value } = e.target;
    setFavorite({ ...favorite, [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (favorite.name && favorite.priority) {
      updateFavorite(id, `${URL.BASE}${URL.FAVORITES}`, userData.user.auth_token, favorite);
      setSuccess(prevState => `${prevState} Edit with success`);
    } else {
      setError(prevState => `${prevState} Name should not empty`);
    }
  };

  return (
    <main className="main-sign">
      {error && <h2>{error}</h2>}
      {success && (
      <h2>
        {success}
        {' '}
        <Redirect to="/favorite" />
      </h2>
      )}
      <div className="row-wrap">
        {userData.loading && <h2 className="info">Loading</h2>}
        {!userData.user.auth_token && !userData && <Redirect to="/" /> }
      </div>
      <p className="sign" align="center">Edit favorite</p>
      <form className="form1">
        <input
          type="text"
          id="name"
          name="name"
          value={favorite.name}
          onChange={handleChange}
          className="un"
        />

        <select name="priority" id="priority" className="un" value={favorite.priority} onChange={handleChange}>
          <option value={1}>
            Low
          </option>
          <option value={2}>
            Medium
          </option>
          <option value={3}>
            High
          </option>
        </select>

        <div className="center">
          <button type="submit" className="btn" onClick={handleSubmit}>
            Edit
          </button>
        </div>
      </form>
    </main>
  );
};

EditeFavorite.propTypes = {
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  userData: PropTypes.oneOfType([PropTypes.object]).isRequired,
  favoriteData: PropTypes.oneOfType([PropTypes.object]).isRequired,
  updateFavorite: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  const userData = getUserInfo(state);
  const favoriteData = getFavoriteList(state);
  return { userData, favoriteData };
};

export default connect(
  mapStateToProps,
  { updateFavorite },
)(EditeFavorite);
