import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet } from 'react-native';

import StatTextInput from './StatTextInput';
import { useContext } from 'react';
import ThemeContext from '../config/ThemeContext';

const STAT_FIELDS = {hp: "HP", atk: "Atk", def: "Def", spa: "Sp. Atk", spd: "Sp. Def", spe: "Speed"};

function getCells(statEntries, textColor){
    return Object.entries(statEntries).map(([key, value]) => {
        return (
            <Text 
                style={{...styles.tableCell, color:textColor}}
                key={key}
            >
                {value.toString()}
            </Text>
        );
    })

}

function ConstantTableColumn(props) {
    const {values, style, statName, textColor} = props;
    const cells = getCells(values, textColor);
    return (
        <View style={style}>
            <Text style={{...styles.tableCell, color:textColor}}>
                {statName}
            </Text>
            {cells}
        </View>
    );
}

function getInputCells(statEntries, setStatEntries, maxValue, maxSum, useMaxSum){
    return Object.entries(statEntries).map(([key, value]) => {
        return (
            <StatTextInput
                key={key}
                entryKey={key}
                minValue={0}
                maxValue={maxValue}
                maxSum={maxSum}
                useMaxSum={useMaxSum}
                statEntries={statEntries}
                setStatEntries={setStatEntries}
            />
        );
    })
}

function InputableTableColumn(props) {
    const cells = getInputCells(props.values, props.setValues, props.maxValue,
        props.maxSum, props.useMaxSum);
    return (
        <View style={styles.tableColumn}>
            <Text style={{...styles.tableCell, color:props.textColor}}>
                {props.statName}
            </Text>
            {cells} 
        </View>
    );
}

function FinalTableColumn(props) {
    const {finalValues} = props;
    const cells = getCells(finalValues, props.textColor);
    return (
        <View style={styles.tableColumn}>
            <Text style={{...styles.tableCell, color: props.textColor}}>
                {props.statName}
            </Text>
            {cells}
        </View>
    );
}

function StatsTable(props){
    const {theme} = useContext(ThemeContext);
    const {pokemon, ivs, setIvs, evs, setEvs, finalStats} = props; 
    const baseStats = pokemon.baseStats;
    return (
        <View style={{...styles.table, backgroundColor:theme.secondary,
        borderColor:theme.divider}}>
            
            <ConstantTableColumn
              values={STAT_FIELDS}
              statName={'    '}
              style={styles.tableColumn}
              textColor={theme.secondaryText}/>
             <ConstantTableColumn
                values={baseStats}
                statName={'Base'}
                style={styles.tableColumn}
                textColor={theme.titleText}/>

            <InputableTableColumn
                values={ivs}
                setValues={setIvs}
                statName={'IVs'}
                maxValue={31}
                maxSum={186} // could be any value
                useMaxSum={false}
                textColor={theme.titleText}
            />

            <InputableTableColumn
                values={evs}
                setValues={setEvs}
                statName={'EVs'}
                maxValue={252}
                maxSum={510}
                useMaxSum={true}
                textColor={theme.titleText}
            />
            <FinalTableColumn
                finalValues={finalStats}
                statName={'Final'}
                textColor={theme.titleText}
            /> 

    </View>
    );
}

const styles = StyleSheet.create({
    table: {
        flex:0,
        flexDirection:'row',
        justifyContent:'space-around',
        borderRadius:10,
        borderWidth:1,
        marginTop:10
    },
    tableColumn: {
        flex:1,
        justifyContent: 'space-around',
        paddingBottom:2,
    },
    tableCell: {
        fontSize:15,
        textAlign:'center',
        margin:5,
        padding:2,
    },
});

export default StatsTable;
