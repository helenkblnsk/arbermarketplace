import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAIL,
  AUTH_RESET_STATE,

  AUTH_REGESTRATION_SUCCESS,
  NOTIFICATION_SHOW,

  REGISTER_DEVICE_REQUEST,
  REGISTER_DEVICE_SUCCESS,
  REGISTER_DEVICE_FAIL,

  FETCH_PROFILE_FIELDS_REQUEST,
  FETCH_PROFILE_FIELDS_SUCCESS,
  FETCH_PROFILE_FIELDS_FAIL,

  AUTH_LOGOUT,
} from '../constants';
import Api from '../services/api';
import i18n from '../utils/i18n';
import store from '../store';

import * as cartActions from './cartActions';
import * as wishListActions from './wishListActions';

export function profileFields(data = {}, cb = () => {}) {
  const sl = DeviceInfo.getDeviceLocale().split('-')[0];
  const params = {
    location: 'profile',
    action: 'add',
    lang_code: sl,
    ...data,
  };

  return (dispatch) => {
    dispatch({ type: FETCH_PROFILE_FIELDS_REQUEST });
    return Api.get('/sra_profile_fields', { params })
      .then((response) => {
        cb(response.data);
        dispatch({
          type: FETCH_PROFILE_FIELDS_SUCCESS,
          payload: {
            ...data,
            ...response.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: FETCH_PROFILE_FIELDS_FAIL,
          payload: error,
        });
      });
  };
}

export function deviceInfo(data) {
  return (dispatch) => {
    dispatch({ type: REGISTER_DEVICE_REQUEST });
    return Api.post('/sra_notifications', data)
      .then((response) => {
        dispatch({
          type: REGISTER_DEVICE_SUCCESS,
          payload: {
            ...data,
            ...response.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: REGISTER_DEVICE_FAIL,
          payload: error,
        });
      });
  };
}

export function login(data) {
  return (dispatch) => {
    dispatch({ type: AUTH_LOGIN_REQUEST });

    return Api.post('/auth_tokens', data)
      .then((response) => {
        cartActions.fetch(false)(dispatch);
        wishListActions.fetch(false)(dispatch);
        dispatch({
          type: AUTH_LOGIN_SUCCESS,
          payload: response.data,
        });

        // Delay send refresh token.
        setTimeout(() => {
          const { auth } = store.getState();
          deviceInfo({
            token: auth.deviceToken,
            platform: Platform.OS,
            locale: DeviceInfo.getDeviceLocale(),
            device_id: DeviceInfo.getUniqueID(),
          })(dispatch);
        }, 1000);
      })
      .catch((error) => {
        dispatch({
          type: AUTH_LOGIN_FAIL,
          payload: error.response.data,
        });
      });
  };
}

export function registration(token) {
  return (dispatch) => {
    dispatch({
      type: AUTH_REGESTRATION_SUCCESS,
      payload: {
        token,
        ttl: null,
      }
    });
    cartActions.fetch(false)(dispatch);
    dispatch({
      type: NOTIFICATION_SHOW,
      payload: {
        type: 'success',
        title: i18n.gettext('Registration'),
        text: i18n.gettext('Registration complete.'),
        closeLastModal: true,
      },
    });
  };
}

export function logout() {
  return (dispatch) => {
    dispatch({
      type: AUTH_LOGOUT,
    });
  };
}

export function resetState() {
  return dispatch => dispatch({ type: AUTH_RESET_STATE });
}
