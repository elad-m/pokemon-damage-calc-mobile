
const ALL_WEATHER_ABILITIES = ['Drizzle', 'Drought', 
    'Sand Stream', 'Snow Warning', 'Desolate Land', 'Primordial Sea',
    'Cloud Nine', 'Air Lock', 'Delta Stream']
const NORMAL_WEATHER_ABILITIES = ['Drizzle', 'Drought', 
                        'Sand Stream', 'Snow Warning'];
const VETO_ABILITIES = ['Desolate Land', 'Primordial Sea', 'Delta Stream']
const NO_WEATHER_VETO_ABILITIES = ['Cloud Nine', 'Air Lock'];

const TERRAIN_ABILITIES = ['Electric Surge', 'Grassy Surge', 
                        'Misty Surge', 'Psychic Surge'];

function FieldUtil(pokemonDataUtil){

    const weatherConditions = pokemonDataUtil.WEATHER_CONDITIONS;
    const terrains = pokemonDataUtil.TERRAINS;
    const defaultWeatherKey = weatherConditions[0].key;
    const defaultTerrainKey = terrains[0].key;

    function getWeatherChangingAbilityPriority(abilityName){
        if(!ALL_WEATHER_ABILITIES.includes(abilityName)){
            return 0;
        } else if(NORMAL_WEATHER_ABILITIES.includes(abilityName)){
            return 1;
        } else if(VETO_ABILITIES.includes(abilityName)){
            return 2;
        } else if(NO_WEATHER_VETO_ABILITIES.includes(abilityName)){
            return 3;
        } else {
            console.error('bad weather ability prioritizing');
        }
    }
    
    function getWeatherKeyFromAbility(abilityName){
        // the key of the weather is returned
        let weather = defaultWeatherKey;
        switch(abilityName){
            case 'Sand Stream':
                weather = 'Sand';
                break;
            case 'Drought':
                weather = 'Sun';
                break;
            case 'Drizzle':
                weather = 'Rain';
                break;
            case 'Snow Warning':
                weather = 'Hail';
                break;
            case 'Desolate Land':
                weather = 'Harsh Sunshine';
                break;
            case 'Primordial Sea':
                weather = 'Heavy Rain';
                break;
            case 'Delta Stream': 
                weather = 'Strong Winds';
                break;
            case 'Air Lock': case 'Cloud Nine': default:
                weather = defaultWeatherKey;
                break;	
        }
        return weather;
    }
    
    function getSlowerPokemon(pokemonSet1, pokemonSet2){
        if(pokemonSet1.finalStats && pokemonSet1.finalStats.spe 
            && pokemonSet2.finalStats && pokemonSet2.finalStats.spe){
                return (pokemonSet1.finalStats.spe < pokemonSet2.finalStats.spe
                    ? 0 : (pokemonSet2.finalStats.spe < pokemonSet1.finalStats.spe
                        ? 1 : Math.floor(Math.random() * Math.floor(2))))
        } else {
            console.log('could not calculate slower pokemon, setting at random');
            return Math.floor(Math.random() * Math.floor(2));
        }	
    }

    function setWeatherIfNeeded(pokemonSet1, pokemonSet2, setWeather){
        const ability1 = pokemonSet1.ability.name;
        const ability2 = pokemonSet2.ability.name;
        const weatherPriority1 = getWeatherChangingAbilityPriority(ability1);
        const weatherPriority2 = getWeatherChangingAbilityPriority(ability2);
        let weatherKey = defaultWeatherKey;
        if(weatherPriority1 || weatherPriority2){
            if(weatherPriority1 && weatherPriority2){
                if (weatherPriority1 > weatherPriority2){
                    weatherKey = getWeatherKeyFromAbility(ability1);
                } else if (weatherPriority1 < weatherPriority2){
                    weatherKey = getWeatherKeyFromAbility(ability2);
                } else if(weatherPriority1 === weatherPriority2){
                    if(weatherPriority1 === 3){
                        weatherKey = defaultWeatherKey;
                    } else { // 1&1 or 2&2
                        const slowerIndex = getSlowerPokemon(pokemonSet1, pokemonSet2);
                        const abilityName = slowerIndex === 0 ? ability1 : ability2;
                        weatherKey = getWeatherKeyFromAbility(abilityName);
                    }
                }
            } else {
                if(weatherPriority1){
                    weatherKey = getWeatherKeyFromAbility(ability1);
                } else if (weatherPriority2){
                    weatherKey = getWeatherKeyFromAbility(ability2);
                } else {
                    console.error('weather should change but it didn\'t')
                }
            } 
        } 
        // when no ability causes a weather change, go back to no weather
        // this is the behavior at pokemonshowdown
        setWeather(weatherConditions.find(obj => obj.key === weatherKey));
    }

    
    function isTerrainChangingAbility(abilityName){
        return TERRAIN_ABILITIES.includes(abilityName);
    }

    function getTerrainKeyFromAbility(abilityName){
        return abilityName.split(" ")[0];
    }

    function setTerrainIfNeeded(pokemonSet1, pokemonSet2, setTerrain){
        const terrainMayChange =  [isTerrainChangingAbility(pokemonSet1.ability.name),
                            isTerrainChangingAbility(pokemonSet2.ability.name)];
        let terrainKey = defaultTerrainKey;
        if(terrainMayChange[0] || terrainMayChange[1]){
            if(terrainMayChange[0] && terrainMayChange[1]){
                const slowerIndex = getSlowerPokemon(pokemonSet1, pokemonSet2);
                const abilityName = slowerIndex === 0
                    ? pokemonSet1.ability.name
                    : pokemonSet2.ability.name;
                terrainKey = getTerrainKeyFromAbility(abilityName);
            }
            else {
                if(terrainMayChange[0]){
                    terrainKey = getTerrainKeyFromAbility(pokemonSet1.ability.name);
                } else if (terrainMayChange[1]){
                    terrainKey = getTerrainKeyFromAbility(pokemonSet2.ability.name);
                } else {
                    console.error('terrain should change but it didn\'t')
                }
            } 
        } 
        setTerrain(terrains.find(obj => obj.key === terrainKey));
    }

    return {setWeatherIfNeeded, setTerrainIfNeeded};   
}
module.exports = FieldUtil;