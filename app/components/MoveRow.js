import React from 'react';
import {Text, View, StyleSheet } from 'react-native';

function MoveRow(props){
    const {move, message, titleTextViewStyle, titleFontSize} = props;
    // console.log(move);
    return(
        <View style={styles.RowContainer}>
            <View style={titleTextViewStyle}>
                <Text style={{...styles.textStyle, fontSize: titleFontSize}}>
                    {message} 
                </Text>
            </View>
            {props.children}
            <View style={titleTextViewStyle}>
                <Text style={{...styles.textStyle, fontSize: 12}}>
                    {move.type} 
                </Text>
                <Text style={{...styles.textStyle, fontSize: 12}}>
                    {move.category} 
                </Text>
                <Text style={{...styles.textStyle, fontSize: 12}}>
                    {move.basePower? move.basePower: 0} 
                </Text>
            </View>
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
    textStyle:{
        textAlign:'center',
        color: 'black', 
    },
});

export default MoveRow;