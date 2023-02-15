import { createContext, useReducer } from 'react';

/*React Context comes from React*/
export const Store = createContext();

//define initial state for Store.Provider
//inital value for user info
const initialState = {
  //check the local storage for userInfo (after sign in userInfo exist)
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
    //Add to cart
    case 'CART_ADD_ITEM':
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

    //Remove from cart
    case 'CART_REMOVE_ITEM': {
      //filter out the cartItems array
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    //lear the cart (after placing the order)
    //here we keep the state of the context, also keep the state of cart. and we change the cartItems to an empty array
    case 'CART_CLEAR':
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload }; //here we return- keeping the previos state and add the userInfo property to it (based on the data we get from backend)
    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null, //previos state and set userInfo to null
        cart: {
          //after signing out we want to clear the cart
          cartItems: [],
          shippingAddress: {},
          paymentMethod: '',
        },
      };
    //save the shipping address in the local storage
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    //save the payment method in the local storage
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

//StoreProvider is a component that will wrap the entire app, and pass global props to children
export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  //Store coming from createContext, and from Store object get Provider and set the value to the value we created (current state and dispatch to update state),
  //inside that render the children
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
