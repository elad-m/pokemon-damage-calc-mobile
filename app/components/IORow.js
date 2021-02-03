import React, {useState, useEffect, useContext} from 'react';
import {Text, View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons'; 

import RowWrapper from './RowWrapper';
import PokemonSetIOModal from './PokemonSetIOModal';
import GenericPressable from './GenericPressable';
import ThemeContext from '../config/ThemeContext';
import DatabaseRefreshContext from '../services/DatabaseRefreshContext';


function IORow(props){
    const {shouldRefresh, setShouldRefresh} = useContext(DatabaseRefreshContext);
    const {theme} = useContext(ThemeContext);
    const {databaseService, pokemonSet, dispatchPokemon} = props;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [savedSets, setSavedSets] = useState([]);

    useEffect(() => {
        // got the 'Can't perform a React state update on an unmounted component'
        // but did not get it again so I don't know if the 'mounted' is necessary
        let mounted = true;
        function getAllSetsCallback(dbArray){
            const newSavedSets = [...dbArray];
            if(mounted) setSavedSets(newSavedSets);
        }
        databaseService.getAllSets(getAllSetsCallback);
        console.log('after getAllSets: ' + JSON.stringify(savedSets));
        setShouldRefresh(false);
        return () => {mounted = false};
    },[shouldRefresh])
    
    return (
        <>
        <PokemonSetIOModal
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            databaseService={databaseService}
            dispatchPokemon={dispatchPokemon}
            savedSets={savedSets}
            setShouldRefresh={setShouldRefresh}
        />

        <RowWrapper justifyContentContainer={'center'}>
            <GenericPressable
                onPressFunc={() => {
                    databaseService.addSet(pokemonSet);
                    setShouldRefresh(true);
                }}
                text={
                    <FontAwesome name="save" size={15} color={theme.titleText}>
                        <Text style={{color:theme.titleText}}>  save</Text>
                    </FontAwesome>
                }
                fontSize={12}
                textPadding={5}
                pressableFlex={0}/>
            {/* <GenericPressable
                onPressFunc={() => {databaseService.printAll();}}
                text={
                    <FontAwesome name="eye" size={15} color={theme.titleText}>
                        <Text style={{color:theme.titleText}}>  log all</Text>
                    </FontAwesome>
                }
                fontSize={12}
                textPadding={8}
                pressableFlex={1}/> */}
            <GenericPressable
                onPressFunc={() => setIsModalVisible(true)}
                text={
                    <Entypo name="arrow-bold-down" size={15} color={theme.titleText}>
                        <Text style={{color:theme.titleText}}> load</Text>
                    </Entypo>
                }
                fontSize={12}
                textPadding={5}
                pressableFlex={0}/>
        </RowWrapper>
        </>
    );
}



export default IORow;