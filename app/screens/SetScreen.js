import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Keyboard } from 'react-native'


function SetScreen(props) {
    // Keyboard.dismiss();
    const pokemon = props.route.params;
    return (
        <SafeAreaView style={styles.mainView}>
            <Text style={styles.titleText}>
                Text For Testing
            </Text>
        </SafeAreaView>
        
    );
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        justifyContent: 'space-around',
    },
    titleText: {
        flex: 1,
        color: 'dimgray',
        padding: 10,
        fontSize: 30,  
        textAlign: 'center',
    },
    innerText: {
        flex: 1,
        padding: 10,
        fontSize: 20,  
        textAlign: 'center',
        color: 'black',
    },    
})

export default SetScreen;