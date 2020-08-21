/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  NativeModules,
  Alert,
  Platform,
  ActivityIndicator,
  Flatlist
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
const zpl = "^XA^FX^CF0,60^FO220,50^FDHello world^FS^XZ";
const App: () => React$Node = () => {
  const [devices, setDeviceArray] = useState([]);
  const [loading, toggleLoading] = useState(false);
  const [deviceType, setDeviceType] = useState('');

  console.log(devices,loading,deviceType)
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Bienvenido a aplicación eLector</Text>
              <Text style={styles.sectionDescription}>
                Con esta aplicación podrá leer los códigos de barra de una etiqueta e imprimir los códigos QR correspondientes.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Impresión</Text>
              <Text style={styles.sectionDescription}>
                Las etiquetas saldran por vía Bluetooth a una impresora portatil.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Validación</Text>
              <Text style={styles.sectionDescription}>
                La aplicación permite leer el código QR generado, los códigos de barra de la etiqueta original y compararlos para verificar que se corresponden según la nomenclatura GS1.
              </Text>
            </View>
          </View>
          <View style={{padding:10,backgroundColor:Colors.white}}>
            <Button
              title={"Obtener datos del dispositivo"}
              onPress={() => {
                toggleLoading(true);
                NativeModules.RNZebraBluetoothPrinter.pairedDevices().then(res => {
                  console.log("ENTRE?")
                  setDeviceArray(res);
                  setDeviceType('paired');                      //filter array for printers [class:1664]
                  toggleLoading(false);
                });
              }}
            ></Button>
          </View>

          {
            devices.map((device) =>

                <View style={{
                  backgroundColor:Colors.white,
                  flexDirection: 'column',
                  padding: 20,
                  justifyContent: 'center'
                }}>
                  <View style={{
                    flex: 0.4
                  }}>
                    <Text>{device.name}</Text>
                  </View>
                  <View style={{
                    flex: 0.3
                  }}>
                    <Text>{device.address}</Text>
                  </View>
                  {device.type != 'paired' &&
                    <View style={{paddingTop:10}}>
                      <Button
                        title="Conectarme con el dispositivo"
                        onClick={() => {
                          NativeModules.RNZebraBluetoothPrinter.connectDevice(device.address).then(res => alert(res));
                        }}></Button>
                    </View>}
                    <View style={{paddingTop:10}}>
                    <Button title={"Print something"}
                      onPress={() => {
                        NativeModules.RNZebraBluetoothPrinter.print(device.address,zpl).then((res) => {
                          console.log(res)
                        })
                      }}
                    />
                    </View>
                </View>
              )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
    marginBottom: 30,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
