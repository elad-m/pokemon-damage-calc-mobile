import React, { useState, useContext } from 'react';
import { 
    KeyboardAvoidingView,
    Pressable,
    FlatList,
    TextInput,
    StyleSheet,
    Text, 
    View, 
    Keyboard,
    Platform,} from 'react-native';

import colors from '../config/colors';
import dimens from '../config/dimens';
import ThemeContext from '../config/ThemeContext';
import GenericModal from './GenericModal';
import GenericPressable from './GenericPressable';


function getQueryItem(queryResults, defaultSelection){
    return queryResults.length > 0? queryResults[0]: defaultSelection;
}

function ClearButton(props){
    // for now only deletes the text and not the pokemon
    const {allResults, searchText, setSearchText, setQueryResults, theme} = props;
    function handleClear(){
        setSearchText('');
        setQueryResults(allResults);
    }
    return (
        <Pressable
            style={[{...styles.clearButtonWrapper, borderColor:theme.border}, styles.clearButton, !(searchText)? styles.clearButtonOpaque: styles.clearButton]}
            onPress={handleClear}>
            <Text style={{...styles.clearButtonInnerText, color:theme.titleText}}>Clear</Text>
        </Pressable>
    );
}

function ItemPickerTextInput(props){
    const {theme} = useContext(ThemeContext);
    const { selected, setSelected, message,
        queryFunction, allResults, defaultSelection,
        searchText, setSearchText, 
        queryResults, setQueryResults, 
        areResultsVisible, setResultsVisible} = props;
    return (
        <KeyboardAvoidingView
            style={styles.textInputContainer}
            behavior={Platform.OS == 'ios'? 'padding': 'height'}
        >
            <TextInput 
                style={{...styles.modalSelectorTextInput, backgroundColor:theme.secondary,
                    color:theme.titleText, borderColor:theme.divider}}
                maxLength={20}
                placeholder={`Enter a ${message.toLowerCase()}'s name`}
                
                placeholderTextColor={theme.secondaryText}
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
        </KeyboardAvoidingView>
    );
}

function Item(props){
    const {item, setSearchText, setResultsVisible, setSelected, theme} = props;
    function onItemPress(){
        setSelected(item);
        setSearchText(item.name);
        Keyboard.dismiss();
        setResultsVisible(false);
    }
    return (
        <GenericPressable
            onPressFunc={onItemPress}
            text={item.name}
            fontSize={17}
            pressableMargin={5}
        >
            {item.more && <Text style={{...styles.textListItem, color:theme.titleText}}>{item.more}</Text>}
        </GenericPressable>
  );
}

function SearchableModalSelector({padding=5,paddingTop, ...props}){
    const {theme} = useContext(ThemeContext);
    const {pressableFlex, rootViewFlex=1} = props;

    const [areResultsVisible, setResultsVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [queryResults, setQueryResults] = useState(props.allResults);
    
    const renderItem = ({ item }) => (
        <Item
            key={item.name} 
            item={item}
            setSearchText={setSearchText}
            setResultsVisible={setResultsVisible}
            setSelected={props.setSelected}
            theme={theme}
        />
    );

    return (
        <View style={{flex:rootViewFlex, justifyContent:'center', alignItems:'center',
            padding:padding, paddingTop:paddingTop}}>
            <GenericModal 
                isModalVisible={areResultsVisible}
                modalViewFlex={1}>
                <ItemPickerTextInput
                    {...props}
                    searchText={searchText}
                    setSearchText={setSearchText}
                    queryResults={queryResults}
                    setQueryResults={setQueryResults}
                    areResultsVisible={areResultsVisible}
                    setResultsVisible={setResultsVisible}
                />
                <View style={{...styles.resultsFlatListContainer, 
                    backgroundColor:theme.primary}} >
                    
                    <FlatList
                        keyboardShouldPersistTaps='handled' // so that list items are pressable when keyboard up
                        data={queryResults}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}/>
                </View>
                <View style={{...styles.resultsListButtonsRowView, 
                    backgroundColor:theme.header}}>
                    <GenericPressable
                        minHeight={20}
                        onPressFunc={() => {
                            setResultsVisible(false);
                            setSearchText(props.selected.name || props.selected);
                        }}
                        text={'Done'}
                    />
                    <ClearButton
                        allResults={props.allResults}
                        searchText={searchText}
                        setSearchText={setSearchText}
                        setQueryResults={setQueryResults}
                        theme={theme}
                    />
                </View>
            </GenericModal>
            <GenericPressable
                onPressFunc={() => setResultsVisible(true)}
                text={props.selected.name || props.selected}
                pressableFlex={pressableFlex}
                fontSize={props.selectorFontSize}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    clearButtonWrapper:{
        flex:1,
        alignSelf:'stretch',
        margin:dimens.secondaryMargin,
        borderRadius: dimens.defaultBorderRadius,
        borderWidth:dimens.defaultBorderWidth,
        elevation:dimens.defaultElevation,

        shadowColor: "black", // ios only
        shadowOffset: {
          width: 5,
          height: 5
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    clearButtonInnerText:{
        textAlign:'center',
        fontSize: 20,  
        padding: 10,        
    },
    clearButton: {
        backgroundColor:colors.clearButton,
    },
    clearButtonOpaque: {
        backgroundColor:colors.opaqueClearButton
    },
    textInputContainer:{
        flex:0,
    },
    modalSelectorTextInput: {
        
        flex:0,
        zIndex:1,
        minHeight: 60,
        fontSize:17,
        textAlign:'center',
        margin:dimens.mainMargin,

        borderWidth:dimens.defaultBorderWidth,
        borderRadius:dimens.defaultBorderRadius,
    },
    resultsFlatListContainer: {
        flex:1,
    },
    resultsListButtonsRowView:{
        flex:0,
        flexDirection:'row', 
        borderBottomEndRadius:10,
        borderBottomStartRadius:10, 
    },
    textListItem: {
        padding:10,
        fontSize: 17,  
        textAlign: 'center',
    },     

});

export default SearchableModalSelector;