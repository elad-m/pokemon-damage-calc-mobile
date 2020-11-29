
import React, { useState } from 'react';
import { 
    StatusBar,
    Dimensions,
    Modal,
    Pressable,
    FlatList,
    TextInput,
    SafeAreaView,
    StyleSheet, 
    Text, 
    View, 
    Keyboard,
    Platform,} from 'react-native';

import colors from '../config/colors';

const  {calculate, Generations, Pokemon, Move} = require('@smogon/calc') ;

const POKEMON_ROLE = {'at': 'Attacker', 'df': 'Defender'};

const gen = Generations.get(7); 

// loading all pokemon species
const pokedexPerGen = Array.from(gen.species).sort((a, b) => a.name > b.name);
const defaultPokemon = pokedexPerGen[0];

// loading all moves 
const movesPerGenWithNoMove = Array.from(gen.moves).sort((a, b) => a.name > b.name);
movesPerGenWithNoMove.shift();
const movesPerGen = movesPerGenWithNoMove;
const defaultMove = movesPerGen.find(move => move.name === 'Tackle');

function getQueryItem(queryResults, itemType){
    const typeDefault = itemType ==='pokemon'? defaultPokemon: defaultMove;
    return queryResults.length > 0? queryResults[0]: typeDefault;
}

function findAllPokemonStartWith(query){
    return pokedexPerGen.filter(pokemon =>  pokemon.name.startsWith(query));
}

function findAllMovesStartWith(query){
    return movesPerGen.filter(move => move.name.startsWith(query));
}

function ClearButton(props){
    // for now only deletes the text and not the pokemon
    function handleClear(){
        props.setItemText('');
        props.itemType === 'pokemon'? 
            props.setQueryResults(pokedexPerGen): 
            props.setQueryResults(movesPerGen); 
    }
    return (
        <Pressable
            android_ripple={{radius: 10}} 
            style={[styles.pressableWrapper, styles.clearButton, !(props.itemText)? styles.clearButtonOpaque: styles.clearButton]}
            onPress={handleClear}>
            <Text style={styles.pressableInnerText}>Clear</Text>
        </Pressable>
    );
}

function ItemPickerTextInput(props){
    const queryFunction = props.itemType ==='pokemon'? findAllPokemonStartWith: findAllMovesStartWith;
   
    return (
        <View style={styles.itemPickerTextInputContainer}>
            <TextInput 
                style={styles.itemPickerTextInput}
                maxLength={20}
                placeholder={`Enter a ${props.itemType}'s name`}
                onFocus={e => {
                    console.log('onFocus');
                    props.setQueryResults(queryFunction(props.itemText));
                }}
                onChangeText={text => {
                    console.log('onChangeText');
                    props.setItemText(text);
                    props.setQueryResults(queryFunction(text));
                }}
                onSubmitEditing={e => {
                    console.log('onSubmitEditing');
                    const pickedItem = getQueryItem(props.queryResults, props.itemType);
                    props.setSelectedItem(pickedItem); //logic
                    props.setItemText(pickedItem.name);// ui
                    // removing stuff
                    Keyboard.dismiss();
                    props.setResultsVisible(false);
                }}
                value={props.itemText}
            />
        </View>
    );
}


function Item(props){
    return (
        <Pressable
            style={{...styles.pressableWrapper, alignSelf:'stretch'} }
            style={({pressed}) => [
                {opacity: pressed? 0.5 : 1}, styles.pressableWrapper
            ]}
            activeOpacity={0.3}
            underlayColor={'black'}
            onPress={() => {
                props.setSelectedItem(props.item);
                props.setItemText(props.item.name)
                Keyboard.dismiss();
                props.setResultsVisible(false);
            }}
        >
            <Text style={styles.textListItem}>{props.item.name}</Text>
        </Pressable>
  );
}
  

function ItemResultsModalList(props){
    const renderItem = ({ item }) => (
        <Item 
            item={item}
            setItemText={props.setItemText}
            setResultsVisible={props.setResultsVisible}
            setSelectedItem={props.setSelectedItem}
        />
    );
    function ListSeparator(props){
        return (<View style={{height: 1, backgroundColor: colors.titleText}}/>);
    }
    return (
        <SafeAreaView >
            <Modal
                transparent={true}
                animationType="slide"
                visible={props.areResultsVisible}>
                <View style={{...styles.centeredView, }} >
                    <View style={{...styles.modalView, }} >
                        <ItemPickerTextInput
                            selectedItem={props.selectedItem}
                            setSelectedItem={props.setSelectedItem}
                            itemText={props.itemText}
                            setItemText={props.setItemText}
                            queryResults={props.queryResults}
                            setQueryResults={props.setQueryResults}
                            setResultsVisible={props.setResultsVisible}        
                            itemType={props.itemType}
                        />
                        <SafeAreaView style={styles.resultsFlatListContainer} >
                            <FlatList
                                keyboardShouldPersistTaps='always' // so list items are pressable with keyboard up
                                ItemSeparatorComponent={ListSeparator}
                                style={styles.resultsFlatList}
                                data={props.queryResults}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id}
                            />
                        
                        </SafeAreaView>
                        <View style={styles.resultsListButtonsRowView}>
                            <Pressable
                                android_ripple={{radius: 10}}
                                onPress={() => {
                                    props.setResultsVisible(false);
                                    props.setItemText(props.selectedItem.name);
                                }}
                                style={({pressed}) => [
                                    {
                                        opacity: pressed? 
                                        0.5:
                                        1
                                    },
                                        styles.pressableWrapper
                                ]}>
                                <Text style={styles.pressableInnerText}>
                                    Done
                                </Text>
                            </Pressable>
                                
                            <ClearButton
                                itemText={props.itemText}
                                setItemText={props.setItemText}
                                setQueryResults={props.setQueryResults}
                                itemType={props.itemType}
                            />
                        </View>
                    </View>
                </View>    
            </Modal>
        </SafeAreaView>
    );
}

function ItemPicker(props){
    //states regarding the autocomplete picker query results
    const initQueryResults = props.itemType === 'pokemon'? pokedexPerGen : movesPerGen;
    const [queryResults, setQueryResults] = useState(initQueryResults);
    const [areResultsVisible, setResultsVisible] = useState(false);

    console.log(`PICKER: item: ${props.selectedItem.name}\tqueryRes[0]: ${getQueryItem(queryResults, props.itemType).name}\ttext: ${props.itemText}`);
  
    return (
        <View style={styles.itemPickerContainer}>
            <ItemResultsModalList
                itemText={props.itemText}
                setItemText={props.setItemText}
                selectedItem={props.selectedItem}
                setSelectedItem={props.setSelectedItem}
                queryResults={queryResults}
                setQueryResults={setQueryResults}
                areResultsVisible={areResultsVisible}
                setResultsVisible={setResultsVisible}
                itemType={props.itemType}
            />
            <View style={styles.itemPickerRow}>
                <View style={styles.titleTextView}>
                    <Text style={styles.titleText}> {props.message}:</Text>
                </View>
                <Pressable
                    onPress={() => {
                        setResultsVisible(true);
                    }}
                    style={styles.pressableWrapper}
                    style={({pressed}) => [
                        {opacity: pressed? 0.5 : 1}, styles.pressableWrapper
                        ]}>
                    <Text style={styles.pressableInnerText}>
                    {props.selectedItem.name}
                    </Text>
                </Pressable>
            </View>
            <View style={{width:'100%', height:1, backgroundColor:'black'}}/>
        </View>
    );
}

function PickerView(props){
    const [pokemonText, setPokemonText] = useState('');
    return(
        <ItemPicker 
            
            selectedItem={props.selectedItem}
            setSelectedItem={props.setSelectedItem}
            itemText={pokemonText}
            setItemText={setPokemonText}
            itemType={props.itemType}
            message={props.message}
        />
    );
}

function makeSimpleCalculate(attacker, defender, move, setDamageResult){
    return (() => {
        const result = calculate(
            gen,
            new Pokemon(gen, attacker.name, {
            }),
            new Pokemon(gen, defender.name, {
            }),
            new Move(gen, move.name)
          );
        const resultDescription = result.fullDesc('%', false);
        console.log(`Result: ${resultDescription}`);
        setDamageResult(result)
    });
}



function MainScreen(props) {
    // pokemon and moves are now objects
    const [attacker, setAttacker] = useState(defaultPokemon);
    const [move, setMove] = useState(defaultMove);
    const [defender, setDefender] = useState(defaultPokemon);
    const [damageResult, setDamageResult] = useState({});
    const simpleCalculateWithProps = makeSimpleCalculate(attacker, defender, move, setDamageResult);

    console.log(`MAIN: attacker ${attacker.name} move: ${move.name} defender:${defender.name}`);
    return (
        <SafeAreaView id='mainViewId' style={styles.mainView}>
            <PickerView
                selectedItem={attacker}
                setSelectedItem={setAttacker}
                itemType='pokemon'
                message={POKEMON_ROLE.at}
            />
            <PickerView
                selectedItem={move}
                setSelectedItem={setMove}
                itemType='move'
                message='Move'
            />
            <PickerView
                selectedItem={defender}
                setSelectedItem={setDefender}
                itemType='pokemon'
                message={POKEMON_ROLE.df}
            />
            <View style={styles.itemPickerContainer}>
                <Text style={{...styles.titleText}}>
                    {damageResult.fullDesc? damageResult.fullDesc(): ''}
                </Text>
            </View>

            
            <View style={{...styles.itemPickerContainer,
                flexDirection: 'row', position:'absolute', bottom:20,  alignSelf:'center' }}>
                <Pressable
                    onPress={simpleCalculateWithProps}
                    style={{...styles.pressableWrapper}}
                    style={({pressed}) => [
                        {opacity: pressed? 0.5 : 1}, styles.pressableWrapper
                        ]}
                        >
                    <Text style={styles.pressableInnerText}>
                        Calculate!
                    </Text>
                </Pressable>
            </View>

        
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({  
    mainView: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    itemPickerContainer: {
        alignItems:'center',
    },
    itemPickerRow: {
        flexDirection:'row',
        justifyContent:'space-around',
        padding:5,
    },
    titleTextView: {
        flex:1, 
        alignSelf:'center',
    },
    titleText:{
        textAlign: 'center',
        color: 'black',
        fontSize: 20,
    },
    pressableWrapper:{
        flex:1, 
        alignSelf:'stretch',
        backgroundColor: colors.pressable,
        margin:5,
        borderRadius: 10,    
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
    onPressPressableWrapper: {
        opacity: 0.5
    },
    pressableInnerText:{
        textAlign:'center',
        fontSize: 20,  
        padding: 10,        
    },
    resultsListButtonsRowView:{
        flexDirection:'row', 
        justifyContent:'flex-start',
        backgroundColor:colors.header,
        borderBottomEndRadius:10,
        borderBottomStartRadius:10,
        elevation:2,
        
    },
    clearButton: {
        backgroundColor:colors.clearButton,
    },
    clearButtonOpaque: {
        backgroundColor:colors.opaqueClearButton
    },
    
    centeredView: {
        padding:10,
    },
    modalView: {
        backgroundColor:colors.primary,
        borderRadius: 10,

        borderColor:'black',
        borderWidth:1,
        elevation: 5,
        shadowColor: "black",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    itemPickerTextInputContainer:{
        padding:10,
    },
    itemPickerTextInput: {
        fontSize:17,
        textAlign:'center',
        padding:10,
        backgroundColor: 'white',
        borderColor:colors.titleText,
        borderWidth:1,
        borderRadius:10,
    },
    resultsFlatListContainer: {    
        height:Dimensions.get('window').height*0.4,
    },
    resultsFlatList:{
    },
    textListItem: {
        padding:10,
        fontSize: 17,  
        textAlign: 'center',
        color: 'black',
    },
       
     
});

export default MainScreen;
