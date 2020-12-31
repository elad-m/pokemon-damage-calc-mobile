
import React, {useEffect, useReducer, useState } from 'react';
import { 
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    ScrollView,
     } from 'react-native';

import colors from '../config/colors';

import ResultView from '../components/ResultView';
import PokemonSetCollapsible from '../components/PokemonSetCollapsible';


const  {calculate, Generations, Pokemon, Move, NATURES, ITEMS} = require('@smogon/calc') ;
const PokemonSet = require('../models/pokemonSet');

let currentGeneration = 7;
const GEN = Generations.get(currentGeneration); 

function getAllPokemonData(gen) {
    const pokedexPerGen = Array.from(gen.species).sort((a, b) => a.name > b.name);
    const defaultPokemon = pokedexPerGen[0];
    
    const movesPerGenWithNoMove = Array.from(gen.moves).sort((a, b) => a.name > b.name);
    movesPerGenWithNoMove.shift();
    const movesPerGen = movesPerGenWithNoMove; 
    const defaultMove = movesPerGen.find(move => move.name === 'Tackle');

    const itemsPerGen = ITEMS[currentGeneration].map((o, i) => {return {"name":o , "id":i}});
    const natures = Object.entries(NATURES).map((o,i) => {return {"name": `${o[0]}`, "more":`(+${o[1][0]},-${o[1][1]})`, "id":i}});

    return {pokedexPerGen, 
        defaultPokemon,
        movesPerGen,
        defaultMove,
        itemsPerGen,
        natures};
};

const allPokemonData = getAllPokemonData(GEN);

 function simpleCalculate(pokemonSet1, pokemonSet2){
    const pokemon1 = new Pokemon(GEN, pokemonSet1.pokemon.name, {
        evs: pokemonSet1.evs,
        ivs: pokemonSet1.ivs,
        level:50,
        item:pokemonSet1.item.name,
        nature: pokemonSet1.nature.name.split('(')[0]
    });
    const pokemon2 = new Pokemon(GEN, pokemonSet2.pokemon.name, {
        evs: pokemonSet2.evs,
        ivs: pokemonSet2.ivs,
        level: 50,
        item:pokemonSet2.item.name,
        nature: pokemonSet2.nature.name.split('(')[0]
    });
    const pokemon1move = new Move(GEN, pokemonSet1.moves.name);
    const pokemon2move = new Move(GEN, pokemonSet2.moves.name);

    const result1 = calculate(GEN, pokemon1, pokemon2, pokemon1move);
    const result2 = calculate(GEN, pokemon2, pokemon1, pokemon2move);

    return [result1, result2];
}

function pokemonSetReducer(state, action){
    const {pokemon, moves, item, nature, ivs, evs} = state;
    switch (action.type) {
        case 'changePokemon':
            return new PokemonSet(action.payload, allPokemonData.defaultMove, item, nature);
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

function MainScreen(props) {
    const defaultSet = new PokemonSet(allPokemonData.defaultPokemon, allPokemonData.defaultMove, 
        allPokemonData.itemsPerGen[0], allPokemonData.natures[1]);
    const [pokemonSet1, dispatchPokemon1] = useReducer(pokemonSetReducer, defaultSet);
    const [pokemonSet2, dispatchPokemon2] = useReducer(pokemonSetReducer, defaultSet);
    const [damageResults, setDamageResults] = useState(simpleCalculate(pokemonSet1, pokemonSet2));
    const [resultToShow, setResultToShow] = useState(0);
    
    useEffect(() => {
        setDamageResults(simpleCalculate(pokemonSet1, pokemonSet2));
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
                    allPokemonData={allPokemonData}
                    pokemonSet={pokemonSet1}
                    dispatchPokemon={dispatchPokemon1}
                    pokemonNumber={1}
                />
                <ResultView
                    textStyle={styles.titleText}
                    damageResults={damageResults}
                    resultToShow={resultToShow}
                    setResultToShow={setResultToShow}
                />
                <PokemonSetCollapsible 
                    allPokemonData={allPokemonData}
                    pokemonSet={pokemonSet2}
                    dispatchPokemon={dispatchPokemon2}
                    pokemonNumber={2}
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