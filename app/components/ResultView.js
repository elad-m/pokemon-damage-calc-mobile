import React, {useContext} from 'react';
import {Text, View, StyleSheet, Pressable } from 'react-native';
import Svg, { G, Polygon, TSpan } from 'react-native-svg';


import dimens from '../config/dimens';
import RowWrapper from './RowWrapper';
import ThemeContext from '../config/ThemeContext';
import PressActivatedModalContainer from './PressActivatedModalContainer';
import PickerView from './PickerView';

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
    const {theme} = useContext(ThemeContext);
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
                stroke={theme.titleText}
                >
                <G >                
                    <Polygon
                        strokeWidth="0.5"
                        fill={theme.pressable}
                        points={scaledPoints}
                        onPress={() => {
                            const newResultToShow = resultToShow === 0? 1: 0;
                            setResultToShow(newResultToShow);
                        }}
                    />
                    <Text style={styles.arrowText}>
                        {resultToShow === 0 && <TSpan x='19%' y={downArrowTextYAxis} fill={theme.titleText} strokeWidth='0' fontSize='5'>
                            Swap Attacker
                        </TSpan>}
                        {resultToShow === 1 && <TSpan x='19%' y={upArrowTextYAxis} fill={theme.titleText} strokeWidth='0' fontSize='5'>
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

function getDamageMessage(damageResults, resultToShow){
    const chanceForKO = getChanceForKO(damageResults, resultToShow);
    const currentResult =damageResults[resultToShow];
    const numberOfHits = currentResult.move.hits || 1;
    let minMaxDamageString = '';
    if(Array.isArray(currentResult.damage[0])) {// ie Parental Bond damage
        minMaxDamageString += (currentResult.damage[0][MIN_DAMAGE_IN_ARRAY] || 0) * numberOfHits;
        minMaxDamageString += "-" + (currentResult.damage[0][MAX_DAMAGE_IN_ARRAY] || 0) * numberOfHits + " & ";
        minMaxDamageString += (currentResult.damage[1][MIN_DAMAGE_IN_ARRAY] || 0) * numberOfHits;
        minMaxDamageString += "-" + (currentResult.damage[1][MAX_DAMAGE_IN_ARRAY] || 0) * numberOfHits;
    } else {
        minMaxDamageString += (currentResult.damage[MIN_DAMAGE_IN_ARRAY]|| 0) * numberOfHits;
        minMaxDamageString += "-" + (damageResults[resultToShow].damage[MAX_DAMAGE_IN_ARRAY] || 0) * numberOfHits;
    }
    return {chanceForKO, numberOfHits, minMaxDamageString};
}

function ResultView(props){
    const {theme} = useContext(ThemeContext);
    const {damageResults, resultToShow, setResultToShow,
        weather, setWeather, weatherConditions, 
        terrain, setTerrain, terrains} = props;
    if(!damageResults || damageResults.length < 2){
        console.error(`Bad length of damage array: ${damageResults? damageResults.length: -1}`);
    }
    const {chanceForKO, numberOfHits, minMaxDamageString} = getDamageMessage(damageResults, resultToShow);

    return(
        <View style={{...styles.resultContainer, borderColor:theme.divider}}>
            <View style={{ backgroundColor:theme.header,}}>
                <Text style={{...styles.titleText, color:theme.titleText, fontWeight:'bold',}}>
                    {'Result'}
                </Text>
            </View>
            <View>
                <Text style={{...styles.titleText, color: theme.titleText}}>
                    {minMaxDamageString}
                    {' damage'}
                    {numberOfHits > 1? ` (${numberOfHits} hits)`: ''}
                    {'\n' + chanceForKO}
                </Text>
            </View>
            <RowWrapper
                padding={0}
                titleTextViewStyle={styles.titleTextView}
                titleFontSize={17}
                message={'Weather:'}>
                <PressActivatedModalContainer message={weather.name}>
                    <PickerView 
                        pickedItem={weather} 
                        setPickedItem={setWeather} 
                        data={weatherConditions} />
                </PressActivatedModalContainer>
            </RowWrapper>
            <RowWrapper
                padding={0}
                titleTextViewStyle={styles.titleTextView}
                titleFontSize={17}
                message={'Terrain:'}>
                <PressActivatedModalContainer message={terrain.name}>
                    <PickerView 
                        pickedItem={terrain} 
                        setPickedItem={setTerrain} 
                        data={terrains} />
                </PressActivatedModalContainer>
            </RowWrapper>
                        
            <ArrowPressable
                resultToShow={resultToShow}
                setResultToShow={setResultToShow}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    resultContainer: {
        flex:1,
        justifyContent:'flex-start',

        overflow:'hidden',
        margin:dimens.mainMargin,
        borderWidth: 1,
        borderRadius:dimens.headerFooterRadius,
    },
    arrowContainer: {
        alignItems:'center',
        justifyContent:'center',
        aspectRatio: 3,
    },
    titleTextView: {
        flex: 1,
        alignSelf: 'center',
    },
    titleText:{
        textAlign: 'center',
        fontSize: 20,
        padding: 5,
    },
    arrowText:{
        textAlign:'center',
    },
    
});

export default ResultView;