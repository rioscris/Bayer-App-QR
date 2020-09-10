import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    Dimensions, Image, StyleSheet, Text,

    TouchableOpacity, View
} from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import { RNCamera } from 'react-native-camera';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useDispatch } from 'react-redux';
import { FlashOff, FlashOn, Manual, Patodebug } from '../../images';
import useScannerStorage from '../home/hooks/useScannerStorage';
import { SAVE_LOT_AUTO, SAVE_PALLET } from './action';


const BarcodeScanner = (props) => {
    const [torch, setTorch] = useState(false);
    const { navigation } = props;
    const dispatch = useDispatch();
    const scannerStorage = useScannerStorage();
    const [scanner, setScanner] = useState({pallet: null, lot: null});
    const frameWidthRel = 0.1;
    const frameHeightRel = 0.8;
    const [Screen, setScreen] = useState({w: Dimensions.get('screen').width, h: Dimensions.get('screen').height})
    const [mask, setMask] = useState({leftMargin: 0, topMargin: 0, frameWidth: 0, frameHeight: 0});
    const defaultBarcodeTypes = [RNCamera.Constants.BarCodeType.code128]
    const [isBarcodeRead, setIsBarcodeRead] = useState(false);
    const [refresh, setRefresh] = useState(false);

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

    const onBarCodeRead = (barcode) => {
        if(!isBarcodeRead){
            setIsBarcodeRead(true);
            if(barcode.data && scanner.pallet === null){ //Mensaje que diga, Pallet mal ingresado. o mal leido.
                dispatch({type: SAVE_PALLET, payload: barcode.data});
                setScanner({...scanner, pallet: barcode.data});
            }
            else if(scanner.lot === null){
                if(barcode.data && barcode.data.length > 22){
                    dispatch({type: SAVE_LOT_AUTO, payload: barcode.data});
                    setScanner({pallet: null, lot: null});
                    navigation.navigate('Preview');
                }
            }
        }
    }

    useEffect(() => {
        if(isBarcodeRead) setTimeout(() => setIsBarcodeRead(false), 3000)
    }, [isBarcodeRead])

    useFocusEffect(() => {
        if(refresh){
            setRefresh(false);
            if(scannerStorage.pallet && !scannerStorage.lot) // Pallet has been entered
                setScanner({pallet: scannerStorage.pallet, lot: null});
            else if(!scannerStorage.pallet && !scannerStorage.lot) // Lot has been entered
                setScanner({pallet: null, lot: null}); // Reset
        }
    }, [])

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
                onBarCodeRead={(barcode) => onBarCodeRead(barcode)}
                barCodeTypes={isBarcodeRead ? [] : defaultBarcodeTypes}
            >
                <BarcodeMask edgeColor={'#b00000'} height={mask.frameWidth} width={mask.frameHeight}/>
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
                    <Image style={styles.cameraIcon} source={torch ? FlashOff : FlashOn}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                        setRefresh(true);
                        navigation.navigate('Manual');
                    }}>
                    <Image style={styles.cameraIcon} source={Manual}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                        onBarCodeRead({data: scanner.pallet === null ? '50000000001' : '12345678 ABCDEF 1234'}); // Inserts test data
                    }}>
                    <Image style={styles.cameraIcon} source={Patodebug}/>
                </TouchableOpacity>
            </View>
            <View style={{bottom: 0, position: 'absolute', width: '100%', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                <View style={styles.instruction}>
                    <Text style={styles.instructionText}>
                        {scanner.pallet === null ? '' : `Valor Leido ${scanner.pallet}`}
                    </Text>
                </View>
                <View style={styles.instruction}>
                    <Text style={styles.instructionText}>
                        {scanner.pallet === null ? "Escanee el Pallet" : "Escanee el lote"}
                    </Text>
                </View>
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
        height: 50,
        width: 50,
    },
    bottomOverlay: {
        position: "absolute",
        marginTop: 5,
        width: "100%",
        flex: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    instruction: {
        height: 40,
        justifyContent: "center",
        color: Colors.white,
        borderRadius: 10,
        margin: 10,
    },
    instructionText: {
        textAlign: "center",
        fontFamily: "Helvetica, Arial, sans-serif;",
        color: Colors.white,
        fontSize: 20,
    }
})

export default BarcodeScanner;