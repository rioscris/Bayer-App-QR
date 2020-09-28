/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import Navigation from './navigation/navigation';
import { Provider } from 'react-redux';
import configureStore from './storeConfig/configureStore';
import useZPLFile from './components/editor/hooks/useZPLFile'

let store = configureStore();

const App = (props) => {
  const fileMgr = useZPLFile();

  useEffect(() => {
    fileMgr.initFile();
  })
  
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
};

export default App;
