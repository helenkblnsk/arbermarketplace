import { get } from 'lodash';
import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAIL,
  AUTH_RESET_STATE,
  AUTH_LOGOUT,
  AUTH_REGESTRATION_SUCCESS,
  REGISTER_DEVICE_SUCCESS,
  RESTORE_STATE,
} from '../constants';

import { AuthState, AuthLoginRequestAction } from './authTypes';

const initialState: AuthState = {
  token: '',
  ttl: 0,
  logged: false,
  uuid: '',
  fetching: false,
  error: '',
  errorStatus: 0,
  deviceToken: '',
  profile_id: '',
  user_id: 0,
};

export default function (state = initialState, action: AuthLoginRequestAction) {
  switch (action.type) {
    case AUTH_LOGIN_REQUEST:
      return {
        ...state,
        fetching: true,
        error: null,
        errorStatus: null,
      };

    case AUTH_LOGIN_SUCCESS:
    case AUTH_REGESTRATION_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        ttl: action.payload.ttl,
        logged: true,
        fetching: false,
        error: null,
        errorStatus: null,
      };

    case AUTH_LOGIN_FAIL:
      return {
        ...state,
        fetching: false,
        error: action.payload.message,
        errorStatus: action.payload.status,
      };

    case REGISTER_DEVICE_SUCCESS:
      return {
        ...state,
        deviceToken: action.payload.token,
      };

    case AUTH_RESET_STATE:
    case AUTH_LOGOUT:
      return initialState;

    case RESTORE_STATE:
      return {
        ...state,
        ...action.payload.auth,
        uuid: get(action.payload, 'auth.uuid', null)
          ? action.payload.auth.uuid
          : (+new Date()).toString(16),
      };

    default:
      return state;
  }
}
