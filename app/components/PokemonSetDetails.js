import React, {useState, useContext} from 'react';
import {
    ScrollView,
    TextInput,
    StyleSheet,
    View
} from 'react-native';
import PressActivatedModalContainer from './PressActivatedModalContainer';
import RowWrapper from './RowWrapper';
import SearchableModalSelector from './SearchableModalSelector';
import StatsTable from './StatsTable';
import PickerView from './PickerView';
import ThemeContext from '../config/ThemeContext';

function sanitizeLevelTextInput(text, min ,max){
    const parsed = parseInt(text);
    const minMaxSanitized =  isNaN(parsed)? 100: 
            (parsed < min? min
                : (parsed > max? max:
                    parsed));
    return minMaxSanitized;
}

function LevelTextInput({currentValue, setValue, minValue, maxValue}){
    const {theme} = useContext(ThemeContext);
    const [inputLevel, setInputLevel] = useState(currentValue);

    function submitInput(event){
        // not working on onFocus as I think is an expected use case 
        const parsedNumber = sanitizeLevelTextInput(inputLevel, minValue, maxValue);
        const parsedAsString = parsedNumber.toString();
        setInputLevel(parsedAsString);
        setValue(parsedAsString);
    }
    return (
        <View style={{flex:1,}}>
            <TextInput
                style={{...styles.inputCell, backgroundColor:theme.secondary,
                    borderColor:theme.divider, color:theme.titleText}}
                maxLength={3}
                fontSize={17}
                selectTextOnFocus={true}
                keyboardType={'numeric'}
                onChangeText={text => {
                    const parsedNumber = sanitizeLevelTextInput(text, minValue, maxValue);
                    const parsedAsString = parsedNumber.toString();
                    setInputLevel(parsedAsString);
                    setValue(parsedAsString);
                }}
                onSubmitEditing={submitInput}
                value={inputLevel}      
            />
        </View>
    );
}



function PokemonSetDetails(props){
    const {pokemonSet, dispatchPokemon, 
        items, natures, abilities, statusConditions} = props;
    return (
        <ScrollView contentContainerStyle={styles.sectionContent}
            keyboardShouldPersistTaps={'always'}
            >
            <RowWrapper
                titleTextViewStyle={styles.titleTextView}
                padding={0}
                titleFontSize={17}
                message={`Nature: `}>
                <SearchableModalSelector
                    pressableFlex={0}
                    selected={pokemonSet.nature}
                    setSelected= {(payload) => dispatchPokemon({type: 'changeNature', payload:payload})}
                    queryFunction={(query) => natures.filter(nature =>  nature.name.startsWith(query))}
                    allResults={natures}
                    defaultSelection={natures[0]}
                    message={'Nature'}
                    selectorFontSize={17}
                />
            </RowWrapper>
            <RowWrapper
                titleTextViewStyle={styles.titleTextView}
                padding={0}
                titleFontSize={17}
                message={`Item: `}>
                <SearchableModalSelector
                    pressableFlex={0}
                    selected={pokemonSet.item}
                    setSelected= {(payload) => dispatchPokemon({type: 'changeItem', payload:payload})}
                    queryFunction={(query) => items.filter(item =>  item.name.startsWith(query))}
                    allResults={items}
                    defaultSelection={items[0]}
                    message={'Item'}
                    selectorFontSize={17}
                />
            </RowWrapper>
            <RowWrapper
                titleTextViewStyle={styles.titleTextView}
                padding={0}
                titleFontSize={17}
                message={`Ability: `}>
                <SearchableModalSelector
                    pressableFlex={0}
                    selected={pokemonSet.ability}
                    setSelected= {(payload) => dispatchPokemon({type: 'changeAbility', payload:payload})}
                    queryFunction={(query) => abilities.filter(ability =>  ability.name.startsWith(query))}
                    allResults={abilities}
                    defaultSelection={pokemonSet.ability}
                    message={'Ability'}
                    selectorFontSize={17}
                />
            </RowWrapper>
            <RowWrapper
                titleTextViewStyle={styles.titleTextView}
                padding={0}
                titleFontSize={17}
                message={`Status: `}>
                <PressActivatedModalContainer 
                    message={pokemonSet.status.name}
                    pressableFlex={0}>
                    <PickerView 
                        pickedItem={pokemonSet.status} 
                        setPickedItem={(payload) => dispatchPokemon({type: 'changeStatus', payload:payload})} 
                        data={statusConditions} />
                </PressActivatedModalContainer>
            </RowWrapper>

            <RowWrapper 
                titleTextViewStyle={styles.titleTextView}
                padding={0}
                titleFontSize={17}
                message={`Level: `}>
                <LevelTextInput 
                    currentValue={pokemonSet.level.toString()}
                    setValue={(payload) => dispatchPokemon({type: 'changeLevel', payload:parseInt(payload)})}
                    minValue={1}
                    maxValue={100}/>
            </RowWrapper>
            <StatsTable
                pokemon={pokemonSet.pokemon}
                ivs={pokemonSet.ivs}
                setIvs={(payload) => dispatchPokemon({type: 'changeIvs', payload:payload})}
                evs={pokemonSet.evs}
                setEvs={(payload) => dispatchPokemon({type: 'changeEvs', payload:payload})}
                finalStats={pokemonSet.finalStats}
                />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    sectionContent: {
        flex:0,
        justifyContent:'flex-start',
        alignItems:'stretch',
        padding: 10,        
    },
    titleTextView: {
        flex: 1,
        alignSelf: 'center',
    },
    inputCell: {
        fontSize:15,
        textAlign:'center',
        margin:5,
        padding:5,
        borderWidth:1,
        borderRadius:10,
    },
})

export default PokemonSetDetails;