const  {calculate, Generations, Pokemon, Move, NATURES, ITEMS} = require('@smogon/calc') ;

/**
 * Basically handles all the non-UI, pokemon related things.
 * The gate to smogon/calc in other words.
*/
function PokemonDataService(currentGeneration) {
    const GEN = Generations.get(currentGeneration); 

    const pokedexPerGen = Array.from(GEN.species).sort((a, b) => a.name > b.name);
    const defaultPokemon = pokedexPerGen[0];
    
    const movesPerGenWithNoMove = Array.from(GEN.moves).sort((a, b) => a.name > b.name);
    movesPerGenWithNoMove.shift();
    const movesPerGen = movesPerGenWithNoMove; 
    const defaultMove = movesPerGen.find(move => move.name === 'Tackle');

    const itemsPerGen = ITEMS[currentGeneration].map((o, i) => {return {"name":o , "id":i}});
    const natures = Object.entries(NATURES).map((o,i) => {return {"name": `${o[0]}`, "more":`(+${o[1][0]},-${o[1][1]})`, "id":i}});

    function simpleCalculate(pokemonSet1, pokemonSet2){
        const pokemon1 = new Pokemon(GEN, pokemonSet1.pokemon.name, {
            evs: pokemonSet1.evs,
            ivs: pokemonSet1.ivs,
            level:50,
            item:pokemonSet1.item.name,
            nature: pokemonSet1.nature.name.split('(')[0]
        });
        const pokemon2 = new Pokemon(GEN, pokemonSet2.pokemon.name, {
            evs: pokemonSet2.evs,
            ivs: pokemonSet2.ivs,
            level: 50,
            item:pokemonSet2.item.name,
            nature: pokemonSet2.nature.name.split('(')[0]
        });
        const pokemon1move = new Move(GEN, pokemonSet1.moves.name);
        const pokemon2move = new Move(GEN, pokemonSet2.moves.name);
    
        const result1 = calculate(GEN, pokemon1, pokemon2, pokemon1move);
        const result2 = calculate(GEN, pokemon2, pokemon1, pokemon2move);
    
        return [result1, result2];
    }

    return {pokedexPerGen, 
        defaultPokemon,
        movesPerGen,
        defaultMove,
        itemsPerGen,
        natures,
        simpleCalculate};
};

module.exports = PokemonDataService;