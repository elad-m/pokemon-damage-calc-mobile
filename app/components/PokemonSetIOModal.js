import React, { useState, useContext } from 'react';
import { 
    Dimensions,
    Pressable,
    FlatList,
    SafeAreaView,
    StyleSheet, 
    Text, 
    View,} from 'react-native';

import colors from '../config/colors';
import dimens from '../config/dimens';
import ThemeContext from '../config/ThemeContext';
import GenericModal from './GenericModal';
import GenericPressable from './GenericPressable';

function Item(props){
    const {item, setIsModalVisible, databaseService, 
        dispatchPokemon, isInDeleteMode, setIsInDeleteMode, setShouldRefresh} = props;
    const {id, pokemon_set} = item;

    function onItemPress(){
        if(isInDeleteMode){
            databaseService.deleteSet(id);
            setShouldRefresh(true);
        } else {
            setIsInDeleteMode(false);
            setIsModalVisible(false);
            databaseService.getSet(id, dispatchPokemon);
        }
    }
    return (
        <GenericPressable
            onPressFunc={onItemPress}
            text={pokemon_set}
            fontSize={17}
        />
  );
}

/**Essentially the database GUI */
function PokemonSetIOModal(props){
    const {theme} = useContext(ThemeContext);
    const {isModalVisible, setIsModalVisible, databaseService,dispatchPokemon,
        savedSets, setShouldRefresh} = props;
    const [isInDeleteMode, setIsInDeleteMode] = useState(false);

    const renderItem = ({ item }) => (
        <Item
            key={item.id} 
            item={item}
            setIsModalVisible={setIsModalVisible}
            dispatchPokemon={dispatchPokemon}
            databaseService={databaseService}
            isInDeleteMode={isInDeleteMode}
            setIsInDeleteMode={setIsInDeleteMode}
            setShouldRefresh={setShouldRefresh}
            theme={theme}
        />
    );

    return (
        <SafeAreaView style={{...styles.modalSelectorContainer}}>
            <GenericModal
                isModalVisible={isModalVisible}       
                mostInnerViewStyle={[{...styles.modalView, borderColor:theme.divider}, 
                    !(isInDeleteMode)? styles.modalView : {borderColor:'red'}]}>
                <View style={{...styles.resultsFlatListContainer,
                    backgroundColor:theme.primary}} >
                        <Text style={{...styles.pressableInnerText, 
                            color:theme.titleText, fontWeight:'bold', 
                            backgroundColor:theme.header}}>
                            {'Your Saved Sets'}
                        </Text>
                        {isInDeleteMode && 
                            <Text style={styles.deleteModeMessage}>
                                Tap the sets you want to delete
                            </Text>}
                        <FlatList
                            keyboardShouldPersistTaps='handled' // so that list items are pressable when keyboard up
                            data={savedSets}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id.toString()}
                        />
                    <View style={{flexDirection:'row'}}>
                        <GenericPressable
                            minHeight={20}
                            onPressFunc={() => {
                                setIsInDeleteMode(false);
                                setIsModalVisible(false);
                            }}
                            text={'Done'}
                        />
                        <Pressable
                            style={[{...styles.pressableWrapper, borderColor:theme.divider}, 
                                !(isInDeleteMode)? styles.notInDeleteColor : styles.inDeleteColor]}
                            onPress={() => setIsInDeleteMode(!isInDeleteMode)}
                            >
                            { !isInDeleteMode &&<Text style={styles.pressableInnerText}>Delete Mode</Text>}
                            { isInDeleteMode &&<Text style={styles.pressableInnerText}>Back To Safety</Text>}
                        </Pressable>
                    </View>
                </View>
            </GenericModal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    modalSelectorContainer: {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    modalView: {
        flex: 0,
        borderRadius: dimens.defaultBorderRadius,
        overflow:'hidden',
        borderWidth:dimens.defaultBorderWidth + 1,
        elevation: dimens.defaultElevation + 1,

        shadowColor: "black",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    resultsFlatListContainer: {    
        height:Dimensions.get('window').height*0.9,
    },
    pressableWrapper:{
        flex:1, 
        alignSelf:'stretch',
        margin:dimens.secondaryMargin,
        borderRadius: 10,   
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
    deleteModeMessage:{
        flex: 0, 
        flexDirection:'row', 
        alignSelf:'stretch',
        textAlign:'center',
        padding:2, 
        backgroundColor:colors.opaqueClearButton
    },    
    notInDeleteColor: {
        backgroundColor: colors.clearButton
    },
    inDeleteColor: {
        backgroundColor: colors.opaqueClearButton
    },
});

export default PokemonSetIOModal;