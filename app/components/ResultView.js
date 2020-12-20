import React from 'react';
import {Text, View, StyleSheet, Pressable } from 'react-native';

import colors from '../config/colors'
import dimens from '../config/dimens'

const MAX_DAMAGE_IN_ARRAY = 14;
const MIN_DAMAGE_IN_ARRAY = 0;

function ResultView(props){
    const {textStyle, damageResults, resultToShow, setResultToShow} = props;

    if(!damageResults || damageResults.length < 2){
        console.error(`Bad length of damage array: ${damageResults? damageResults.length: -1}`);
    }
    const splitByKO = damageResults[resultToShow].fullDesc('%', false).split(' -- ');
    const chanceForKO = splitByKO[1] || '';

    return(
        <View style={styles.resultContainer}>
            <Text style={{...styles.titleText, color:'white', fontWeight:'bold', backgroundColor:colors.header,}}>
                {'Result'}
            </Text>              
            <Text style={{...styles.titleText, flexWrap:'wrap',}}>
                {damageResults[resultToShow].damage[MIN_DAMAGE_IN_ARRAY]}-{damageResults[resultToShow].damage[MAX_DAMAGE_IN_ARRAY]}
                {' damage'}
                {'\n' + chanceForKO}
            </Text>
            <View >
                <Pressable
                    android_ripple={{radius: 10}}
                    onPress={() => {
                        const newResultToShow = resultToShow === 0? 1: 0;
                        setResultToShow(newResultToShow);
                    }}
                    style={({pressed}) => [
                        {
                            opacity: pressed? 
                            0.5:
                            1
                        },
                            styles.pressableWrapper
                    ]}>
                    <Text style={styles.titleText}>
                        Change Attacker
                    </Text>
                </Pressable>
            </View>
 
        </View>
);
}

const styles = StyleSheet.create({
    resultContainer: {
        margin:10,
        alignItems:'stretch',
        overflow: 'hidden',
        borderColor:'black',
        borderWidth: 1,
        borderRadius:dimens.headerFooterRadius,
    },
    pressableWrapper:{
        margin:5,
        alignSelf:'center',
        backgroundColor: colors.pressable,

        borderWidth:1,
        borderColor: 'grey',
        borderRadius: 10,
        padding: 10,
    },
    titleText:{
        textAlign: 'center',
        color: colors.titleText,
        fontSize: 20,
        padding: 10,
    },
});

export default ResultView;