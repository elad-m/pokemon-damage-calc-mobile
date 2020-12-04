import React, {useEffect, useState } from 'react';
import { 
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


function renderHeader(section, _, isActive){
  return (
    <Animatable.View
      duration={200}
      style={[styles.header, isActive ? styles.activeHeader : styles.inactiveHeader]}
      transition="backgroundColor"
    >
      <View style={styles.headerText}>
        {section}
      </View>
    </Animatable.View>
  );
};


function FetchPokemonImage(props){
    const bulbaRequest = `https://bulbapedia.bulbagarden.net/wiki/${props.pokemonName}_(Pok%C3%A9mon)`;
    const [isLoading, setLoading] = useState(true);
    const [imageURI, setImageURI] = useState("https://i.imgur.com/TkIrScD.png");// return to []?
  
    useEffect(() => {
      fetch(bulbaRequest)
        .then((response) => 
            response.text()
        )
        .then((text) => {
            jsdom.env(text, (_,dom) => {
                let uri = dom.document.querySelector('meta[property="og:image"]').content;
                console.log(`uri? : ${uri}`);
                setImageURI(uri);    
            }) // not sure how to turn this into a pure promise chaining with 'then'
        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    }, [props.pokemonName]);
  
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
        <Animatable.View
            style={styles.content}
            transition="backgroundColor"
        >
            <Animatable.View 
                animation={isActive ? 'fadeInDown' : undefined}
                duration={300}>
                {section.props.itemType === 'pokemon' && 
                    <FetchPokemonImage
                        pokemonName={section.props.selectedItem.name}
                    />
                }
            </Animatable.View>
      </Animatable.View>
  );
}

function PokemonAccordion(props){
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
        <ScrollView contentContainerStyle={styles.container}> 
            <Accordion
                activeSections={accordionState.activeSections}
                sections={props.content}
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
    container: {
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
    content: {
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