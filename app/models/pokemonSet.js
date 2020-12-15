
function getDefaultIvs(){
    return {'hp': 31, 'atk':31, 'def':31, 'spa':31, 'spd':31, 'spe':31};
}

function getDefaultEvs(){
    return {'hp': 0, 'atk':0, 'def':0, 'spa':0, 'spd':0, 'spe':0};
}

function PokemonSet(ofPokemon, ofMove, ofIvs=getDefaultIvs(), ofEvs=getDefaultEvs())  {
    let pokemon= ofPokemon;
    let moves =  ofMove;
    let ivs = ofIvs;
    let evs = ofEvs;

    return {pokemon, moves, ivs, evs}
}

module.exports = PokemonSet;