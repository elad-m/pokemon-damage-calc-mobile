import React, { useState } from 'react';
import { 
    KeyboardAvoidingView,
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

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

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
            style={[styles.pressableWrapper, styles.clearButton, !(searchText)? styles.clearButtonOpaque: styles.clearButton]}
            activeOpacity={0.3}
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
        <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.modalSelectorTextInputContainer}
        scrollEnabled={false}
        >
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
        </KeyboardAwareScrollView>
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
            onPress={() => {
                setSelected(item);
                setSearchText(item.name);
                Keyboard.dismiss();
                setResultsVisible(false);
            }}
        ><View>
            <Text style={styles.textListItem}>{item.name}</Text>
            {item.more && <Text style={styles.textListItem}>{item.more}</Text>}
        </View>
        </Pressable>
  );
}
  

function ItemResultsModalList(props){
    const renderItem = ({ item }) => (
        <Item
            key={item.name} 
            item={item}
            setSearchText={props.setSearchText}
            setResultsVisible={props.setResultsVisible}
            setSelected={props.setSelected}
        />
    );
    return (
        <SafeAreaView>
            <Modal
                transparent={false}
                animationType="slide"
                visible={props.areResultsVisible}>
                <View style={{...styles.centeredView, }} >
                    <View style={{...styles.modalView, }}>
                        <View style={styles.resultsFlatListContainer} >
                            <ItemPickerTextInput
                                {...props}        
                            />
                            <FlatList
                                keyboardShouldPersistTaps='handled' // so that list items are pressable when keyboard up
                                data={props.queryResults}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id.toString()}/>
                        </View>
                        <View style={styles.resultsListButtonsRowView}>
                            {/* Done Button*/}
                            <Pressable
                                style={styles.pressableWrapper}
                                style={({pressed}) => [{opacity: pressed? 0.5 : 1}, styles.pressableWrapper]}
                                activeOpacity={0.3}
                                android_ripple={{radius: 10}}
                                onPress={() => {
                                    props.setResultsVisible(false);
                                    props.setSearchText(props.selected.name || props.selected);
                                }}
                                >
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

function SearchableModalSelector(props){
    const {containerFlex} = props;
    const [searchText, setSearchText] = useState('');
    const [queryResults, setQueryResults] = useState(props.allResults);
    const [areResultsVisible, setResultsVisible] = useState(false);
    return (
        <View style={{...styles.modalSelectorContainer, 
            flex: containerFlex
        }}>
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
                style={{...styles.pressableWrapper,flex:0}}
                style={({pressed}) => [{opacity: pressed? 0.5 : 1}, {...styles.pressableWrapper,flex:0}]}
                activeOpacity={0.3}>
                <Text style={{...styles.pressableInnerText, fontSize: props.selectorFontSize}}>
                    {props.selected.name || props.selected}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    modalSelectorContainer: {
        flex:1,
        justifyContent:'center',
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
    pressableInnerText:{
        textAlign:'center',
        fontSize: 20,  
        padding: 10,        
    },
    resultsListButtonsRowView:{
        flexDirection:'row', 
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
        justifyContent: 'center',
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
        height:Dimensions.get('window').height*0.5,
    },
    textListItem: {
        padding:10,
        fontSize: 17,  
        textAlign: 'center',
        color: 'black',
    },     

});

export default SearchableModalSelector;