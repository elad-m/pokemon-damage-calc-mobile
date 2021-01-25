import React from 'react';
import { useContext } from 'react';
import {Text, View, StyleSheet } from 'react-native';
import ThemeContext from '../config/ThemeContext';

function RowWrapper(props){
    const {theme} = useContext(ThemeContext);
    const {message, titleTextViewStyle, titleFontSize} = props;
    return(
        <View style={styles.rowContainer}>
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
        flex: 0,
        flexDirection:'row',
        justifyContent:'space-around',
        
        padding:5,
    },
});

export default RowWrapper;