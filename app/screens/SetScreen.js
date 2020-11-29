import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Keyboard } from 'react-native'


function SetScreen(props) {
    	
    Keyboard.dismiss();
    const pokemon = props.route.params;
    return (
        <SafeAreaView style={styles.mainView}>
            <View id="viewOutputPokemon" style={styles.viewOutputPokemon}>
                <Text style={styles.titleText}>
                     Output Pokemon
                </Text>
                <Text style={styles.innerText}>
                     {pokemon.name || ""}
                </Text>
            </View>

            <View id="changeOutputPokemonDetails" style={styles.changeOutputPokemonDetails}>
                <Text style={styles.titleText}>
                     Change Pokemon Setting
                </Text>
                
            </View>

        </SafeAreaView>
        
    );
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        justifyContent: 'space-around',
    },
    viewOutputPokemon : {
        flex: 1,
        backgroundColor: 'lightcyan',
    },
    changeOutputPokemonDetails : {
        flex: 3,
        alignItems: 'center',
        backgroundColor: 'lightblue',
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

export default SetScreen;