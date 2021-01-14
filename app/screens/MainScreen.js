import React, {useEffect, useReducer, useState } from 'react';
import { 
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    Pressable,
     } from 'react-native';

import colors from '../config/colors';

import ResultView from '../components/ResultView';
import PokemonSetCollapsible from '../components/PokemonSetCollapsible';
import DatabaseService from '../services/DatabaseService';
import PokemonDataService from '../services/PokemonDataService'

const PokemonSet = require('../models/pokemonSet');

let currentGeneration = 7;
const pokemonDataService = PokemonDataService(currentGeneration);
const databaseService = DatabaseService(17);
// // databaseService.deleteAll();
databaseService.init();

function pokemonSetReducer(state, action){
    const {pokemon, moves, item, nature, ivs, evs} = state;
    switch (action.type) {
        case 'changeAll':{
            const {pokemon, moves, item, nature, ivs, evs} = action.payload;
            return new PokemonSet(pokemon, moves, item, nature, ivs, evs);
        }
        case 'changePokemon':
            return new PokemonSet(action.payload, pokemonDataService.defaultMove, item, nature);
        case 'changeMove':
            return new PokemonSet(pokemon, action.payload, item, nature, ivs, evs);
        case 'changeIvs':
            return new PokemonSet(pokemon, moves, item, nature, action.payload, evs);
        case 'changeEvs':
            return new PokemonSet(pokemon, moves, item, nature, ivs, action.payload);
        case 'changeItem':
            return new PokemonSet(pokemon, moves, action.payload, nature, ivs, evs);
        case 'changeNature':
            return new PokemonSet(pokemon, moves, item, action.payload, ivs, evs);
        default:
            throw new Error('BAD action.type in pokemonSetReducer');
    }
}


function MainScreen({navigation}) {    
    const defaultSet = new PokemonSet(pokemonDataService.defaultPokemon, pokemonDataService.defaultMove, 
        pokemonDataService.itemsPerGen[0], pokemonDataService.natures[1]);
    const [pokemonSet1, dispatchPokemon1] = useReducer(pokemonSetReducer, defaultSet);
    const [pokemonSet2, dispatchPokemon2] = useReducer(pokemonSetReducer, defaultSet);
    const [damageResults, setDamageResults] = useState(pokemonDataService.simpleCalculate(pokemonSet1, pokemonSet2));
    const [resultToShow, setResultToShow] = useState(0);
    
    useEffect(() => {
        setDamageResults(pokemonDataService.simpleCalculate(pokemonSet1, pokemonSet2));
        console.log(`MAIN: ${pokemonSet1.pokemon.name} ${pokemonSet1.moves.name} ${pokemonSet1.item.name} ${pokemonSet1.nature.name}\
         ${pokemonSet2.pokemon.name} ${pokemonSet2.moves.name} ${pokemonSet2.item.name} ${pokemonSet2.nature.name}`);
         
    }, [pokemonSet1, pokemonSet2]);
    
    return (
        <SafeAreaView id='mainViewId' style={styles.mainView}>
            <ScrollView
                style={styles.collapsiblesContainer}
                keyboardShouldPersistTaps={'always'}
            >                
                <PokemonSetCollapsible 
                    allPokemonData={pokemonDataService}
                    databaseService={databaseService}
                    pokemonSet={pokemonSet1}
                    dispatchPokemon={dispatchPokemon1}
                    pokemonNumber={1}
                    navigation={navigation}
                />
                <ResultView
                    textStyle={styles.titleText}
                    damageResults={damageResults}
                    resultToShow={resultToShow}
                    setResultToShow={setResultToShow}
                />
                <PokemonSetCollapsible 
                    allPokemonData={pokemonDataService}
                    databaseService={databaseService}
                    pokemonSet={pokemonSet2}
                    dispatchPokemon={dispatchPokemon2}
                    pokemonNumber={2}
                    navigation={navigation}
                />

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({  
    mainView: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    collapsiblesContainer: {
		flex: 1,
		backgroundColor: colors.primary,
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
    pressableInnerText:{
        textAlign:'center',
        fontSize: 20,  
        padding: 10,        
    },
    
});

export default MainScreen;