import React from 'react';
import renderer from 'react-test-renderer';
import ModalSelector from '../../components/ModalSelector';



// const defaultProps = {
//     /// what to do with the pokemon data? it is created in MainScreen, 
//     // and exporting it did not work as last time
//     selected={pokemonSet.pokemon}
//     setSelected={(payload) => dispatchPokemon({type: 'changePokemon', payload:payload})}
//     queryFunction={allPokemonData.findAllPokemonStartWith}
//     allResults={allPokemonData.pokedexPerGen}
//     defaultSelection={allPokemonData.defaultPokemon}
//     message={'Pokemon'}

// };

// describe('<ModalSelector />', () => {
//     test('has 2 children', () => {
//         const tree = renderer.create(<ModalSelector {...defaultProps}/>).toJSON();
//         expect(tree.children.length).toBe(1);
//     });

// });