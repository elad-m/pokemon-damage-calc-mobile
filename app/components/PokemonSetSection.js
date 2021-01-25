import React, {useContext, useEffect, useState } from 'react';
import { 
    Text,
    ActivityIndicator,
    Image,
    StyleSheet, 
    View, 
    Pressable,
    Modal,
    } from 'react-native';


import Collapsible from 'react-native-collapsible/Collapsible';

import SearchableModalSelector from './SearchableModalSelector';
import MoveRow from './MoveRow';
import PokemonSetDetails from './PokemonSetDetails';
import PressActivatedModalContainer from './PressActivatedModalContainer';

import colors from '../config/colors';
import dimens from '../config/dimens';
import IORow from './IORow';
import ThemeContext from '../config/ThemeContext';

const jsdom = require('jsdom-jscore-rn');

function SetHeader(props){
    const {theme} = useContext(ThemeContext);
    const {allPokemonData, databaseService, pokemonSet, dispatchPokemon, pokemonNumber, titleTextViewStyle} = props;
    return (
        <View style={{...styles.sectionHeader, borderColor:theme.divider}}>
            <IORow
                databaseService={databaseService}
                pokemonSet={pokemonSet}
                dispatchPokemon={dispatchPokemon}
            />
            <SearchableModalSelector
                pressableFlex={0}
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
                move={pokemonSet.moves}
                isInResult={pokemonNumber === 1}
                >
                <SearchableModalSelector
                    pressableFlex={2}
                    selected={pokemonSet.moves}
                    setSelected= {(payload) => dispatchPokemon({type: 'changeMove', payload:payload})}
                    queryFunction={(query) => allPokemonData.movesPerGen.filter(move =>  move.name.startsWith(query))}
                    allResults={allPokemonData.movesPerGen}
                    defaultSelection={allPokemonData.defaultMove}
                    message={'Move'}
                    selectorFontSize={17}
                />
            </MoveRow>
            {props.children}
        </View>
  );
};


function FetchPokemonImage(props){
    const bulbaRequest = `https://bulbapedia.bulbagarden.net/wiki/${props.pokemonName}_(Pok%C3%A9mon)`;
    const [isLoading, setLoading] = useState(true);
    const [imageURI, setImageURI] = useState("https://i.imgur.com/TkIrScD.png");// return to []?
  
    // useEffect(() => {
    //   fetch(bulbaRequest)
    //     .then((response) => 
    //         response.text()
    //     )
    //     .then((text) => {
    //         jsdom.env(text, (_,dom) => {
    //             let uri = dom.document.querySelector('meta[property="og:image"]').content;
    //             console.log(`uri? : ${uri}`);
    //             setImageURI(uri);    
    //         }) // not sure how to turn this into a pure promise chaining with 'then'
    //     })
    //     .catch((error) => console.error(error))
    //     .finally(() => setLoading(false));
    // }, [props.pokemonName]);
  
    return (
      <View style={{ flex: 1, padding: 24 }}>
        {isLoading ? <ActivityIndicator/> : (
            <View>
                <Image source={{uri: imageURI}} 
                    style={{width: 305, height: 160}}
                    resizeMode='contain'/>
            </View>
        )}
      </View>
    );
}


function Footer(){
    const {theme} = useContext(ThemeContext);
    return (
        <View style={{...styles.sectionFooter, borderColor:theme.divider}}>
            <Text style={{fontSize: 20, color:'black', textAlign: 'center',}}></Text>
        </View>   
    );
}

function PokemonSetSection(props){
    const {allPokemonData, pokemonSet, dispatchPokemon, titleTextViewStyle} =props;

    return (
        <View style={styles.setContainer}> 
            <SetHeader
                {...props}>
            </SetHeader>
            <PressActivatedModalContainer message={`More Set Details`}>
                <PokemonSetDetails 
                    titleTextViewStyle={titleTextViewStyle}
                    pokemonSet={pokemonSet}
                    dispatchPokemon={dispatchPokemon}
                    items={allPokemonData.itemsPerGen}
                    natures={allPokemonData.natures}
                    />
            </PressActivatedModalContainer>
            <Footer/>
        </View>
    );
}

const styles = StyleSheet.create({  
    setContainer: {
        flex:1,
        alignItems:'stretch',
        margin:dimens.mainMargin
    },
    sectionHeader: {
        flex:1,
        alignItems: 'stretch',

        borderTopWidth: 1,
        borderStartWidth: 1,
        borderEndWidth: 1,
        borderTopStartRadius:dimens.headerFooterRadius,
        borderTopEndRadius:dimens.headerFooterRadius,
    },
    sectionFooter: {
        height:20, 
        borderBottomWidth: 1,
        borderStartWidth: 1,
        borderEndWidth: 1,
        borderBottomStartRadius:dimens.headerFooterRadius,
        borderBottomEndRadius:dimens.headerFooterRadius,
    },
    
    
});

export default PokemonSetSection;