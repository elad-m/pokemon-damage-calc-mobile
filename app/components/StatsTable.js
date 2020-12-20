import React, {useEffect, useState} from 'react';
import {TextInput, Text, View, StyleSheet } from 'react-native';

import NumberTextInput from './NumberTextInput';
import colors from '../config/colors';

const STAT_FIELDS = {hp: "HP", atk: "Atk", def: "Def", spa: "Sp. Atk", spd: "Sp. Def", spe: "Speed"};

function calcStat(stat, base, iv, ev, level=100){
    if (stat === 'hp') {
        return base === 1
            ? base
            : Math.floor(((base * 2 + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
    } else {
        const n = 1.0;
        return Math.floor((Math.floor(((base * 2 + iv + Math.floor(ev / 4)) * level) / 100) + 5) * n).toString();
}
}

function getCells(statEntries){
    return Object.entries(statEntries).map(([key, value]) => {
        return (
            <Text 
                style={styles.tableCell}
                key={key}
            >
                {value.toString()}
            </Text>
        );
    })

}

function ConstantTableColumn(props) {
    const cells = getCells(props.values);
    return (
        <View style={props.style}>
            <Text style={styles.tableCell}>
                {props.statName}
            </Text>
            {cells}
        </View>
    );
}

function getInputCells(statEntries, setStatEntries, maxValue){
    return Object.entries(statEntries).map(([key, value]) => {
        return (
            <NumberTextInput
                key={key}
                entryKey={key}
                minValue={0}
                maxValue={maxValue}
                statEntries={statEntries}
                setStatEntries={setStatEntries}
            />
        );
    })
}

function InputableTableColumn(props) {
    const cells = getInputCells(props.values, props.setValues, props.maxValue);
    return (
        <View style={styles.tableColumn}>
            <Text style={styles.tableCell}>
                {props.statName}
            </Text>
            {cells} 
        </View>
    );
}

function FinalTableColumn(props) {
    const {finalValues} = props;
    const cells = getCells(finalValues);
    return (
        <View style={{...styles.tableColumn, 
            borderBottomEndRadius:10,
            borderTopEndRadius:10,}}>
            <Text style={styles.tableCell}>
                {props.statName}
            </Text>
            {cells}
        </View>
    );
}

function StatsTable(props){
    const {pokemon, ivs, setIvs, evs, setEvs} = props; 
    const baseStats = pokemon.baseStats;
    const [finalValues, setFinalValues] = useState(
        Object.assign({}, ...Object.keys(baseStats)
                .map(k => ({[k]: calcStat(k, baseStats[k], ivs[k], evs[k])})))
    );
    useEffect(() => {
        setFinalValues(Object.assign({}, ...Object.keys(baseStats)
                    .map(k => ({[k]: calcStat(k, baseStats[k], ivs[k], evs[k])}))));
    },[ivs, evs]);
    // console.log(`base: ${Object.values(baseStats)} \
    // ivs: ${Object.entries(ivs)} evs: ${Object.values(evs)} \
    // fins: ${Object.values(finalValues)}`);
    return (
        <View style={styles.table}>
            
            <ConstantTableColumn
              values={STAT_FIELDS}
              statName={'    '}
              style={{...styles.tableColumn, 
                borderBottomStartRadius:10,
                borderTopStartRadius:10,}}/>
             <ConstantTableColumn
                values={baseStats}
                statName={'Base'}
                style={styles.tableColumn}/>

            <InputableTableColumn
                values={ivs}
                setValues={setIvs}
                statName={'IVs'}
                maxValue={31}
            />

            <InputableTableColumn
                values={evs}
                setValues={setEvs}
                statName={'EVs'}
                maxValue={252}
            />
            <FinalTableColumn
                finalValues={finalValues}
                statName={'Final'}
            /> 

    </View>
    );
}

const styles = StyleSheet.create({
    table: {
        flexDirection:'row',
        justifyContent:'space-around',        
    },
    tableColumn: {
        flex:1,
        justifyContent:'space-around',
        backgroundColor: colors.pressable,
        borderBottomStartRadius:5,
        borderTopStartRadius:5,
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

export default StatsTable;
