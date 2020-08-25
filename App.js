/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import Navigation from './navigation/navigation';
import { Provider } from 'react-redux';
import configureStore from './storeConfig/configureStore';

let store = configureStore();

const App = (props) => {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
};

export default App;
