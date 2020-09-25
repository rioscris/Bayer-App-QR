import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Overlay, Text, Icon } from 'react-native-elements';
import { SCAN_CLEAR } from '../scanner/action';
import EntypoIcon from 'react-native-vector-icons/Entypo'

const VerificationOverlay = ({ setVisible, visible, verification, navigation, dispatch }) => {

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    return (
        <View >
            <Overlay overlayStyle={{ height: "50%" }} isVisible={visible} onBackdropPress={toggleOverlay} animationType={"fade"} >
                <View style={{ height: '100%', flexDirection: "column", justifyContent: "space-evenly", padding: 10 }}>
                    {verification === true ? <VerificationOk /> : <VerificationBad />}
                    <View style={styles.buttonContainer}>
                        <View style={{ width: "40%" }}>
                            <Button title={"Ver datos"} onPress={toggleOverlay} />
                        </View>
                        <View style={{ paddingLeft: 20, width: "50%" }}>
                            <Button title={"Finalizar"}
                                buttonStyle={{ backgroundColor: '#00C18A' }}
                                onPress={() => {
                                    dispatch({ type: SCAN_CLEAR })
                                    navigation.navigate("Menu")
                                }} />
                        </View>
                    </View>
                </View>
            </Overlay>
        </View>
    );
};

const VerificationOk = () => (
    <View>
        <Icon name='check-circle' type='feather' color='#00C18A' size={100} />
        <View style={{ alignContent: 'center', flexDirection: "column", justifyContent: "center" }}>
            <View style={{ alignContent: 'center', flexDirection: "row", justifyContent: "center" }}>
                <Text style={{ fontSize: 21, fontWeight: 'bold', color: '#9C9C9C', paddingTop: 20 }}>¡Validación exitosa!</Text>
            </View>
        </View>
    </View>
)

const VerificationBad = () => (
    <View>
        <View style={{paddingLeft:"32%"}}>
        <EntypoIcon name='circle-with-cross' type='feather' color='#DB3834' size={100}/>
        </View>
        <View style={{ alignContent: 'center', flexDirection: "column", justifyContent: "center" }}>
            <View style={{ alignContent: 'center', flexDirection: "row", justifyContent: "center" }}>
                <Text style={{ fontSize: 21, fontWeight: 'bold', color: '#9C9C9C', paddingTop: 20 }}>Validación fallida</Text>
            </View>
        </View>
    </View>
)

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
})

export default VerificationOverlay;