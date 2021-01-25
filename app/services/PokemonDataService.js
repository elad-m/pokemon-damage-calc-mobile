const  {calculate, Generations, Pokemon, Move, NATURES, ITEMS, Field} = require('@smogon/calc') ;

/**
 * Basically handles all the non-UI, pokemon related things.
 * The gate to smogon/calc in other words.
*/
function PokemonDataService(currentGeneration) {
    const noItem = '(none)';
    const gameType = 'Singles';
    const GEN = Generations.get(currentGeneration); 

    const pokedexPerGen = Array.from(GEN.species).sort((a, b) => a.name > b.name);
    const defaultPokemon = pokedexPerGen[0];
    
    const movesPerGenWithNoMove = Array.from(GEN.moves).sort((a, b) => a.name > b.name);
    movesPerGenWithNoMove.shift();
    const movesPerGen = movesPerGenWithNoMove; 
    const defaultMove = movesPerGen.find(move => move.name === 'Tackle');

    const itemsPerGen = ITEMS[currentGeneration].map((o, i) => {return {"name":o , "id":i}})
        .sort((a, b) => a.name > b.name);
    itemsPerGen.unshift({"name":noItem , "id":itemsPerGen.length});
    const natures = Object.entries(NATURES).map((o,i) => {return {"name": `${o[0]}`, "more":`(+${o[1][0]},-${o[1][1]})`, "id":i}});
    
    const WEATHER_CONDITIONS = ['No Weather', 'Sand', 'Sun', 'Rain', 'Hail', 'Harsh Sunshine', 'Heavy Rain', 'Strong Winds'];

    function getPokemonDetailsObject(pokemonSet){
        const pokemonDetails = {
            evs: pokemonSet.evs,
            ivs: pokemonSet.ivs,
            level:50,
            
            nature: pokemonSet.nature.name.split('(')[0]
        };
        if (pokemonSet.item.name != noItem){
            pokemonDetails.item = pokemonSet.item.name;
        }
        return pokemonDetails;
    }
    function isThereWeatherCondition(weather){
        // no or undefined weather are no weather
        return weather === WEATHER_CONDITIONS[0]? false: 
            (WEATHER_CONDITIONS.includes(weather)? true: false);
    }

    function simpleCalculate(pokemonSet1, pokemonSet2, currentWeather){
        const pokemon1 = new Pokemon(GEN, pokemonSet1.pokemon.name, 
            getPokemonDetailsObject(pokemonSet1));
        const pokemon2 = new Pokemon(GEN, pokemonSet2.pokemon.name, 
            getPokemonDetailsObject(pokemonSet2));
        const pokemon1move = new Move(GEN, pokemonSet1.moves.name);
        const pokemon2move = new Move(GEN, pokemonSet2.moves.name);
    
        const field = new Field({weather: currentWeather});
        let result1 = result2 = '';
        if(isThereWeatherCondition(currentWeather)){
            result1 = calculate(GEN, pokemon1, pokemon2, pokemon1move, field);
            result2 = calculate(GEN, pokemon2, pokemon1, pokemon2move, field);
        } else {
            result1 = calculate(GEN, pokemon1, pokemon2, pokemon1move);
            result2 = calculate(GEN, pokemon2, pokemon1, pokemon2move);
        }
    
        return [result1, result2];
    }

    return {pokedexPerGen, 
        defaultPokemon,
        movesPerGen,
        defaultMove,
        itemsPerGen,
        natures,
        WEATHER_CONDITIONS,
        simpleCalculate};
};

module.exports = PokemonDataService;