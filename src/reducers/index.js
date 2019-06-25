import { combineReducers } from 'redux';

import cart from './cart';
import auth from './auth';
import pages from './pages';
import search from './search';
import orders from './orders';
import layouts from './layouts';
import vendors from './vendors';
import wishList from './wishList';
import products from './products';
import discussion from './discussion';
import notifications from './notifications';
import productDetail from './productDetail';
import vendorCategories from './vendorCategories';
import profile from './profile';

import vendorManageProducts from './vendorManage/products';

export default combineReducers({
  cart,
  auth,
  pages,
  search,
  orders,
  profile,
  layouts,
  vendors,
  wishList,
  products,
  discussion,
  notifications,
  productDetail,
  vendorCategories,

  vendorManageProducts,
});
