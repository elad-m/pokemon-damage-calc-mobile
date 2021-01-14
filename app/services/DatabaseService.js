import * as SQLite from 'expo-sqlite';

function DatabaseService(sid){

    /**
     * private
     */
    const serviceId = sid;
    const db = SQLite.openDatabase('pokemonSets2.db');
    const INIT_TABLE = 'CREATE TABLE IF NOT EXISTS pokemonSets (id INTEGER PRIMARY KEY NOT NULL, pokemon_set BLOB);';
    const GET_ALL = `SELECT * FROM pokemonSets;`;
    const ADD_SET = 'INSERT OR REPLACE INTO pokemonSets(pokemon_set) VALUES(?);';
    const GET_SET_WITH_ID = `SELECT pokemon_set FROM pokemonSets WHERE id = ?;`;
    const DELETE_SET_WITH_ID = `DELETE FROM pokemonSets WHERE id = ?;`
    const DELETE_ALL = `DROP TABLE pokemonSets;`;

    // to save database querying on re-renderings
    let currentPokemonSets = [];

    const transactionError = (error) => {
        console.log(error);
        console.log('transaction error');
    };
    const transactionSuccess =  () => console.log(`transaction complete`);
    
    function setToAll(dbArray){
        console.log('inside callback before assignment' + JSON.stringify(currentPokemonSets));
        currentPokemonSets = [...dbArray];
        console.log('inside callback after assignment' + JSON.stringify(currentPokemonSets));
    }

    function simplifyResult(result){
        const parsedResult = JSON.parse(result.pokemon_set);
        let simplified = {id: result.id};
        const set_array_of_strings = [
            parsedResult.pokemon.name, 
            parsedResult.moves.name, '\n',
            parsedResult.nature.name,
            parsedResult.item.name,'\n',
            Object.values(parsedResult.ivs).toString(),'\n',
            Object.values(parsedResult.evs).toString()];
        simplified.pokemon_set = set_array_of_strings.join(' ')
        // simplified.obj = parsedResult;
        return simplified;
    }

    function simplifyResultArray(resultArray){
        return  resultArray.map((obj) => simplifyResult(obj))
    }
    // public
    function init(){
        const onSuccess = () => {
            console.log(`db created successfully with sid: ${serviceId}`);
        };
        const onError = (_, error) => {
            console.log(error);
            console.log(`error creating db`);
        };
        db.transaction(tx => {
            tx.executeSql(
                INIT_TABLE, 
                [], onSuccess, onError);
        }, transactionError, transactionSuccess);
    }

    function getAllSets(callback) {
        console.log(`getting all...`)
        const onSuccess = (_, { rows: { _array } }) => {
            try{
                console.log(`got all rows successfully (without setting)`);
                const simplifiedResult = simplifyResultArray(_array);
                callback(simplifiedResult);
            } catch (error){
                console.log(error)
            }
        };
        const onError = (_, error) => {
            console.log(error);
            console.log(`error getting (without setting)`);
        };
        db.transaction(tx => {
            tx.executeSql(GET_ALL,[], onSuccess, onError);
        }, transactionError, transactionSuccess);
    }

    function addSet(pokemonSet){
        console.log('adding set...')
        const stringifiedSet = JSON.stringify(pokemonSet);
        const onSuccess = (tx, resultSet) => {
            try{
                console.log(`pokemon set was added successfully`);    
            } catch (error){
                console.log(error)
            }
        };
        const onError = (tx, error) => {
            console.log(`error adding set`);
            console.log(error);
        };
        db.transaction(
            tx => {
                tx.executeSql(ADD_SET, [stringifiedSet], onSuccess, onError);
            },  transactionError, transactionSuccess);
    }

    function getSet(id, dispatchPokemon){
        console.log(`getting set...`);
        const onSuccess = (tx, resultSet) => {
            console.log(`pokemon set was gotten successfully`);
            if(resultSet 
                && resultSet.rows 
                && resultSet.rows.length > 0 
                && resultSet.rows._array[0].pokemon_set){
                    const pokemonSetObject = JSON.parse(resultSet.rows._array[0].pokemon_set);
                    // console.log(pokemonSetObject);
                    dispatchPokemon({type: 'changeAll', payload:pokemonSetObject});
            } else {
                console.log(`something is null: ` + JSON.stringify(resultSet));
            }
        };
        const getOnError = (id) => {
            return (tx, error) => {
                console.log(error);
                console.log(`failed to load set with id ${id}`);
            };
        };
        db.transaction(
            tx => {
                tx.executeSql(GET_SET_WITH_ID, [id], onSuccess, getOnError(id));
            }, transactionError, transactionSuccess)
    }

    function resetDataBase(){
        console.log(`deleting all tables...`);
        db.transaction(
            tx => {
                tx.executeSql(DELETE_ALL, [], 
                ()=> console.log(`delete successful`), 
                (_,error)=> {
                    console.log(error);
                    console.log(`delete failed`)
                });
            }, transactionError, transactionSuccess);
        init();
    }

    function deleteSet(id){
        const onSuccess = (tx, resultSet) => {
            console.log(`pokemon set was deleted successfully`);
        };
        const onError = (tx, error) => {
            console.log(`error deleting set`);
            console.log(error);
        };
        db.transaction(
            tx => {
                tx.executeSql(DELETE_SET_WITH_ID, [id], onSuccess, onError);
            },
            transactionError,transactionSuccess);
    }

    function dropTables(db){
        console.log(`deleting database with name: ${db.name}`)
        db.transaction(
            tx => {
                tx.executeSql(DELETE_ALL, [], 
                ()=> console.log(`delete successful`), 
                (_,error)=> {
                    console.log(error);
                    console.log(`delete failed`)
                });
            }, transactionError, transactionSuccess);
    }


    return {init, getAllSets, addSet, getSet, deleteSet, resetDataBase};
}

module.exports = DatabaseService;