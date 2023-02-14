import { createContext, useReducer } from 'react';

/*Create React Context*/
export const Store = createContext();

const initialState = {
  //inital value for user info
  //we need to check the local storage
  userInfo: localStorage.getItem('userInfo') //check the local storage for userInfo
    ? JSON.parse(localStorage.getItem('userInfo')) //if it does exist use JSON.parse to convert userInfo string to a javascript object
    : null, //if it doesn't exist set it to null

  cart: {
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '',
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      //Add to cart
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      //save the items on the cart in the local storage so when we refreshing the page the items will still be there
      //first parameter is the key in the local storage, second parameter is the string value to save in this key
      // JSON.stringify=> convert the cartItems array to a string
      localStorage.setItem('cartItems', JSON.stringify(cartItems));

      return { ...state, cart: { ...state.cart, cartItems } };

    case 'CART_REMOVE_ITEM': {
      //filter out the cartItems array
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    //here we keep the state of the context, also keep the state of cart. and we change the cartItems to an empty array
    case 'CART_CLEAR':
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload }; //we return- keeping the previos state and add the userInfo property to it (based on the data we get from backend)
    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null, //previos state and set userInfo to null
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: '',
        },
      };
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
