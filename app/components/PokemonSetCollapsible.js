import React, {useEffect, useState } from 'react';
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

import ModalSelector from './ModalSelector';
import MoveRow from './MoveRow';
import StatsTable from './StatsTable';
import PokemonSetDetails from './PokemonSetDetails';

import colors from '../config/colors';
import dimens from '../config/dimens';

const jsdom = require('jsdom-jscore-rn');

function SetHeader(props){
    const {allPokemonData, pokemonSet, dispatchPokemon, pokemonNumber} = props;
    return (
        <View style={styles.sectionHeader}>
            <ModalSelector
                selected={pokemonSet.pokemon}
                setSelected={(payload) => dispatchPokemon({type: 'changePokemon', payload:payload})}
                queryFunction={(query) => allPokemonData.pokedexPerGen.filter(pokemon =>  pokemon.name.startsWith(query))}
                allResults={allPokemonData.pokedexPerGen}
                defaultSelection={allPokemonData.defaultPokemon}
                message={'Pokemon'}
                selectorFontSize={20}
            />
            <MoveRow 
                titleTextViewStyle={styles.titleTextView}
                titleFontSize={17}
                message={'Move: '}
                move={pokemonSet.moves}
                isInResult={pokemonNumber === 1}
                >
                <ModalSelector
                    containerFlex={1}
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
    return (
        <View style={styles.sectionFooter}>
            <Text style={{fontSize: 20, color:'black', textAlign: 'center',}}></Text>
        </View>   
    );
}

function PokemonSetCollapsible(props){
    const {allPokemonData, pokemonSet, dispatchPokemon, pokemonNumber} =props;
    const [collapsibleState, setCollapsibleState] = useState(true);
    const toggleExpanded = () => {
        setCollapsibleState((!collapsibleState));
    };

    return (
        <View style={styles.setContainer}> 
            <SetHeader
                allPokemonData={allPokemonData}
                pokemonSet={pokemonSet}
                dispatchPokemon={dispatchPokemon}
                pokemonNumber={pokemonNumber}>
                <Pressable 
                    style={styles.pressableWrapper}
                    android_ripple={{radius: dimens.defaultBorderRadius}}
                    onPress={toggleExpanded}>
                    <Text style={styles.pressableInnerText}>More</Text>
                </Pressable>
            </SetHeader>
            {collapsibleState && <Footer/>}
            <Collapsible
                // all grandchildren of collapsible must have flex:0
                duration={300}
                style={{flex: 1, }}
                collapsed={collapsibleState}>
                <PokemonSetDetails 
                    containerStyle={styles.sectionContent}
                    titleTextViewStyle={styles.titleTextView}
                    pokemonSet={pokemonSet}
                    dispatchPokemon={dispatchPokemon}
                    items={allPokemonData.itemsPerGen}
                    natures={allPokemonData.natures}
                    />

                <Footer/>
            </Collapsible>
        </View>
    );
}

const styles = StyleSheet.create({  
    setContainer: {
        flex:1,
        alignItems:'stretch',
        margin:dimens.mainMargin
    },
    headerText: {
        textAlign: 'center',
        fontSize: 20,
    },
    sectionHeader: {
        flex:1,
        alignItems: 'stretch',

        borderTopWidth: 1,
        borderStartWidth: 1,
        borderEndWidth: 1,
        borderColor: 'black',
        borderTopStartRadius:dimens.headerFooterRadius,
        borderTopEndRadius:dimens.headerFooterRadius,
    },
    sectionContent: {
        flex:1,
        justifyContent:'space-around',
        alignItems:'stretch',
        padding: 10,

        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: 'black',
    },
    sectionFooter: {
        height:20, 
        borderBottomWidth: 1,
        borderStartWidth: 1,
        borderEndWidth: 1,
        borderColor: 'black',
        borderBottomStartRadius:dimens.headerFooterRadius,
        borderBottomEndRadius:dimens.headerFooterRadius,
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
        alignSelf:'center',
        backgroundColor: colors.pressable,
        margin:dimens.mainMargin,
        borderRadius: dimens.defaultBorderRadius,    
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
        fontSize: 10,  
        padding: 8,
    },

    
});

export default PokemonSetCollapsible;