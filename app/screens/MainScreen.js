
import React, { useState } from 'react';
import { 
    Pressable,
    SafeAreaView,
    StyleSheet, 
    Text, 
    View, } from 'react-native';

import colors from '../config/colors';
import PokemonAccordion from '../components/PokemonAccordion';
import Picker from '../components/Picker';

const  {calculate, Generations, Pokemon, Move} = require('@smogon/calc') ;

const POKEMON_ROLE = {'at': 'Attacker', 'df': 'Defender'};

const gen = Generations.get(7); 

function AllPokemonData () {
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

function makeSimpleCalculate(attacker, defender, move, setDamageResult){
    return (() => {
        const result = calculate(
            gen,
            new Pokemon(gen, attacker.name, {
            }),
            new Pokemon(gen, defender.name, {
            }),
            new Move(gen, move.name)
          );
        const resultDescription = result.fullDesc('%', false);
        console.log(`Result: ${resultDescription}`);
        setDamageResult(result)
    });
}


function MainScreen(props) {
    // pokemon and moves are now objects
    const allPokemonData = AllPokemonData();
    const [attacker, setAttacker] = useState(allPokemonData.defaultPokemon);
    const [move, setMove] = useState(allPokemonData.defaultMove);
    const [defender, setDefender] = useState(allPokemonData.defaultPokemon);
    const [damageResult, setDamageResult] = useState({});
    const simpleCalculateWithProps = makeSimpleCalculate(attacker, defender, move, setDamageResult);

    console.log(`MAIN: attacker ${attacker.name} move: ${move.name} defender:${defender.name}`);
    return (
            
        <SafeAreaView id='mainViewId' style={styles.mainView}>
            <Picker
                selectedItem={attacker}
                setSelectedItem={setAttacker}
                allPokemonData={allPokemonData}
                itemType='pokemon'
                message={POKEMON_ROLE.at}
            />
            <Picker
                selectedItem={move}
                setSelectedItem={setMove}
                allPokemonData={allPokemonData}
                itemType='move'
                message='Move'
            />
            <Picker
                selectedItem={defender}
                setSelectedItem={setDefender}
                allPokemonData={allPokemonData}
                itemType='pokemon'
                message={POKEMON_ROLE.df}
            />
            {/* <PokemonAccordion/> */}

            <View id="result" style={styles.itemPickerContainer}>
                <Text style={{...styles.titleText}}>
                    {damageResult.fullDesc? damageResult.fullDesc(): ''}
                </Text>
            </View>

            
            <View id="calculate" style={{...styles.itemPickerContainer,
                flexDirection: 'row', position:'absolute', bottom:20,  alignSelf:'center' }}>
                <Pressable
                    onPress={simpleCalculateWithProps}
                    style={{...styles.pressableWrapper}}
                    style={({pressed}) => [
                        {opacity: pressed? 0.5 : 1}, styles.pressableWrapper
                        ]}
                        >
                    <Text style={styles.pressableInnerText}>
                        Calculate!
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({  
    mainView: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    itemPickerContainer: {
        alignItems:'center',
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