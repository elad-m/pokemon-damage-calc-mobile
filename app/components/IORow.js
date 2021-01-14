import React, {useState} from 'react';
import { useEffect } from 'react';
import { 
    Text,
    StyleSheet, 
    View, 
    Pressable,
} from 'react-native';

import colors from '../config/colors';
import dimens from '../config/dimens';

import RowWrapper from './RowWrapper';
import PokemonSetConfigModal from './PokemonSetConfigModal';


function IORow(props){
    const {databaseService, pokemonSet, dispatchPokemon} = props;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [savedSets, setSavedSets] = useState([]);
    const [shouldRefresh, setShouldRefresh] = useState(false);

    useEffect(() => {
        // got the 'Can't perform a React state update on an unmounted component'
        // but did not get it again so I don't know if the 'mounted' is necessary
        let mounted = true;
        function getAllSetsCallback(dbArray){
            const newSavedSets = [...dbArray];
            if(mounted) setSavedSets(newSavedSets);
        }
        databaseService.getAllSets(getAllSetsCallback);
        console.log('after getAllSets: ' + JSON.stringify(savedSets));
        setShouldRefresh(false);
        return () => {mounted = false};
    },[shouldRefresh])
    
    return (
        <RowWrapper>
            <PokemonSetConfigModal
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                databaseService={databaseService}
                dispatchPokemon={dispatchPokemon}
                savedSets={savedSets}
                setShouldRefresh={setShouldRefresh}
            />
            <Pressable 
                style={styles.pressableWrapper}
                style={({pressed}) => [{opacity: pressed? 0.5 : 1}, styles.pressableWrapper]}
                activeOpacity={0.3}
                onPress={() => {
                    databaseService.addSet(pokemonSet);
                    setShouldRefresh(true);
                }}
                >
                <Text style={styles.pressableInnerText}>Save</Text>
            </Pressable>
            <Pressable 
                style={styles.pressableWrapper}
                style={({pressed}) => [{opacity: pressed? 0.5 : 1}, styles.pressableWrapper]}
                activeOpacity={0.3}
                onPress={() => {
                    setIsModalVisible(true);
                }}
                >
                <Text style={styles.pressableInnerText}>Load</Text>
            </Pressable>
            {/* <Pressable 
                style={styles.pressableWrapper}
                style={({pressed}) => [{opacity: pressed? 0.5 : 1}, styles.pressableWrapper]}
                activeOpacity={0.3}
                onPress={() => databaseService.resetDataBase()}
                >
                <Text style={styles.pressableInnerText}>danger_reset</Text>
            </Pressable> */}
        </RowWrapper>

    );
}

const styles = StyleSheet.create({  
    setContainer: {
        flex:1,
        alignItems:'stretch',
        margin:dimens.mainMargin
    },
    pressableWrapper:{
        flex:1, 
        alignSelf:'center',
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
        fontSize: 12,  
        padding: 8,
    },
});

export default IORow;