import React, { useState } from 'react';
import { 
    Dimensions,
    Modal,
    Pressable,
    FlatList,
    TextInput,
    SafeAreaView,
    StyleSheet, 
    Text, 
    View, 
    Keyboard,} from 'react-native';

import colors from '../config/colors';

function getQueryItem(queryResults, itemType, allPokemonData){
    const typeDefault = itemType ==='pokemon'? 
        allPokemonData.defaultPokemon: 
        allPokemonData.defaultMove;
    return queryResults.length > 0? queryResults[0]: typeDefault;
}


function ClearButton(props){
    // for now only deletes the text and not the pokemon
    function handleClear(){
        props.setItemText('');
        props.itemType === 'pokemon'? 
            props.setQueryResults(props.allPokemonData.pokedexPerGen): 
            props.setQueryResults(props.allPokemonData.movesPerGen); 
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
    const queryFunction = props.itemType ==='pokemon'? 
        props.allPokemonData.findAllPokemonStartWith: 
        props.allPokemonData.findAllMovesStartWith;
    console.log(`query function: ${queryFunction}`);
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
                    const pickedItem = getQueryItem(props.queryResults, props.itemType, props.allPokemonData);
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
                            allPokemonData={props.allPokemonData}
                            itemText={props.itemText}
                            setItemText={props.setItemText}
                            queryResults={props.queryResults}
                            setQueryResults={props.setQueryResults}
                            setResultsVisible={props.setResultsVisible}        
                            itemType={props.itemType}
                        />
                        <SafeAreaView style={styles.resultsFlatListContainer} >
                            <FlatList
                                keyboardShouldPersistTaps='always' // so that list items are pressable when keyboard up
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
                                allPokemonData={props.allPokemonData}
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
    const initQueryResults = props.itemType === 'pokemon'? 
        props.allPokemonData.pokedexPerGen : 
        props.allPokemonData.movesPerGen;
    const [queryResults, setQueryResults] = useState(initQueryResults);
    const [areResultsVisible, setResultsVisible] = useState(false);

    console.log(`PICKER: item: ${props.selectedItem.name}\tqueryRes[0]: ${getQueryItem(queryResults, props.itemType, props.allPokemonData).name}\ttext: ${props.itemText}`);
  
    return (
        <View style={styles.itemPickerContainer}>
            <ItemResultsModalList
                itemText={props.itemText}
                setItemText={props.setItemText}
                allPokemonData={props.allPokemonData}
                selectedItem={props.selectedItem}
                setSelectedItem={props.setSelectedItem}
                queryResults={queryResults}
                setQueryResults={setQueryResults}
                areResultsVisible={areResultsVisible}
                setResultsVisible={setResultsVisible}
                itemType={props.itemType}
            />

            {/* Attacker/Defender and picker button*/}
            <View style={styles.itemPickerRow}>
                <View style={styles.titleTextView}>
                    <Text style={styles.titleText}>
                        {props.message}:
                    </Text>
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

function Picker(props){
    const [pokemonText, setPokemonText] = useState('');
    return(
        <ItemPicker 
            selectedItem={props.selectedItem}
            setSelectedItem={props.setSelectedItem}
            allPokemonData={props.allPokemonData}
            itemText={pokemonText}
            setItemText={setPokemonText}
            itemType={props.itemType}
            message={props.message}
        />
    );
}

const styles = StyleSheet.create({
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

export default Picker;