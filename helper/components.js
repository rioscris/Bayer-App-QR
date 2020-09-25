import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Button, Icon, Overlay, Text } from 'react-native-elements';

export const Popup = ({visible, title, text, width, type, onPress}) => {
    return (
        <Overlay isVisible={visible} animationType={"fade"} overlayStyle={{height: '50%', width: width}}>
            <View style={{height: '100%', flexDirection: "column", justifyContent: "space-evenly", padding: 10}}>
                <Icon name={type === 'approved' ? 'check-circle' : type === 'rejected' ? 'x-circle' : 'alert-circle'}
                    type='feather' 
                    color={type === 'approved' ? '#00C18A' : type === 'rejected' ? '#DB3834' : '#38A6E3'}
                    size={100}/>
                <View style={{alignContent: 'center', flexDirection: "column", justifyContent: "center"}}>
                    {title && 
                        <View style={{alignContent: 'center', flexDirection: "row", justifyContent: "center"}}>
                            <Text style={{fontSize: 21, fontWeight: 'bold', color: '#9C9C9C'}}>{title}</Text>
                        </View>
                    }
                    {text ? 
                        <Text style={{fontSize: 18, color: '#757575'}}>{text}</Text>
                        : null
                    }
                </View>
                {onPress ? 
                    <Button title={'Continuar'} onPress={onPress}/>
                    :
                    <ActivityIndicator size={"large"} color={'#1976D2'}/>
                }
            </View>
        </Overlay>
    )
}