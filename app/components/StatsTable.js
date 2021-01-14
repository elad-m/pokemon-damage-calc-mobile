import React, {useEffect, useState} from 'react';
import {TextInput, Text, View, StyleSheet } from 'react-native';

import NumberTextInput from './NumberTextInput';
import colors from '../config/colors';

const STAT_FIELDS = {hp: "HP", atk: "Atk", def: "Def", spa: "Sp. Atk", spd: "Sp. Def", spe: "Speed"};


function getNatureCoefficient(stat, nature){
    let rawSplit = nature.more.split(/\W+/i);
    let boosted = rawSplit[1]; // just how it splits, say (+atk,-def)
    let nerfed = rawSplit[2];
    let natureCoefficient = 1;
    if(boosted === nerfed){
        natureCoefficient = 1;
    } else if (boosted === stat){
        natureCoefficient = 1.1;
    } else if (nerfed === stat){
        natureCoefficient = 0.9;
    } else {
        natureCoefficient = 1;
    }
    return natureCoefficient;
    
}

function calcStat(stat, base, iv, ev, nature, level=50){
    const natureCoefficient = getNatureCoefficient(stat, nature);
    if (stat === 'hp') {
        return base === 1
            ? base
            : Math.floor(((base * 2 + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
    } else {
        return Math.floor((Math.floor(((base * 2 + iv + Math.floor(ev / 4)) * level) / 100) + 5) * natureCoefficient).toString();
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

function getInputCells(statEntries, setStatEntries, maxValue, maxSum, useMaxSum){
    return Object.entries(statEntries).map(([key, value]) => {
        return (
            <NumberTextInput
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
    const {pokemon, ivs, setIvs, evs, setEvs, nature} = props; 
    const baseStats = pokemon.baseStats;
    const [finalValues, setFinalValues] = useState(
        Object.assign({}, ...Object.keys(baseStats)
                .map(k => ({[k]: calcStat(k, baseStats[k], ivs[k], evs[k], nature)})))
    );
    useEffect(() => {
        setFinalValues(Object.assign({}, ...Object.keys(baseStats)
                    .map(k => ({[k]: calcStat(k, baseStats[k], ivs[k], evs[k], nature)}))));
    },[ivs, evs, nature]);
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
                maxSum={186} // could be any value
                useMaxSum={false}
            />

            <InputableTableColumn
                values={evs}
                setValues={setEvs}
                statName={'EVs'}
                maxValue={252}
                maxSum={510}
                useMaxSum={true}
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
        flex:0,
        flexDirection:'row',
        justifyContent:'space-around',
    },
    tableColumn: {
        flex:1,
        justifyContent: 'space-around',
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

export default StatsTable;
