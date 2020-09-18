import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Input, Text } from 'react-native-elements';

const ShowDataInInputs = ({scanner}) => {
    return (
        <Card >
            <Text style={styles.textView}>
                Numero de paleta
                    </Text>
            <Card.Divider />
            <Input value={scanner.pallet} disabled={true} />
            <Text style={styles.textView}>
                Codigo de material
                    </Text>
            <Card.Divider />
            <Input value={scanner.matCode} disabled={true} />
            <Text style={styles.textView}>
                Número de lote
                    </Text>
            <Card.Divider />
            <Input value={scanner.lotNo} disabled={true} />
            <Text style={styles.textView}>
                Cantidad
                    </Text>
            <Card.Divider />
            <Input value={scanner.qty} disabled={true} />
        </Card>
    )
}

const styles = StyleSheet.create({
    textView: {
        paddingLeft: 10,
        fontSize: 20,
        paddingBottom: 10
    },
})

export default ShowDataInInputs