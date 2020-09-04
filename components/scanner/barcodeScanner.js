import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    StyleSheet, Alert, TouchableOpacity,
    Image,
    TextInput,
    Screen,
    Dimensions
} from 'react-native';

import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';

const BarcodeScanner = (props) => {
    const [torch, setTorch] = useState(false);
    const [barcode, setBarcode] = useState({});
    
    const frameWidthRel = 0.1;
    const frameHeightRel = 0.8;
    const [Screen, setScreen] = useState({w: Dimensions.get('screen').width, h: Dimensions.get('screen').height})
    const [mask, setMask] = useState({leftMargin: 0, topMargin: 0, frameWidth: 0, frameHeight: 0});
    useEffect(() => {
        const totalFrameWidth = frameWidthRel * Screen.h;
        const totalFrameHeight = frameHeightRel * Screen.w;
        setMask({
            leftMargin: (Screen.h - totalFrameWidth)/2,
            topMargin: (Screen.w - totalFrameHeight)/2,
            frameWidth: totalFrameWidth,
            frameHeight: totalFrameHeight,
        })
    }, [Screen])
    return(
        <View style={styles.container}>
            <RNCamera
                style={styles.preview}
                rectOfInterest={{
                    x: mask.leftMargin / Screen.h,
                    y: mask.topMargin / Screen.w,
                    width: mask.frameWidth / Screen.h,
                    height: mask.frameHeight / Screen.w,
                }}
                captureAudio={false}
                onLayout={(event)=> {
                    if(event.nativeEvent.layout.width && event.nativeEvent.layout.height)
                        setScreen({w: event.nativeEvent.layout.width, h: event.nativeEvent.layout.height})
                    }} 
                flashMode={
                    torch ? 
                    RNCamera.Constants.FlashMode.torch : 
                    RNCamera.Constants.FlashMode.off}
                cameraViewDimensions={{width: Screen.w, height: Screen.h}}
                onBarCodeRead={(barcode) => setBarcode(barcode)}
            >
                <BarcodeMask edgeColor={'#62B1F6'} height={mask.frameWidth} width={mask.frameHeight}/>
                {/* <View
                    style={{
                    position: 'absolute',
                    top: mask.leftMargin,
                    right: mask.topMargin,
                    width: mask.frameHeight,
                    height: mask.frameWidth,
                    borderWidth: 1.5,
                    borderColor: '#62B1F6',
                    opacity: 0.5,
                    }}
                /> */}
            </RNCamera>
            <View style={styles.bottomOverlay}>
                <TouchableOpacity onPress={() => setTorch(!torch)}>
                    <Image style={styles.cameraIcon} source={torch ? require('../images/flash_off.png') : require('../images/flash_on.png')}/>
                </TouchableOpacity>
            </View>
            <View style={styles.lowerSection}>
                <TextInput
                    editable={false}
                    placeholder='Código'
                    value={barcode.data}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    cameraIcon: {
        margin: 5,
        height: 40,
        width: 40
    },
    bottomOverlay: {
        position: "absolute",
        width: "100%",
        flex: 20,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    lowerSection: {
        position: "absolute",
        width: "100%",
        bottom: 0,
        backgroundColor: 'white',
    },
})

export default BarcodeScanner;