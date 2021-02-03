import React, {useContext} from 'react';
import { 
    Text,
    StyleSheet, 
    View, 
    } from 'react-native';

import SearchableModalSelector from './SearchableModalSelector';
import MoveRow from './MoveRow';
import PokemonSetDetails from './PokemonSetDetails';
import PressActivatedModalContainer from './PressActivatedModalContainer';

import dimens from '../config/dimens';
import IORow from './IORow';
import ThemeContext from '../config/ThemeContext';


function SetHeader(props){
    const {theme} = useContext(ThemeContext);
    const {allPokemonData, pokemonSet, dispatchPokemon, pokemonNumber, titleTextViewStyle} = props;
    return (
        <View style={{...styles.sectionHeader, borderColor:theme.divider}}>
            <View style={{backgroundColor:theme.header}}>
                <Text style={{...styles.headingText, color:theme.titleText}}>Pokémon {pokemonNumber}</Text>
            </View>
            <SearchableModalSelector
                pressableFlex={0}
                paddingTop={10}
                selected={pokemonSet.pokemon}
                setSelected={(payload) => dispatchPokemon({type: 'changePokemon', payload:payload})}
                queryFunction={(query) => allPokemonData.pokedexPerGen.filter(pokemon =>  pokemon.name.startsWith(query))}
                allResults={allPokemonData.pokedexPerGen}
                defaultSelection={allPokemonData.defaultPokemon}
                message={'Pokemon'}
                selectorFontSize={20}
            />
            <MoveRow 
                titleTextViewStyle={titleTextViewStyle}
                titleFontSize={17}
                message={'Move: '}
                move={pokemonSet.move}
                isInResult={pokemonNumber === 1}
                >
                <SearchableModalSelector
                    pressableFlex={2}
                    rootViewFlex={2}
                    padding={0}
                    selected={pokemonSet.move}
                    setSelected= {(payload) => dispatchPokemon({type: 'changeMove', payload:payload})}
                    queryFunction={(query) => allPokemonData.movesPerGen.filter(move =>  move.name.startsWith(query))}
                    allResults={allPokemonData.movesPerGen}
                    defaultSelection={allPokemonData.defaultMove}
                    message={'Move'}
                    selectorFontSize={17}
                />
            </MoveRow>
        </View>
  );
};

function DetailsSummaryLine({pokemonSet}){
    const {theme} = useContext(ThemeContext);
    const {level, ability, nature, item, evs} = pokemonSet;
    const evsPrint = Object.entries(evs)
        .map(obj => obj[1] > 0? obj[0] + ":"+ obj[1]: null)
        .join(" "); // print only non-zero evs
    return(
        <View style={{flex:1, justifyContent:'center', alignItems:'center',
        margin:5}}>
            <Text style={{color:theme.secondaryText}}>
                {level} | {nature.name} | {ability.name} | {item.name}
            </Text>
            <Text style={{color:theme.secondaryText}}>
                {evsPrint}
            </Text>
        </View>
    );
}


function PokemonSetSection(props){
    const {theme} = useContext(ThemeContext);
    const {allPokemonData, pokemonSet, dispatchPokemon, 
        titleTextViewStyle, databaseService} =props;
    return (
        <View style={{...styles.setContainer, borderColor:theme.border}}> 
            <SetHeader {...props}/>
            <PressActivatedModalContainer 
                message={`More Set Details`}
                alignPressable={'center'}>
                <PokemonSetDetails 
                    titleTextViewStyle={titleTextViewStyle}
                    pokemonSet={pokemonSet}
                    dispatchPokemon={dispatchPokemon}
                    items={allPokemonData.itemsPerGen}
                    natures={allPokemonData.natures}
                    abilities={allPokemonData.abilitiesPerGen}
                    statusConditions={allPokemonData.STATUS_NAMES}
                    />
                </PressActivatedModalContainer>
            <DetailsSummaryLine pokemonSet={pokemonSet}/>
            <IORow
                databaseService={databaseService}
                pokemonSet={pokemonSet}
                dispatchPokemon={dispatchPokemon}
            />
        </View>
    );
}

const styles = StyleSheet.create({  
    setContainer: {
        flex:1,
        justifyContent:'flex-start',
        alignItems:'stretch',
        margin:dimens.mainMargin,
        borderWidth:dimens.defaultBorderWidth,
        borderRadius:dimens.defaultBorderRadius,
        overflow:'hidden',
    },
    sectionHeader: {
        flex:1,
        justifyContent:'flex-start',
        alignItems: 'stretch',
    },
    headingText: {
        fontSize:20, 
        textAlign:'center', 
        fontWeight:'bold',
        padding: 5
    }
    
});

export default PokemonSetSection;