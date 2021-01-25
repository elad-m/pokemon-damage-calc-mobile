import React, {useContext} from 'react';
import {Text, View, StyleSheet } from 'react-native';
import ThemeContext from '../config/ThemeContext';

function MoveRow(props){
    const {theme} = useContext(ThemeContext);
    const {move, message, titleTextViewStyle, titleFontSize} = props;
    return(
        <View style={styles.rowContainer}>
            <View style={titleTextViewStyle}>
                <Text style={{...styles.textStyle, fontSize: titleFontSize, color:theme.titleText}}>
                    {message} 
                </Text>
            </View>
            {props.children}
            <View style={titleTextViewStyle}>
                <Text style={{...styles.textStyle, fontSize: 12, color:theme.secondaryText}}>
                    {move.type} 
                </Text>
                <Text style={{...styles.textStyle, fontSize: 12, color:theme.secondaryText}}>
                    {move.category} 
                </Text>
                <Text style={{...styles.textStyle, fontSize: 12, color:theme.secondaryText}}>
                    {move.basePower? move.basePower: 0} 
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    rowContainer: {
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