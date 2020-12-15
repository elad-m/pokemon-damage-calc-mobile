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


function getQueryItem(queryResults, defaultSelection){
    return queryResults.length > 0? queryResults[0]: defaultSelection;
}

function ClearButton(props){
    // for now only deletes the text and not the pokemon
    const {allResults, searchText, setSearchText, setQueryResults} = props;
    function handleClear(){
        setSearchText('');
        setQueryResults(allResults);
    }
    return (
        <Pressable
            android_ripple={{radius: 10}} 
            style={[styles.pressableWrapper, styles.clearButton, !(searchText)? styles.clearButtonOpaque: styles.clearButton]}
            onPress={handleClear}>
            <Text style={styles.pressableInnerText}>Clear</Text>
        </Pressable>
    );
}

function ItemPickerTextInput(props){
    const { selected, setSelected, message,
        queryFunction, allResults, defaultSelection,
        searchText, setSearchText, 
        queryResults, setQueryResults, 
        areResultsVisible, setResultsVisible} = props;
    return (
        <View style={styles.modalSelectorTextInputContainer}>
            <TextInput 
                style={styles.modalSelectorTextInput}
                maxLength={20}
                placeholder={`Enter a ${message.toLowerCase()}'s name`}
                onFocus={e => {
                    setQueryResults(queryFunction(searchText));
                }}
                onChangeText={text => {
                    setSearchText(text);
                    setQueryResults(queryFunction(text));
                }}
                onSubmitEditing={e => {
                    const pickedItem = getQueryItem(queryResults, defaultSelection);
                    setSelected(pickedItem); //logic
                    setSearchText(pickedItem.name);// ui
                    // removing stuff
                    Keyboard.dismiss();
                    setResultsVisible(false);
                }}
                value={searchText}
            />
        </View>
    );
}


function Item(props){
    const {item, setSearchText, setResultsVisible, setSelected} = props;
    return (
        <Pressable
            style={{...styles.pressableWrapper, alignSelf:'stretch'} }
            style={({pressed}) => [
                {opacity: pressed? 0.5 : 1}, styles.pressableWrapper
            ]}
            activeOpacity={0.3}
            underlayColor={'black'}
            onPress={() => {
                setSelected(item);
                setSearchText(item.name);
                Keyboard.dismiss();
                setResultsVisible(false);
            }}
        >
            <Text style={styles.textListItem}>{item.name}</Text>
        </Pressable>
  );
}
  

function ItemResultsModalList(props){
    const renderItem = ({ item }) => (
        <Item 
            item={item}
            setSearchText={props.setSearchText}
            setResultsVisible={props.setResultsVisible}
            setSelected={props.setSelected}
        />
    );
    function ListSeparator(){
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
                            {...props}        
                        />
                        <SafeAreaView style={styles.resultsFlatListContainer} >
                            <FlatList
                                keyboardShouldPersistTaps='always' // so that list items are pressable when keyboard up
                                ItemSeparatorComponent={ListSeparator}
                                data={props.queryResults}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id}
                            />
                        </SafeAreaView>
                        <View style={styles.resultsListButtonsRowView}>
                            {/* Done Button*/}
                            <Pressable
                                android_ripple={{radius: 10}}
                                onPress={() => {
                                    props.setResultsVisible(false);
                                    props.setSearchText(props.selected.name);
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
                                allResults={props.allResults}
                                searchText={props.searchText}
                                setSearchText={props.setSearchText}
                                setQueryResults={props.setQueryResults}
                            />
                        </View>
                    </View>
                </View>    
            </Modal>
        </SafeAreaView>
    );
}

function ModalSelector(props){
    
    const [searchText, setSearchText] = useState('');
    const [queryResults, setQueryResults] = useState(props.allResults);
    const [areResultsVisible, setResultsVisible] = useState(false);

    console.log(`PICKER: item: ${props.selected.name}\tqueryRes[0]: ${getQueryItem(queryResults, props.itemType, props.allPokemonData).name}\ttext: ${props.itemText}`);
  
    return (
        <View style={styles.modalSelectorContainer}>
            <ItemResultsModalList
                {...props} // all, default and query function
                searchText={searchText}
                setSearchText={setSearchText}
                queryResults={queryResults}
                setQueryResults={setQueryResults}
                areResultsVisible={areResultsVisible}
                setResultsVisible={setResultsVisible}
            />
            <Pressable
                onPress={() => {
                    setResultsVisible(true);
                }}
                style={{...styles.pressableWrapper, flex:0}}
                style={({pressed}) => [
                    {opacity: pressed? 0.5 : 1}, {...styles.pressableWrapper, flex:0}
                    ]}>
                <Text style={styles.pressableInnerText}>
                    {props.selected.name}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    modalSelectorContainer: {
        flex:1,
        alignItems:'center',
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
    modalSelectorTextInputContainer:{
        padding:10,
    },
    modalSelectorTextInput: {
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
    textListItem: {
        padding:10,
        fontSize: 17,  
        textAlign: 'center',
        color: 'black',
    },     

});

export default ModalSelector;