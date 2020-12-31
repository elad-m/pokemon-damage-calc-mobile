
import React, {useEffect, useState} from 'react';
import {TextInput, View, StyleSheet } from 'react-native';

import colors from '../config/colors';
import ErrorBoundary from '../ErrorBoundary';

// returns a number from text between min and max, 0 if not a number
function sanitizeTextInput(statEntries, text, min ,max, maxSum, useMaxSum){
    const parsed = parseInt(text);
    const minMaxSanitized =  isNaN(parsed)? 0: 
            (parsed < min? min
                : (parsed > max? max:
                    parsed));
    const currentSum = Object.values(statEntries).reduce((pv, cv) => pv + cv, 0);
    const sumSanitized = useMaxSum? 
        ((currentSum + minMaxSanitized > maxSum)? (maxSum - currentSum) : minMaxSanitized) :
        minMaxSanitized;
    return sumSanitized;
}

function NumberTextInput(props){
    const {minValue, maxValue, entryKey, statEntries, setStatEntries, 
        maxSum, useMaxSum} = props;

    const [inputText, setInputText] = useState(statEntries[entryKey].toString());
    useEffect(() => {
        setInputText(statEntries[entryKey].toString());
    }, [statEntries])

    return (
        <View style={styles.tableColumn}>
            <ErrorBoundary>
                <TextInput
                    style={[styles.inputCell, styles.tableCell]}
                    maxLength={3}
                    selectTextOnFocus={true}
                    keyboardType={'numeric'}      
                    onChangeText={text => {
                        const parsedNumber = sanitizeTextInput(statEntries, text, minValue, maxValue, maxSum, useMaxSum);
                        // setting values here causes problems/complications with sum verifying
                        setInputText(parsedNumber.toString());
                    }}
                    onSubmitEditing={e => {
                        const parsedNumber = sanitizeTextInput(statEntries, inputText, minValue, maxValue, maxSum, useMaxSum);
                        const newValues = {...statEntries};
                        newValues[entryKey] = parsedNumber;
                        setStatEntries(newValues);
                        setInputText(parsedNumber.toString());
                    }}
                    value={inputText}      
                />
            </ErrorBoundary>
        </View>
    );
}

const styles = StyleSheet.create({
    tableColumn: {
        backgroundColor: colors.pressable,    
    },
    tableCell: {
        fontSize:15,
        textAlign:'center',
        margin:5,
        padding:5,
    },
    inputCell: {
        backgroundColor: 'white',
        borderColor:'black',
        borderWidth:1,
        borderRadius:10,
    },
});

export default NumberTextInput;

