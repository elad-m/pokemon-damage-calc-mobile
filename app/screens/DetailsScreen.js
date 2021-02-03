import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import PokemonSetDetails from '../components/PokemonSetDetails';

function DetailsScreen({navigation, route}) {
    const {pokemonSet, dispatchPokemon, items,
        natures, abilities, statusConditions} = route.params;
    return (
        <SafeAreaView style={styles.mainView}>
            <PokemonSetDetails 
                pokemonSet={pokemonSet}
                dispatchPokemon={dispatchPokemon}
                items={items}
                natures={natures}
                abilities={abilities}
                statusConditions={statusConditions}
            />
        </SafeAreaView>
        
    );
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        justifyContent: 'space-around',
    },
    titleText: {
        flex: 1,
        padding: 10,
        fontSize: 30,
        textAlign: 'center',
    },
    innerText: {
        flex: 1,
        padding: 10,
        fontSize: 20,  
        textAlign: 'center',
        color: 'black',
    },    
})

export default DetailsScreen;