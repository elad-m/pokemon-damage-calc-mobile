import React, {useEffect, useReducer, useState, useContext } from 'react';
import { 
	Platform,
	StatusBar,
	SafeAreaView,
	StyleSheet,
	ScrollView,
	 } from 'react-native';



import ResultView from '../components/ResultView';
import PokemonSetSection from '../components/PokemonSetSection';
import DatabaseService from '../services/DatabaseService';
import PokemonDataService from '../services/PokemonDataService'
import ThemeContext from '../config/ThemeContext';
import ThemeSwitch from '../components/ThemeSwitch';

const PokemonSet = require('../models/pokemonSet');

let currentGeneration = 7;
const pokemonDataService = PokemonDataService(currentGeneration);
const databaseService = DatabaseService();
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
	const {theme} = useContext(ThemeContext);
	const defaultSet = new PokemonSet(pokemonDataService.defaultPokemon, pokemonDataService.defaultMove, 
		pokemonDataService.itemsPerGen[0], pokemonDataService.natures[1]);
	const [pokemonSet1, dispatchPokemon1] = useReducer(pokemonSetReducer, defaultSet);
	const [pokemonSet2, dispatchPokemon2] = useReducer(pokemonSetReducer, defaultSet);
	const [weather, setWeather] = useState(pokemonDataService.WEATHER_CONDITIONS[0]);
	const [damageResults, setDamageResults] = useState(pokemonDataService.simpleCalculate(pokemonSet1, pokemonSet2, weather));
	const [resultToShow, setResultToShow] = useState(0);
	
	useEffect(() => {
		setDamageResults(pokemonDataService.simpleCalculate(pokemonSet1, pokemonSet2, weather));
		console.log(`MAIN: ${pokemonSet1.pokemon.name} ${pokemonSet1.moves.name} ${pokemonSet1.item.name} ${pokemonSet1.nature.name}\
		 ${pokemonSet2.pokemon.name} ${pokemonSet2.moves.name} ${pokemonSet2.item.name} ${pokemonSet2.nature.name}\
		 ${weather}`);
	}, [pokemonSet1, pokemonSet2, weather]);
	
	return (
		<SafeAreaView style={{...styles.mainView, backgroundColor:theme.primary}}>
			<StatusBar backgroundColor={theme.primary} barStyle={theme.statusBarStyle} />
			<ScrollView
				style={{flex:1, backgroundColor:theme.primary}}
				keyboardShouldPersistTaps={'always'}>    
				<ThemeSwitch textColor={theme.titleText}/>
				<PokemonSetSection
					allPokemonData={pokemonDataService}
					databaseService={databaseService}
					pokemonSet={pokemonSet1}
					dispatchPokemon={dispatchPokemon1}
					pokemonNumber={1}
					navigation={navigation}
					titleTextViewStyle={styles.titleTextView}
				/>
				<ResultView
					damageResults={damageResults}
					resultToShow={resultToShow}
					setResultToShow={setResultToShow}
					weather={weather}
					setWeather={setWeather}
					weatherConditions={pokemonDataService.WEATHER_CONDITIONS}
					titleTextViewStyle={styles.titleTextView}
				/>
				<PokemonSetSection 
					allPokemonData={pokemonDataService}
					databaseService={databaseService}
					pokemonSet={pokemonSet2}
					dispatchPokemon={dispatchPokemon2}
					pokemonNumber={2}
					navigation={navigation}
					titleTextViewStyle={styles.titleTextView}
				/>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({  
	mainView: {
		flex: 1,
	},
	collapsiblesContainer: {
		flex: 1,
	},
	titleTextView: {
		flex:1, 
		alignSelf:'center',
	},

});

export default MainScreen;