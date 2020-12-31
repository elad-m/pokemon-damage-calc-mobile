import React, {useState} from 'react';
import {Text, View, StyleSheet, Pressable } from 'react-native';
import Collapsible from 'react-native-collapsible/Collapsible';
import Svg, { G, Polygon, TSpan } from 'react-native-svg';

import colors from '../config/colors';
import dimens from '../config/dimens';

const MAX_DAMAGE_IN_ARRAY = 14;
const MIN_DAMAGE_IN_ARRAY = 0;

function getArrowData(isDown, arrowScaling=1){
    const viewBox = `0 0 50 25`;
    let points = [];
    if(isDown){
        points = [[0,15], [5,15], [5,0], [45,0], [45,15], [50,15], [25,24]];
    } else {
        points = [[0,10], [5,10], [5,25], [45,25], [45,10], [50,10], [25,1]];
    }
    let scaledPoints = points.reduce(function (acc, val) {
        const newScaledPoint = `${arrowScaling * val[0]}`+','+`${arrowScaling * val[1]} `;
        return acc + newScaledPoint;
    }, "");
    
    return [viewBox, scaledPoints];
}

function ArrowPressable(props){
    const {resultToShow, setResultToShow} = props;
    const [viewBox, scaledPoints] = getArrowData(resultToShow === 0);
    // console.log(`viewBox: ${viewBox} scaledPoints: ${scaledPoints}`);
    const upArrowTextYAxis ="60%" ;
    const downArrowTextYAxis ="40%" ;
    return(
        <View style={styles.arrowContainer}>
            <Svg
                height={'100'} width={'200'} 
                viewBox={viewBox} 
                stroke={colors.header}
                >
                <G >                
                    <Polygon
                        strokeWidth="0.5"
                        fill={colors.pressable}
                        points={scaledPoints}
                        onPress={() => {
                            const newResultToShow = resultToShow === 0? 1: 0;
                            setResultToShow(newResultToShow);
                        }}
                    />
                    <Text style={styles.arrowText} >
                        {resultToShow === 0 && <TSpan x='19%' y={downArrowTextYAxis} fill='black' strokeWidth='0' fontSize='5'>
                            Swap Attacker
                        </TSpan>}
                        {resultToShow === 1 && <TSpan x='19%' y={upArrowTextYAxis} fill='black' strokeWidth='0' fontSize='5'>
                            Swap Attacker
                        </TSpan>}
                    </Text>
                </G>
            </Svg>
        </View>
);
}

function getChanceForKO(damageResults, resultToShow){
    const resultDescription = damageResults[resultToShow].fullDesc('%', false);
    let chanceForKO = '';
    if (resultDescription.indexOf('--') === -1) {
        chanceForKO = ' possibly the worst move ever';
    } else {
        chanceForKO = resultDescription.split(' -- ')[1] || '';
    }
    return chanceForKO;
}

function ResultView(props){
    const {damageResults, resultToShow, setResultToShow} = props;

    const [collapsibleState, setCollapsibleState] = useState({
        collapsed: true,
    });

    const toggleExpanded = () => {
        setCollapsibleState({ collapsed: !collapsibleState.collapsed });
    };

    if(!damageResults || damageResults.length < 2){
        console.error(`Bad length of damage array: ${damageResults? damageResults.length: -1}`);
    }
    const chanceForKO = getChanceForKO(damageResults, resultToShow);
    return(
        <View style={{...styles.resultContainer}}>
            <Text style={{...styles.titleText, 
            color:'white', fontWeight:'bold', 
            backgroundColor:colors.header,}}>
                {'Result'}
            </Text>
            <Text style={{...styles.titleText}}>
                {damageResults[resultToShow].damage[MIN_DAMAGE_IN_ARRAY]|| 0}-{damageResults[resultToShow].damage[MAX_DAMAGE_IN_ARRAY] || 0}
                {' damage'}
                {'\n' + chanceForKO}
            </Text>
            <ArrowPressable
                resultToShow={resultToShow}
                setResultToShow={setResultToShow}
            />

            <Pressable 
                onPress={toggleExpanded}
                style={{...styles.pressableWrapper, flex:0}}>
                <Text style={{...styles.pressableInnerText}}>
                    Spread/Collapse
                </Text>
            </Pressable>
            <Collapsible collapsed={collapsibleState.collapsed} align="center">
                <Text style={{fontSize:50}}>
                    Collapsed Text {'\n'}
                    Collapsed Text{'\n'}
                    Collapsed Text{'\n'}
                    Collapsed Text{'\n'}
                </Text>
            </Collapsible>
        </View>
);
}

const styles = StyleSheet.create({
    resultContainer: {
        overflow:'hidden',
        margin:dimens.mainMargin,
        borderColor:'black',
        borderWidth: 1,
        borderRadius:dimens.headerFooterRadius,
    },
    arrowContainer: {
        alignItems:'center',
        justifyContent:'center',
        aspectRatio: 3,
    },
    titleText:{
        textAlign: 'center',
        color: colors.titleText,
        fontSize: 20,
        padding: 10,
    },
    arrowText:{
        textAlign:'center',
    },
    pressableWrapper:{
        flex:1, 
        alignSelf:'stretch',
        backgroundColor: colors.pressable,
        margin:dimens.mainMargin,
        borderRadius: dimens.defaultBorderRadius,    
        borderColor:'grey',
        borderWidth:1,
        elevation:2,

        shadowColor: "black", // ios only
        shadowOffset: {
          width: 5,
          height: 5
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    pressableInnerText:{
        textAlign:'center',
        fontSize: 20,  
        padding: 10,        
    },
});

export default ResultView;