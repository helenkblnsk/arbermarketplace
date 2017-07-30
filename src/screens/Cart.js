import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  View,
  Text,
  Alert,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/FontAwesome';
import Swipeout from 'react-native-swipeout';

// Import actions.
import * as cartActions from '../actions/cartActions';

// Components
import Spinner from '../components/Spinner';

// links
import { registerDrawerDeepLinks } from '../utils/deepLinks';

// Styles
const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBtn: {
    padding: 10,
  },
  trashIcon: {
    height: 20,
    fontSize: 20,
  },
  productItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
    paddingBottom: 10,
    flexDirection: 'row',
    padding: 14,
  },
  productItemImage: {
    width: 100,
    height: 100,
  },
  productItemName: {
    fontSize: '0.9rem',
    color: 'black',
    marginBottom: 5,
  },
  productItemPrice: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: 'black',
  },
  placeOrderBtn: {
    backgroundColor: '#FF6008',
    padding: 14,
  },
  placeOrderBtnText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: '1rem',
  },
  emptyListContainer: {
    marginTop: '3rem',
    flexDirection: 'column',
    alignItems: 'center',
  },
  emptyListIconWrapper: {
    backgroundColor: '#3FC9F6',
    width: '12rem',
    height: '12rem',
    borderRadius: '6rem',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListIcon: {
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: '6rem',
  },
  emptyListHeader: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: 'black',
    marginTop: '1rem',
  },
  emptyListDesc: {
    fontSize: '1rem',
    color: '#24282b',
    marginTop: '0.5rem',
  },
});

class Cart extends Component {
  static propTypes = {
    navigator: PropTypes.shape({
      push: PropTypes.func,
      setOnNavigatorEvent: PropTypes.func,
    }),
    cartActions: PropTypes.shape({
      fetch: PropTypes.func,
      clear: PropTypes.func,
      remove: PropTypes.func,
    }),
    auth: PropTypes.shape({}),
    cart: PropTypes.shape({}),
  };

  static navigatorStyle = {
    navBarBackgroundColor: '#FAFAFA',
    navBarButtonColor: '#989898',
  };

  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      products: [],
    };
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentDidMount() {
    const { navigator, cart } = this.props;
    navigator.setButtons({
      leftButtons: [
        {
          id: 'sideMenu',
          icon: require('../assets/icons/bars.png'),
        },
      ],
      rightButtons: [
        {
          id: 'clearCart',
          icon: require('../assets/icons/search.png'),
        },
      ],
    });
  }

  componentWillReceiveProps(nextProps) {
    const { cart } = nextProps;
    if (cart.fetching) {
      return;
    }
    const products = Object.keys(cart.products).map((key) => {
      const result = cart.products[key];
      result.cartId = key;
      return result;
    });
    this.setState({
      products,
      refreshing: false,
    });
  }

  onNavigatorEvent(event) {
    // handle a deep link
    registerDrawerDeepLinks(event, this.props.navigator);
    const { navigator } = this.props;
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'sideMenu') {
        navigator.toggleDrawer({ side: 'left' });
      } else if (event.id === 'clearCart') {
        Alert.alert(
          'Clear all cart ?',
          '',
          [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel'
            },
            {
              text: 'OK',
              onPress: () => this.props.cartActions.clear(),
            },
          ],
          { cancelable: true }
        );
      }
    }
  }

  handleRefresh() {
    const { cartActions, auth } = this.props;
    this.setState(
      { refreshing: true },
      () => cartActions.fetch(auth.token),
    );
  }

  handlePlaceOrder() {
    const { auth, navigator } = this.props;

    if (!auth.logged) {
      // return navigation.navigate('Login');
    }
    const products = {};
    this.state.products.forEach((p) => {
      products[p.product_id] = {
        product_id: p.product_id,
        amount: p.amount,
      };
    });
    // return navigation.navigate('Checkout', {
    //   user_id: 3, // FIXME
    //   products,
    // });
  }

  handleRemoveProduct = (product) => {
    const { cartActions, auth } = this.props;
    cartActions.remove(auth.token, product.cartId);
  };

  renderProductItem = (item) => {
    let productImage = null;
    if ('http_image_path' in item.main_pair.detailed) {
      productImage = (<Image
        source={{ uri: item.main_pair.detailed.http_image_path }}
        style={styles.productItemImage}
      />);
    }

    const swipeoutBtns = [
      {
        text: 'Delete',
        type: 'delete',
        onPress: () => this.handleRemoveProduct(item),
      },
    ];

    return (
      <Swipeout
        autoClose
        right={swipeoutBtns}
        backgroundColor={'#fff'}
      >
        <View style={styles.productItem}>
          {productImage}
          <View style={styles.productItemDetail}>
            <Text style={styles.productItemName}>
              {item.product}
            </Text>
            <Text style={styles.productItemPrice}>
              {item.amount} x ${item.price}
            </Text>
          </View>
        </View>
      </Swipeout>
    );
  }

  renderPlaceOrder() {
    const { cart } = this.props;
    return (
      <View style={styles.orderInfo}>
        <View>
          <Text>Subtotal: {cart.subtotal}</Text>
          <Text>Total: {cart.total}</Text>
        </View>
        <TouchableOpacity
          style={styles.placeOrderBtn}
          onPress={() => this.handlePlaceOrder()}
        >
          <Text style={styles.placeOrderBtnText}>
            Place Order
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderEmptyList = () => (
    <View style={styles.emptyListContainer}>
      <View style={styles.emptyListIconWrapper}>
        <Icon name="shopping-cart" style={styles.emptyListIcon} />
      </View>
      <Text style={styles.emptyListHeader}>
        Your shopping cart is empty.
      </Text>
      <Text style={styles.emptyListDesc}>
        Looking for ideas?
      </Text>
    </View>
  );

  renderList() {
    const { products } = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          data={products}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => this.renderProductItem(item)}
          onRefresh={() => this.handleRefresh()}
          refreshing={this.state.refreshing}
        />
        {this.renderPlaceOrder()}
      </View>
    );
  }

  renderSpinner = () => {
    const { cart } = this.props;
    if (this.state.refreshing) {
      return false;
    }
    return (
      <Spinner visible={cart.fetching} />
    );
  };

  render() {
    const { products } = this.state;
    return (
      <View style={styles.container}>
        {products.length ? this.renderList() : this.renderEmptyList()}
        {this.renderSpinner()}
      </View>
    );
  }
}

export default connect(state => ({
  auth: state.auth,
  cart: state.cart,
}),
  dispatch => ({
    cartActions: bindActionCreators(cartActions, dispatch),
  })
)(Cart);