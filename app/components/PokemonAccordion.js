import React, {useEffect, useState } from 'react';
import { 
    Text,
    ActivityIndicator,
    Image,
    StyleSheet, 
    View, 
    ScrollView,
    TouchableOpacity,
    } from 'react-native';

import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';

import colors from '../config/colors';

const jsdom = require('jsdom-jscore-rn');

const LOREM_SIMPSON = "and all who dwell within this rocket house tomacco retirony unfaceuptoable rappin' surfer sacrilicious where's poochie? no-breath chazwazers california cheeseburger mazuma diddily explosion land redorkulated searing gas pain land foodrinkery skanks for nothing speedholes gamblor swishifying homersexual gamblor poor wiggum. here's vanessa williams eat our shirts uncle ant word hole the old wiggum charm squozen baby guts superliminal no-breath poochie eat my shirt suck like a fox blundering numbskullery dirty, maybe. dangerous, hardly. foodrinkery four krustys esquilax nuisancefon ovulicious dodgerock dead serious about kapowza clouseauesque knifey wifey crisitunity ovulicious perspicacity poochie magumba johnny lunchpail science pole zing yoink nervous pervis microcalifragilistics suspicious aloysius my children need wine assal horizontology here's vanessa williams sunblocker garbagewater crayola oblongata zork spiritual de-pantsing assal horizontology unpossible fireworks factory";

function renderHeader(section, _, isActive){
  return (
    <View
      duration={200}
      style={[styles.header, isActive ? styles.activeHeader : styles.inactiveHeader]}
      transition="backgroundColor"
    >
      {/* <View style={styles.headerText}> */}
        {section.pokemon}
      {/* </View> */}
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


function renderContent(section, _, isActive){
    return (
        <ScrollView
            style={styles.sectionContent}
        >
            {/* {section.pokemon.props.itemType === 'pokemon' && 
                <FetchPokemonImage
                    pokemonName={section.pokemon.props.selectedItem.name}
                />
            } */}
            {section.move}
            {section.statsTable}
            {/* <Text>
                {LOREM_SIMPSON}
            </Text> */}
      </ScrollView>
  );
}

function PokemonAccordion(props){
    const {content, accordionFlex} = props;
    const [accordionState, setAccordionState] = useState({
        collapsed: true,
        activeSections: [],
    });
    
    const setSections = sections => {
        setAccordionState({
            collapsed: !accordionState.collapsed,
            activeSections: sections.includes(undefined)? [] : sections,
        });
    }

    return (
        <ScrollView style={{...styles.accordionContainer, flex: accordionFlex}}> 
            <Accordion
                activeSections={accordionState.activeSections}
                sections={content}
                touchableComponent={TouchableOpacity}
                expandMultiple={false}
                renderHeader={renderHeader}
                renderContent={renderContent}
                duration={400}
                onChange={setSections}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({  
    accordionContainer: {
        flex: 1,
        backgroundColor: colors.primary,
        paddingTop: 20 
    },
    header: {
        padding: 10,
    },
    headerText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '500',
    },
    sectionContent: {
        borderRadius: 20,
        padding: 20,
        backgroundColor: colors.secondary,
    },
    activeHeader: {
        backgroundColor: colors.secondary,
    },
    inactiveHeader: {
        backgroundColor: colors.primary,
    },
});

export default PokemonAccordion;