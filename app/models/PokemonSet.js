
function getDefaultIvs(){
    return {'hp': 31, 'atk':31, 'def':31, 'spa':31, 'spd':31, 'spe':31};
}

function getDefaultEvs(){
    return {'hp': 0, 'atk':0, 'def':0, 'spa':0, 'spd':0, 'spe':0};
}

function getNatureCoefficient(stat, nature){
    let rawSplit = nature.more.split(/\W+/i);
    let boosted = rawSplit[1]; // just how it splits, say (+atk,-def)
    let nerfed = rawSplit[2];
    let natureCoefficient = 1;
    if(boosted === nerfed){
        natureCoefficient = 1;
    } else if (boosted === stat){
        natureCoefficient = 1.1;
    } else if (nerfed === stat){
        natureCoefficient = 0.9;
    } else {
        natureCoefficient = 1;
    }
    return natureCoefficient;
    
}

export function calcStat(stat, base, iv, ev, nature, level=50){
    const natureCoefficient = getNatureCoefficient(stat, nature);
    let calculatedStat = base;
    if (stat === 'hp') {
        calculatedStat =  (base === 1)
            ? base
            : (Math.floor(((base * 2 + iv + Math.floor(ev / 4)) * level) / 100) + level + 10);
    } else {
        calculatedStat =  Math.floor((Math.floor(((base * 2 + iv + Math.floor(ev / 4)) * level) / 100) + 5) * natureCoefficient);
    }
    return calculatedStat;
}

function PokemonSet(ofPokemon, withMove, withItem, withNature, 
    withAbility, withStatus,  withLevel=100, 
    withIvs=getDefaultIvs(), withEvs=getDefaultEvs())  {
    let pokemon= ofPokemon;
    let move =  withMove;
    let item = withItem;
    let nature = withNature;

    let ability = withAbility;
    let status= withStatus;
    let level = withLevel;

    let ivs = withIvs;
    let evs = withEvs;
    let finalStats = Object.assign({}, ...Object.keys(pokemon.baseStats)
            .map(k => ({[k]: calcStat(k, pokemon.baseStats[k], ivs[k], evs[k], nature, level)})))

    return {pokemon, move, item, nature, 
        ability, status, level,
        ivs, evs, finalStats};
}

module.exports = PokemonSet;
