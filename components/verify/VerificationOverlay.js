import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Overlay, Text } from 'react-native-elements';
import { SCAN_CLEAR } from '../scanner/action';

const VerificationOverlay = ({ setVisible, visible, verification,navigation,dispatch }) => {

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    return (
        <View >
            <Overlay overlayStyle={{height:"32%",width:"92%"}} isVisible={visible} onBackdropPress={toggleOverlay} >
                {verification === true ? <VerificationOk /> : <VerificationBad />}
                <View style={styles.buttonContainer}>
                    <View style={{width:"35%"}}>
                        <Button title={"Ver datos"} onPress={toggleOverlay}/>
                    </View>
                    <View style={{paddingLeft:20,width:"40%"}}>
                        <Button title={"Finalizar"} 
                        buttonStyle={{backgroundColor:'#00C18A'}}
                        onPress={() => {  
                            dispatch({type:SCAN_CLEAR})
                            navigation.navigate("Menu")}}/>
                    </View>
                </View>
            </Overlay>
        </View>
    );
};

const VerificationOk = () => (
    <View>
        <Text h4 style={{paddingLeft:"10%"}}>
            ¡Validación exitosa!
        </Text>
        <Text style={{fontSize:20,paddingLeft:"10%",paddingTop:30}}>
            El código de barra coincide con el código QR leído.
        </Text>
    </View>
)

const VerificationBad = () => (
    <View>
        <Text h4 style={{paddingLeft:"10%"}}>
            Validación fallida
        </Text>
        <Text style={{fontSize:20,paddingLeft:"10%",paddingTop:30}}>
            Los valores de las etiquetas no coinciden.
        </Text>
    </View>
)

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        paddingTop:"15%",
    },
})

export default VerificationOverlay;