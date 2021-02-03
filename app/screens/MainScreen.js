import React, {useEffect, useReducer, useState, useContext } from 'react';
import { 
	StatusBar,
	SafeAreaView,
	StyleSheet,
	ScrollView,
	 } from 'react-native';
import { I18nManager} from 'react-native';

import ResultView from '../components/ResultView';
import PokemonSetSection from '../components/PokemonSetSection';
import DatabaseService from '../services/DatabaseService';
import PokemonDataUtil from '../utils/PokemonDataUtil'
import ThemeContext from '../config/ThemeContext';
import ThemeSwitch from '../components/ThemeSwitch';
import { DatabaseRefreshProvider } from '../services/DatabaseRefreshContext';
import FieldUtil from '../utils/FieldUtil';

const PokemonSet = require('../models/PokemonSet');

let currentGeneration = 7;
const pokemonDataUtil = PokemonDataUtil(currentGeneration);
const databaseService = DatabaseService();
databaseService.init(); // databaseService.resetDataBase();
const fieldUtil = FieldUtil(pokemonDataUtil);


function pokemonSetReducer(state, action){
	const {pokemon, move, item, nature,
		ability, status, level, ivs, evs} = state;
	switch (action.type) {
		case 'changeAll':{ // loading from database case
			const {pokemon, move, item, nature, 
				ability, status, level, ivs, evs} = action.payload;
			return new PokemonSet(pokemon, move, item, nature, 
				ability, status, level, ivs, evs);
		}
		case 'changePokemon':{
			// a pokemon object holds its abilities in an array
			const defaultAbility = pokemonDataUtil.getAbilityObject(action.payload.abilities[0]); 
			return new PokemonSet(action.payload, pokemonDataUtil.defaultMove, item, nature,
				defaultAbility, pokemonDataUtil.defaultStatus);
		}
		case 'changeMove':
			return new PokemonSet(pokemon, action.payload, item, nature,
				ability, status, level, ivs, evs);
		case 'changeIvs':
			return new PokemonSet(pokemon, move, item, nature,
				ability, status, level, action.payload, evs);
		case 'changeEvs':
			return new PokemonSet(pokemon, move, item, nature, 
				ability, status, level, ivs, action.payload);
		case 'changeItem':
			return new PokemonSet(pokemon, move, action.payload, nature,
				ability, status, level, ivs, evs);
		case 'changeNature':
			return new PokemonSet(pokemon, move, item, action.payload,
				ability, status, level, ivs, evs);
		case 'changeAbility':
			return new PokemonSet(pokemon, move, item, nature,
				action.payload, status, level, ivs, evs);
		case 'changeStatus':
			return new PokemonSet(pokemon, move, item, nature,
				ability, action.payload, level, ivs, evs);
		case 'changeLevel':
			return new PokemonSet(pokemon, move, item, nature,
				ability, status, action.payload, ivs, evs);
		default:
			throw new Error('BAD action.type in pokemonSetReducer');
	}
}
function getDefaultSet(){
	const defaultAbility = pokemonDataUtil.defaultPokemon.abilities[0];
	return new PokemonSet(pokemonDataUtil.defaultPokemon, 
		pokemonDataUtil.defaultMove, 
		pokemonDataUtil.itemsPerGen[0], 
		pokemonDataUtil.natures[1],
		pokemonDataUtil.getAbilityObject(defaultAbility),
		pokemonDataUtil.defaultStatus);
}

I18nManager.allowRTL(false);

function MainScreen({navigation}) {
	const {theme} = useContext(ThemeContext);
	const defaultSet = getDefaultSet();
	const [pokemonSet1, dispatchPokemon1] = useReducer(pokemonSetReducer, defaultSet);
	const [pokemonSet2, dispatchPokemon2] = useReducer(pokemonSetReducer, defaultSet);
	const [weather, setWeather] = useState(pokemonDataUtil.WEATHER_CONDITIONS[0]);
	const [terrain, setTerrain] = useState(pokemonDataUtil.TERRAINS[0]);
	const [damageResults, setDamageResults] = useState(pokemonDataUtil
		.simpleCalculate(pokemonSet1, pokemonSet2, weather, terrain));
	const [resultToShow, setResultToShow] = useState(0);
	
	useEffect(() => {
		// manual weather changing
		setDamageResults(pokemonDataUtil.simpleCalculate(pokemonSet1, pokemonSet2, weather, terrain));
	}, [weather, terrain]);

	useEffect(() => {
		// first two lines deal with field changing because of new pokemon ability
		fieldUtil.setWeatherIfNeeded(pokemonSet1, pokemonSet2, setWeather);
		fieldUtil.setTerrainIfNeeded(pokemonSet1, pokemonSet2, setTerrain);
		setDamageResults(pokemonDataUtil.simpleCalculate(pokemonSet1, pokemonSet2, weather, terrain));
	}, [pokemonSet1, pokemonSet2]);

	useEffect(() => {
		console.log(`${pokemonSet1.pokemon.name} ${pokemonSet1.move.name} ${pokemonSet1.item.name} \
 ${pokemonSet1.nature.name} ${pokemonSet1.ability.name} ${pokemonSet1.level} ${pokemonSet1.status.name} ${pokemonSet1.finalStats.spe}
${pokemonSet2.pokemon.name} ${pokemonSet2.move.name} ${pokemonSet2.item.name}\
 ${pokemonSet2.nature.name} ${pokemonSet2.ability.name} ${pokemonSet2.level} ${pokemonSet2.status.name} ${pokemonSet2.finalStats.spe}\
 ${weather.name} ${terrain.name}`);
	}, [pokemonSet1, pokemonSet2, weather, terrain]);
	
	return (
		<SafeAreaView style={{...styles.mainView, backgroundColor:theme.primary}}>
			<StatusBar backgroundColor={theme.primary} barStyle={theme.statusBarStyle} />
			<ScrollView
				style={{flex:1, backgroundColor:theme.primary}}
				keyboardShouldPersistTaps={'always'}>    
				<ThemeSwitch textColor={theme.titleText}/>
				<DatabaseRefreshProvider>
					<PokemonSetSection
						allPokemonData={pokemonDataUtil}
						databaseService={databaseService}
						pokemonSet={pokemonSet1}
						dispatchPokemon={dispatchPokemon1}
						pokemonNumber={1}
						titleTextViewStyle={styles.titleTextView}
					/>
					<ResultView
						damageResults={damageResults}
						resultToShow={resultToShow}
						setResultToShow={setResultToShow}
						weather={weather}
						setWeather={setWeather}
						weatherConditions={pokemonDataUtil.WEATHER_CONDITIONS}
						terrain={terrain}
						setTerrain={setTerrain}
						terrains={pokemonDataUtil.TERRAINS}
						titleTextViewStyle={styles.titleTextView}
					/>
					<PokemonSetSection 
						allPokemonData={pokemonDataUtil}
						databaseService={databaseService}
						pokemonSet={pokemonSet2}
						dispatchPokemon={dispatchPokemon2}
						pokemonNumber={2}
						titleTextViewStyle={styles.titleTextView}
					/>
				</DatabaseRefreshProvider>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({  
	mainView: {
		flex: 1,
	},
	titleTextView: {
		flex:1, 
		alignSelf:'center',
	},

});

export default MainScreen;