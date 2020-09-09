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
import { useDispatch } from 'react-redux';
import useScannerStorage from '../../home/hooks/useScannerStorage';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { SAVE_PALLET, SAVE_LOT, SAVE_DATA_QR } from '../action'
import { useFocusEffect } from '@react-navigation/native';
import { FlashOff, FlashOn, Manual, Patodebug } from '../../../images';

const BarcodeScanner = ({ navigation, route }) => {
    const [torch, setTorch] = useState(false);
    const { validate,type } = route.params;
    const dispatch = useDispatch();
    const scannerStorage = useScannerStorage();
    const [scanner, setScanner] = useState({ pallet: null, lot: null });

    let frameWidthRel = 0.1;
    let frameHeightRel = 0.8;

    const [Screen, setScreen] = useState({ w: Dimensions.get('screen').width, h: Dimensions.get('screen').height })
    const [mask, setMask] = useState({ leftMargin: 0, topMargin: 0, frameWidth: 0, frameHeight: 0 });

    const defaultBarcodeTypes = [RNCamera.Constants.BarCodeType.code128]
    const defaultQrCodeTypes = [RNCamera.Constants.BarCodeType.datamatrix]
    
    const [isBarcodeRead, setIsBarcodeRead] = useState(false);

    const [refresh, setRefresh] = useState(false);
    
    useEffect(() => {
        if(type === "qr"){
            frameWidthRel = 0.6; //Aumenta el alto
            frameHeightRel = 0.8; //Aumenta el ancho
        }
        const totalFrameWidth = frameWidthRel * Screen.h;
        const totalFrameHeight = frameHeightRel * Screen.w;
        setMask({
            leftMargin: (Screen.h - totalFrameWidth) / 2,
            topMargin: (Screen.w - totalFrameHeight) / 2,
            frameWidth: totalFrameWidth,
            frameHeight: totalFrameHeight,
        })
    }, [Screen,validate])

    const onBarCodeRead = (barcode) => {
        if (!isBarcodeRead) {
            setIsBarcodeRead(true);
            if (scanner.pallet === null) {
                dispatch({ type: SAVE_PALLET, payload: barcode.data });
                setScanner({ ...scanner, pallet: barcode.data });
            }
            else if (scanner.lot === null) {
                dispatch({ type: SAVE_LOT, payload: barcode.data });
                setScanner({ pallet: null, lot: null }); //Revisar esto.
                navigation.navigate('Preview', { validate: validate });
            }
        }
    }

    const onQrCodeRead = (barcode) => {
            dispatch({type: SAVE_DATA_QR,payload: barcode.data});
            navigation.navigate('Verify');
    }

    useEffect(() => {
        if (isBarcodeRead) setTimeout(() => setIsBarcodeRead(false), 3000)
    }, [isBarcodeRead])

    useFocusEffect(() => {
        if (refresh) { //Revisar esto.
            setRefresh(false);
            if (scannerStorage.pallet && !scannerStorage.lot) // Pallet has been entered
                setScanner({ pallet: scannerStorage.pallet, lot: null });
            else if (!scannerStorage.pallet && !scannerStorage.lot) // Lot has been entered
                setScanner({ pallet: null, lot: null }); // Reset
        }
    }, [])

    return (
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
                onLayout={(event) => {
                    if (event.nativeEvent.layout.width && event.nativeEvent.layout.height)
                        setScreen({ w: event.nativeEvent.layout.width, h: event.nativeEvent.layout.height })
                }}
                flashMode={
                    torch ?
                        RNCamera.Constants.FlashMode.torch :
                        RNCamera.Constants.FlashMode.off}
                cameraViewDimensions={{ width: Screen.w, height: Screen.h }}
                onBarCodeRead={(barcode) => type === "barcode" ? onBarCodeRead(barcode) : onQrCodeRead(barcode)}
                barCodeTypes={type === "barcode" ? defaultBarcodeTypes : defaultQrCodeTypes}
            >
                {type === "barcode" ?
                    <BarcodeMask edgeColor={'#b00000'} height={mask.frameWidth} width={mask.frameHeight} />
                    :
                    <View
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
                    />
                }
            </RNCamera>

            <View style={styles.bottomOverlay}>
                <TouchableOpacity onPress={() => setTorch(!torch)}>
                    <Image style={styles.cameraIcon} source={torch ? FlashOff : FlashOn} />
                </TouchableOpacity>
                {
                    type === "barcode" ?
                        <TouchableOpacity onPress={() => {
                            setRefresh(true);
                            navigation.navigate('Manual');
                        }}>
                            <Image style={styles.cameraIcon} source={Manual} />
                        </TouchableOpacity>
                        : null
                }
                {
                    type === "barcode" ?
                <TouchableOpacity onPress={() => {
                    onBarCodeRead({ data: scanner.pallet === null ? '50000000001' : '12345678  ABCDEF 1234' }); // Inserts test data
                }}>
                    <Image style={styles.cameraIcon} source={Patodebug} />
                </TouchableOpacity>
                : 
                <TouchableOpacity onPress={() => {
                    onQrCodeRead({ data:  " 9250000000001 24012345678 10ABCDEF 371234"}); // Inserts test data
                }}>
                    <Image style={styles.cameraIcon} source={Patodebug} />
                </TouchableOpacity>
                }
            </View>
            {
                type === "barcode" ?
                    <View style={{ bottom: 0, position: 'absolute', width: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }}>
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
                    : <View style={{ bottom: 0, position: 'absolute', width: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={styles.instruction}>
                        <Text style={styles.instructionText}>
                            Escanee el codigo QR
                        </Text>
                    </View>
                </View>
            }
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