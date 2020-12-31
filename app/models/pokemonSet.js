
function getDefaultIvs(){
    return {'hp': 31, 'atk':31, 'def':31, 'spa':31, 'spd':31, 'spe':31};
}

function getDefaultEvs(){
    return {'hp': 0, 'atk':0, 'def':0, 'spa':0, 'spd':0, 'spe':0};
}

function PokemonSet(ofPokemon, ofMove, ofItem, ofNature, ofIvs=getDefaultIvs(), ofEvs=getDefaultEvs())  {
    let pokemon= ofPokemon;
    let moves =  ofMove;
    let item = ofItem;
    let nature = ofNature;
    let ivs = ofIvs;
    let evs = ofEvs;

    return {pokemon, moves, item, nature, ivs, evs}
}

module.exports = PokemonSet;