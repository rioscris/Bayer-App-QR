import 'react-native-gesture-handler';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Settings from '../components/settings/settings'
import Home from '../components/home/Home'
import BarcodeScanner from '../components/scanner/barcode/barcodeScanner'
import Preview from '../components/preview/preview';
import Manual from '../components/manual/manual';
import Verify from '../components/verify/verify';

const Stack = createStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#38A6E3',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Configuracion" component={Settings} />
                <Stack.Screen name="Scanner" component={BarcodeScanner} />
                <Stack.Screen name="Preview" component={Preview} />
                <Stack.Screen name="Manual" component={Manual} />
                <Stack.Screen name="Verify" component={Verify} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation;