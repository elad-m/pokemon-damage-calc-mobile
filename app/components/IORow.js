import React, {useState} from 'react';
import { useEffect } from 'react';

import RowWrapper from './RowWrapper';
import PokemonSetIOModal from './PokemonSetIOModal';
import GenericPressable from './GenericPressable';


function IORow(props){
    const {databaseService, pokemonSet, dispatchPokemon} = props;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [savedSets, setSavedSets] = useState([]);
    const [shouldRefresh, setShouldRefresh] = useState(false);

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
        <RowWrapper>
            <GenericPressable
                onPressFunc={() => {
                    databaseService.addSet(pokemonSet);
                    setShouldRefresh(true);
                }}
                text={'Save'}
                fontSize={12}
                textPadding={8}
                pressableFlex={1}/>
            <GenericPressable
                onPressFunc={() => setIsModalVisible(true)}
                text={'Load'}
                fontSize={12}
                textPadding={8}
                pressableFlex={1}/>
        </RowWrapper>
        </>
    );
}



export default IORow;