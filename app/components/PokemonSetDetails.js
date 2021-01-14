import React from 'react';
import {
    Text,
    Pressable,
    View
} from 'react-native';

import RowWrapper from './RowWrapper';
import SearchableModalSelector from './SearchableModalSelector';
import StatsTable from './StatsTable';

function PokemonSetDetails(props){
    const {pokemonSet, dispatchPokemon, titleTextViewStyle, containerStyle, 
        items, natures} = props;
    return (
        <View style={containerStyle}>
            <RowWrapper
                titleTextViewStyle={titleTextViewStyle}
                titleFontSize={17}
                message={`Nature: `}>
                <SearchableModalSelector
                    containerFlex={1}
                    selected={pokemonSet.nature}
                    setSelected= {(payload) => dispatchPokemon({type: 'changeNature', payload:payload})}
                    queryFunction={(query) => natures.filter(nature =>  nature.name.startsWith(query))}
                    allResults={natures}
                    defaultSelection={natures[0]}
                    message={'Nature'}
                    selectorFontSize={17}
                />
            </RowWrapper>
            <RowWrapper
                titleTextViewStyle={titleTextViewStyle}
                titleFontSize={17}
                message={`Item: `}>
                <SearchableModalSelector
                    containerFlex={1}
                    selected={pokemonSet.item}
                    setSelected= {(payload) => dispatchPokemon({type: 'changeItem', payload:payload})}
                    queryFunction={(query) => items.filter(item =>  item.name.startsWith(query))}
                    allResults={items}
                    defaultSelection={items[0]}
                    message={'Item'}
                    selectorFontSize={17}
                />
            </RowWrapper>

            <StatsTable
                pokemon={pokemonSet.pokemon}
                nature={pokemonSet.nature}
                ivs={pokemonSet.ivs}
                setIvs={(payload) => dispatchPokemon({type: 'changeIvs', payload:payload})}
                evs={pokemonSet.evs}
                setEvs={(payload) => dispatchPokemon({type: 'changeEvs', payload:payload})}
                />
        </View>
    );
}


export default PokemonSetDetails;