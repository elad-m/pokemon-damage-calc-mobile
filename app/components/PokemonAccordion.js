import React, { useState } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    ScrollView,
    TouchableOpacity,
    } from 'react-native';

import Constants from 'expo-constants';
import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';


function PokemonAccordion(props){
    const [collapsibleState, setCollapsibleState] = useState({
        collapsed: true,
        activeSections: [],
    });
    
    const setSections = sections => {
        setCollapsibleState({
            collapsed: !collapsibleState.collapsed,
            activeSections: sections.includes(undefined)? [] : sections,
        });
    }
    const renderHeader = (section, _, isActive) => {
        return (
          <Animatable.View
            duration={400}
            style={[styles.header, isActive ? styles.active : styles.inactive]}
            transition="backgroundColor"
          >
            <Text style={styles.headerText}>
                {section.title}</Text>
          </Animatable.View>
        );
      };

    const renderContent = (section, _, isActive) => {
        return (
            <Animatable.View
                duration={400}
                style={[styles.content, isActive ? styles.active : styles.inactive]}
                transition="backgroundColor"
            >
                <Animatable.Text animation={isActive ? 'bounceIn' : undefined}>
                    {section.content}
                </Animatable.Text>
            </Animatable.View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingTop: 30 }}>
                <Text style={styles.title}>Accordion Example</Text>
    
                <Accordion
                    activeSections={collapsibleState.activeSections}
                    sections={props.content}
                    touchableComponent={TouchableOpacity}
                    expandMultiple={false}
                    renderHeader={renderHeader}
                    renderContent={renderContent}
                    duration={400}
                    onChange={setSections}
                />
            </ScrollView>
      </View>
    );
}

const styles = StyleSheet.create({  
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        paddingTop: Constants.statusBarHeight,
      },
      title: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '300',
        marginBottom: 20,
      },
      header: {
        backgroundColor: '#F5FCFF',
        padding: 10,
      },
      headerText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
      },
      content: {
        padding: 20,
        backgroundColor: '#fff',
      },
      active: {
        backgroundColor: 'rgba(255,255,255,1)',
      },
      inactive: {
        backgroundColor: 'rgba(245,252,255,1)',
      },
      selectors: {
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
      },
      selector: {
        backgroundColor: '#F5FCFF',
        padding: 10,
      },
      activeSelector: {
        fontWeight: 'bold',
      },
      selectTitle: {
        fontSize: 14,
        fontWeight: '500',
        padding: 10,
      },
      multipleToggle: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 30,
        alignItems: 'center',
      },
      multipleToggle__title: {
        fontSize: 16,
        marginRight: 8,
      },
});

export default PokemonAccordion;