import React from 'react';
import { useContext } from 'react';
import {Text, View, StyleSheet } from 'react-native';
import ThemeContext from '../config/ThemeContext';

function RowWrapper(props){
    const {theme} = useContext(ThemeContext);
    const {message, titleTextViewStyle, titleFontSize, 
        justifyContentContainer='space-around', padding=10} = props;
    return(
        <View style={{...styles.rowContainer, 
        justifyContent:justifyContentContainer, padding:padding}}>
                {message && 
                <View style={titleTextViewStyle}>
                    <Text style={{color:theme.titleText ,textAlign:'center', fontSize:titleFontSize}}>
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
        flex: 0, // should possibly be 0 when there are weird modal changes
        flexDirection:'row',
        alignItems:'center',

    },
});

export default RowWrapper;