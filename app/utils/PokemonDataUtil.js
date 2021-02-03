const  {calculate, Generations, Pokemon, Move, 
    NATURES, ABILITIES, Field} = require('@smogon/calc') ;

/* filters any item that does not affect damage:
 * pokeballs, mega-stones, evolution stones, fossils, z crystals
 * evolution items and bottle caps.
 */
function itemFilter(item){
    const onlyEvolutionItems = ['Dubious Disc', 'Electirizer', 'Dragon Scale',
    'Magmarizer', 'Prism Scale', 'Protector', 'Reaper Cloth', 'Sachet',
    'Up-Grade', 'Whipped Dream'];
    return (!item.megaEvolves 
        && !(item.name.endsWith("Ball") && item.name !== 'Iron Ball') 
        && !(item.name.endsWith("Stone") 
            && item.name !== 'Hard Stone' && item.name !== 'Float Stone')
        && !(item.name.endsWith("Fossil"))
        && !(item.name.endsWith(" Z"))
        && !(onlyEvolutionItems.includes(item.name))
        && !(item.name.endsWith("Cap"))    
    );
}

/* filters status and z-moves
 */
function moveFilter(move){
    return (move.category != 'Status' && !move.isZ);
}
/**
 * Basically handles all the non-UI, pokemon related data.
 * The gate to smogon/calc in other words.
*/
function PokemonDataUtil(currentGeneration) {
    const noItem = '(none)';
    const noStatus = 'Healthy'; // default status in /models/pokemonSet.js as well
    const GEN = Generations.get(currentGeneration); 

    //pokemon
    const pokedexPerGen = Array.from(GEN.species).sort((a, b) => a.name > b.name);
    const defaultPokemon = pokedexPerGen[0];
    
    //moves
    const movesPerGenWithNoMove = Array.from(GEN.moves).filter(moveFilter)
        .sort((a, b) => a.name > b.name);
    movesPerGenWithNoMove.shift();
    const movesPerGen = movesPerGenWithNoMove; 
    const defaultMove = movesPerGen.find(move => move.name === 'Tackle');

    //items
    const itemsPerGen = Array.from(GEN.items).filter(itemFilter)
        .map((o, i) => {return {"name":o.name , "id":i}}).sort((a, b) => a.name > b.name);
    itemsPerGen.unshift({"name":noItem , "id":itemsPerGen.length});
    
    //natures
    const natures = Object.entries(NATURES).map((o,i) => {return {"name": `${o[0]}`, "more":`(+${o[1][0]},-${o[1][1]})`, "id":i}});

    const abilitiesPerGen = ABILITIES[currentGeneration]
        .map((o, i) => {return {"name":o , "id":i}})
        .sort((a, b) => a.name > b.name);
            
    const WEATHER_CONDITIONS = [{name:'No Weather',key:'No Weather', color:'#e1e1e1'},
                            {name:'Sandstorm',key:'Sand', color:'#e1e1e1'},
                            {name:'Harsh Sunlight',key:'Sun', color:'#e1e1e1'},
                            {name:'Rain',key:'Rain', color:'#e1e1e1'},
                            {name:'Hail',key:'Hail', color:'#e1e1e1'},
                            {name:'Extremely Harsh Sunlight',key:'Harsh Sunshine', color:'#e1e1e1'},
                            {name:'Heavy Rain',key:'Heavy Rain', color:'#e1e1e1'},
                            {name:'Strong Winds',key:'Strong Winds', color:'#e1e1e1'}];
    const TERRAINS = [{name:'No Terrain',key:'No Terrain',color:'#e1e1e1'},
                    {name:'Electric',key:'Electric', color:'#e1e1e1'},
                    {name:'Grassy',key:'Grassy', color:'#e1e1e1'},
                    {name:'Psychic',key:'Psychic', color:'#e1e1e1'},
                    {name:'Misty',key:'Misty', color:'#e1e1e1'} ];
    const STATUS_NAMES = [{name:'Asleep',key:'slp', color:'#A890F0'}, 
                        {name:'Poisoned',key:'psn', color:'#B050B0'},
                        {name:'Burned',key:'brn', color:'#F08030'},
                        {name:'Frozen',key:'frz', color:'#98d8d8'},
                        {name:'Paralysis',key:'par', color:'#F8D030'},
                        {name:'Badly Poisoned',key:'tox', color:'#a050e0'}];
    STATUS_NAMES.unshift({name: 'Healthy', key:noStatus,color:'#d0f0ff'});
    const defaultStatus = STATUS_NAMES[0];

    function getPokemonDetailsObject(pokemonSet){
        const pokemonDetails = {
            evs: pokemonSet.evs,
            ivs: pokemonSet.ivs,
            ability: pokemonSet.ability.name,
            level:pokemonSet.level,
            nature: pokemonSet.nature.name.split('(')[0]
        };
        if (pokemonSet.item.name != noItem){
            pokemonDetails.item = pokemonSet.item.name;
        }
        if (pokemonSet.status.key != noStatus){
            pokemonDetails.status = pokemonSet.status.key;
        }
        return pokemonDetails;
    }

    function getMoveDetailsObject(pokemonSet){
        const moveOptions = {
            ability:pokemonSet.ability.name,
            species: pokemonSet.pokemon.name,
            hits:pokemonSet.ability.name === 'Skill Link'? 5: 3,
        }
        if (pokemonSet.item.name != noItem){
            moveOptions.item = pokemonSet.item.name;
        }
        
        return moveOptions;
    }
    function isThereWeatherCondition(weather){
        // no or undefined weather are no weather
        return weather.key === WEATHER_CONDITIONS[0].key? false: 
            WEATHER_CONDITIONS.includes(weather);
    }

    function isThereTerrain(terrain){
        return terrain.key === TERRAINS[0].key? false: 
            TERRAINS.includes(terrain);
    }

    function simpleCalculate(pokemonSet1, pokemonSet2, currentWeather, currentTerrain){
        const pokemon1 = new Pokemon(GEN, pokemonSet1.pokemon.name, 
            getPokemonDetailsObject(pokemonSet1));
        const pokemon2 = new Pokemon(GEN, pokemonSet2.pokemon.name, 
            getPokemonDetailsObject(pokemonSet2));
        const pokemon1move = new Move(GEN, pokemonSet1.move.name, getMoveDetailsObject(pokemonSet1));
        const pokemon2move = new Move(GEN, pokemonSet2.move.name, getMoveDetailsObject(pokemonSet2));
        
        let result1 = result2 = '';
        const isWeather = isThereWeatherCondition(currentWeather);
        const isTerrain = isThereTerrain(currentTerrain);
        if(isWeather && isTerrain){
            const field = new Field({weather: currentWeather.key, terrain:currentTerrain.key});
            result1 = calculate(GEN, pokemon1, pokemon2, pokemon1move, field);
            result2 = calculate(GEN, pokemon2, pokemon1, pokemon2move, field);
        } else if(isWeather) {
            const field = new Field({weather: currentWeather.key});
            result1 = calculate(GEN, pokemon1, pokemon2, pokemon1move, field);
            result2 = calculate(GEN, pokemon2, pokemon1, pokemon2move, field);
        } else if(isTerrain){
            const field = new Field({terrain: currentTerrain.key});
            result1 = calculate(GEN, pokemon1, pokemon2, pokemon1move, field);
            result2 = calculate(GEN, pokemon2, pokemon1, pokemon2move, field);
        } else {
            result1 = calculate(GEN, pokemon1, pokemon2, pokemon1move);
            result2 = calculate(GEN, pokemon2, pokemon1, pokemon2move,);
        }
        return [result1, result2];
    }

    function getAbilityObject(abilityName){
        return abilitiesPerGen.find(ability => ability.name === abilityName);
    }

    return {pokedexPerGen, 
        defaultPokemon,
        movesPerGen,
        defaultMove,
        itemsPerGen,
        natures,
        abilitiesPerGen,
        WEATHER_CONDITIONS,
        TERRAINS,
        STATUS_NAMES,
        defaultStatus,
        simpleCalculate,
        getAbilityObject};
};

module.exports = PokemonDataUtil;