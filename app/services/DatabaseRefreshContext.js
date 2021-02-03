import React from 'react';

const DatabaseRefreshContext = React.createContext(false);

function DatabaseRefreshProvider(props){
    const [shouldRefresh, setShouldRefresh] = React.useState(false);
    return (
        <DatabaseRefreshContext.Provider value={{shouldRefresh, setShouldRefresh}}>
            {props.children}
        </DatabaseRefreshContext.Provider>
    );
}

export default DatabaseRefreshContext;
export {DatabaseRefreshProvider};