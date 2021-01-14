import React from 'react';
import {Text, View, StyleSheet } from 'react-native';

function RowWrapper(props){
    const {message, titleTextViewStyle, titleFontSize} = props;
    return(
        <View style={styles.rowContainer}>
                {message && 
                <View style={titleTextViewStyle}>
                    <Text style={{...styles.textStyle, fontSize:titleFontSize}}>
                        {message} 
                    </Text>
                </View>
                }
            {props.children}
        </View>
    );
}

const styles = StyleSheet.create({
    rowContainer: {
        flex: 0,
        flexDirection:'row',
        justifyContent:'center',
        padding:5,
    },
    textStyle:{
        textAlign:'center',
        color: 'black', 
    },
});

export default RowWrapper;