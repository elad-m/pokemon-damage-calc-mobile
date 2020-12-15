import React from 'react';
import {Text, View, StyleSheet } from 'react-native';

function RowWrapper(props){
    const {message, titleTextViewStyle, titleTextStyle} = props;
    return(
        <View style={styles.RowContainer}>
            <View style={titleTextViewStyle}>
                <Text style={titleTextStyle}>
                    {message} 
                </Text>
            </View>
            {props.children}
        </View>
    );
}

const styles = StyleSheet.create({
    RowContainer: {
        flex: 1,
        flexDirection:'row',
        justifyContent:'space-around',
        padding:5,
    },
});

export default RowWrapper;