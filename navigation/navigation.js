import 'react-native-gesture-handler';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Settings from '../components/settings/settings'
import Home from '../home/Home'
import BarcodeScanner from '../components/scanner/barcodeScanner'

const Stack = createStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Configuracion" component={Settings} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Scanner" component={BarcodeScanner} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation;