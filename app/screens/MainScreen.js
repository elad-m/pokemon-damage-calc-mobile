
import React, {useEffect, useReducer, useState } from 'react';
import { 
    Button,
    FlatList,
    TextInput,
    Pressable,
    SafeAreaView,
    StyleSheet, 
    Text, 
    View, } from 'react-native';

import colors from '../config/colors';
import PokemonAccordion from '../components/PokemonAccordion';
import ModalSelector from '../components/ModalSelector';
import StatsTable from '../components/StatsTable';
import RowWrapper from '../components/RowWrapper';
import MoveRow from '../components/MoveRow';
import ResultView from '../components/ResultView';

const  {calculate, Generations, Pokemon, Move} = require('@smogon/calc') ;
const PokemonSet = require('../models/pokemonSet');

const POKEMON_ROLE = ['Pokémon 1','Pokémon 2'];
const gen = Generations.get(7); 

function getAllPokemonData (gen) {
    let pokedexPerGen = Array.from(gen.species).sort((a, b) => a.name > b.name);
    let defaultPokemon = pokedexPerGen[0];
    
    const movesPerGenWithNoMove = Array.from(gen.moves).sort((a, b) => a.name > b.name);
    movesPerGenWithNoMove.shift();
    let movesPerGen = movesPerGenWithNoMove; 
    let defaultMove = movesPerGen.find(move => move.name === 'Tackle');
    
    function findAllPokemonStartWith(query){
        return pokedexPerGen.filter(pokemon =>  pokemon.name.startsWith(query));
    };

    function findAllMovesStartWith (query){
        return movesPerGen.filter(move => move.name.startsWith(query));
    };
    
    return {pokedexPerGen, 
        defaultPokemon,
        movesPerGen,
        defaultMove,
         findAllPokemonStartWith,
        findAllMovesStartWith};
};

const allPokemonData = getAllPokemonData(gen);

function simpleCalculate(pokemonSet1, pokemonSet2){
    // return (() => {
    const pokemon1 = new Pokemon(gen, pokemonSet1.pokemon.name, {
        evs: pokemonSet1.evs,
        ivs: pokemonSet1.ivs,
    });
    const pokemon2 = new Pokemon(gen, pokemonSet2.pokemon.name, {
        evs: pokemonSet2.evs,
        ivs: pokemonSet2.ivs,
    });
    const pokemon1move = new Move(gen, pokemonSet1.moves.name);
    const pokemon2move = new Move(gen, pokemonSet2.moves.name);
    const result1 = calculate(gen, pokemon1, pokemon2, pokemon1move);
    const result2 = calculate(gen, pokemon2, pokemon1, pokemon2move);
    // const resultDescription = result.fullDesc('%', false);
    // setDamageResult(result)
        
    // });
    return [result1, result2];
}


function getAccordionSection(allPokemonData, pokemonSet, dispatchPokemon, pokemonNumber){
    
    return {
        pokemon:
            <RowWrapper 
                titleTextViewStyle={styles.titleTextView}
                titleFontSize={20}
                message={`Pokemon ${pokemonNumber}: `}>
                <ModalSelector
                    selected={pokemonSet.pokemon}
                    setSelected={(payload) => dispatchPokemon({type: 'changePokemon', payload:payload})}
                    queryFunction={allPokemonData.findAllPokemonStartWith}
                    allResults={allPokemonData.pokedexPerGen}
                    defaultSelection={allPokemonData.defaultPokemon}
                    message={'Pokemon'}
                    selectorFontSize={20}
                />
            </RowWrapper>,

        
        statsTable:
            <StatsTable
                pokemon={pokemonSet.pokemon}
                ivs={pokemonSet.ivs}
                setIvs={(payload) => dispatchPokemon({type: 'changeIvs', payload:payload})}
                evs={pokemonSet.evs}
                setEvs={(payload) => dispatchPokemon({type: 'changeEvs', payload:payload})}/>,
        move:
        <MoveRow 
            titleTextViewStyle={styles.titleTextView}
            titleFontSize={17}
            message={'Move: '}
            move={pokemonSet.moves}
            isInResult={pokemonNumber === 1}
            >
            <ModalSelector
                    selected={pokemonSet.moves}
                    setSelected= {(payload) => dispatchPokemon({type: 'changeMove', payload:payload})}
                    queryFunction={allPokemonData.findAllMovesStartWith}
                    allResults={allPokemonData.movesPerGen}
                    default={allPokemonData.defaultMove}
                    message={'Move'}
                    selectorFontSize={17}
            />
        </MoveRow>,
        footer: 
            <View
                style={{backgroundColor:'black', height: 5, 
                borderBottomLeftRadius:20,
                borderBottomRightRadius:20}}
            />,
    };
}
function pokemonSetReducer(state, action){
    switch (action.type) {
        case 'changePokemon':
            return new PokemonSet(action.payload, allPokemonData.defaultMove);
        case 'changeMove':
            return new PokemonSet(state.pokemon, action.payload, state.ivs, state.evs);
        case 'changeIvs':
            return new PokemonSet(state.pokemon, state.moves, action.payload, state.evs);
        case 'changeEvs':
            return new PokemonSet(state.pokemon, state.moves, state.ivs, action.payload);
        default:
            throw new Error('BAD action.type in pokemonSetReducer');
    }
}


function MainScreen(props) {
    const defaultSet = new PokemonSet(allPokemonData.defaultPokemon, allPokemonData.defaultMove);
    const [pokemonSet1, dispatchPokemon1] = useReducer(pokemonSetReducer, defaultSet);
    const [pokemonSet2, dispatchPokemon2] = useReducer(pokemonSetReducer, defaultSet);
    const [damageResults, setDamageResults] = useState(simpleCalculate(pokemonSet1, pokemonSet2));
    const [resultToShow, setResultToShow] = useState(0);
    
    const accordionSections = [getAccordionSection(allPokemonData, pokemonSet1, dispatchPokemon1, 1),
                            getAccordionSection(allPokemonData, pokemonSet2, dispatchPokemon2, 2)];

    useEffect(() => {
        setDamageResults(simpleCalculate(pokemonSet1, pokemonSet2));
        console.log(`MAIN: p1: ${pokemonSet1.pokemon.name} m1: ${pokemonSet1.moves.name}\
        p2: ${pokemonSet2.pokemon.name} m2: ${pokemonSet2.moves.name}`);
    }, [pokemonSet1, pokemonSet2]);
    
    
    return (
        <SafeAreaView id='mainViewId' style={styles.mainView}>
            <PokemonAccordion
                content={accordionSections}
                accordionFlex={1}
            />

            <ResultView
                textStyle={styles.titleText}
                damageResults={damageResults}
                resultToShow={resultToShow}
                setResultToShow={setResultToShow}
            />
            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({  
    mainView: {
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