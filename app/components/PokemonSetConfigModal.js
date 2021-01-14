import React, { useState } from 'react';
import { 
    Dimensions,
    Modal,
    Pressable,
    FlatList,
    SafeAreaView,
    StyleSheet, 
    Text, 
    View,} from 'react-native';

import colors from '../config/colors';

function Item(props){
    const {item, setIsModalVisible, databaseService, 
        dispatchPokemon, isInDeleteMode, setIsInDeleteMode, setShouldRefresh} = props;
    const {id, pokemon_set} = item;
    return (
        <Pressable
            style={{...styles.pressableWrapper, alignSelf:'stretch'} }
            style={({pressed}) => [{opacity: pressed? 0.5 : 1}, styles.pressableWrapper]}
            activeOpacity={0.3}
            onPress={() => {
                if(isInDeleteMode){
                    databaseService.deleteSet(id);
                    setShouldRefresh(true);
                } else {
                    setIsInDeleteMode(false);
                    setIsModalVisible(false);
                    databaseService.getSet(id, dispatchPokemon);
                }
            }}
        ><View>
            <Text style={styles.textListItem}>{pokemon_set} </Text>
        </View>
        </Pressable>
  );
}

function PokemonSetConfigModal(props){
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
        />
    );

    return (
        <SafeAreaView style={{...styles.modalSelectorContainer}}>
            <Modal
                transparent={false}
                animationType="slide"
                visible={isModalVisible}>
                <View style={styles.centeredView} >
                    <View style={[styles.modalView, 
                                    !(isInDeleteMode)? styles.modalView : {borderColor:'red'}]} >
                        <SafeAreaView style={styles.resultsFlatListContainer} >
                            <Text style={{...styles.pressableInnerText, 
                                color:colors.titleText, fontWeight:'bold', 
                                backgroundColor:colors.header}}>
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
                            <Pressable
                                style={styles.pressableWrapper}
                                style={({pressed}) => [{opacity: pressed? 0.5 : 1}, styles.pressableWrapper]}
                                activeOpacity={0.3}
                                onPress={() => {
                                    setIsInDeleteMode(false);
                                    setIsModalVisible(false);
                                }}
                                >
                                <Text style={styles.pressableInnerText}>Done</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.pressableWrapper, 
                                    !(isInDeleteMode)? styles.notInDeleteColor : styles.inDeleteColor]}
                                activeOpacity={0.3}
                                onPress={() => setIsInDeleteMode(!isInDeleteMode)}
                                >
                                { !isInDeleteMode &&<Text style={styles.pressableInnerText}>Delete Mode</Text>}
                                { isInDeleteMode &&<Text style={styles.pressableInnerText}>Back To Safety</Text>}
                            </Pressable>
                        </SafeAreaView>
                    </View>
                </View>    
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    modalSelectorContainer: {
        flex:0,
        alignItems:'center',
        justifyContent:'center',
           
    },
    centeredView: {
        padding:10,
    },
    modalView: {
        backgroundColor:colors.primary,
        borderRadius: 10,
        overflow:'hidden',

        borderColor:'black',
        borderWidth:2,
        elevation: 5,
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
    textListItem: {
        padding:10,
        fontSize: 17,  
        textAlign: 'center',
        color: 'black',
    },     
    pressableWrapper:{
        flex:0, 
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

export default PokemonSetConfigModal;