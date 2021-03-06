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
import Editor from '../components/editor/editor';

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
                <Stack.Screen name="Menu" component={Home} />
                <Stack.Screen name="Configuración" component={Settings} />
                <Stack.Screen name="Escanear" component={BarcodeScanner} />
                <Stack.Screen name="Visualización" component={Preview} />
                <Stack.Screen name="Manual" component={Manual} />
                <Stack.Screen name="Editor" component={Editor} />
                <Stack.Screen name="Verificación" component={Verify} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation;