import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db  = SQLite.openDatabase('pokemonSets.db');

function SavesSetsScreen({navigation, route}) {
    const pokemonSet = route.params.pokemonSet;
    return (
        <SafeAreaView style={styles.mainView}>
            <Text style={styles.titleText}>
                Choose a set
            </Text>
            <Text style={styles.innerText}>
                {pokemonSet.pokemon.name} {'\n'}
                {pokemonSet.moves.name}{'\n'}
                {pokemonSet.item.name}{'\n'}
                {pokemonSet.nature.name}{'\n'}
                {JSON.stringify(pokemonSet.evs)}{'\n'}
                {JSON.stringify(pokemonSet.ivs)}
            </Text>
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
        color: 'dimgray',
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

export default SavesSetsScreen;