import React from 'react';
import {FlatList,
        View,
            } from 'react-native';
import dimens from '../config/dimens';

import GenericPressable from './GenericPressable';

function Item({item, setPickedItem, isPicked}){
    function onItemPress(){  
        setPickedItem(item);
    }
    return (
        <View style={[{}, isPicked
            ? {borderWidth:3, borderRadius: dimens.defaultBorderRadius}
            : {}]}>
            <GenericPressable
                textColor={'black'}
                pressableBackgroundColor={item.color}
                onPressFunc={onItemPress}
                text={item.name}
                fontSize={17}
            />
        </View>
  );
}
// elements in data now are objects with: name, key and color
export default function PickerView({pickedItem, setPickedItem, data}){
    
    const renderItem = ({ item }) => (
        <Item
            key={item.key} 
            item={item} // object, not string
            setPickedItem={setPickedItem}
            isPicked={pickedItem.key === item.key}
        />
    );
    
    return(
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <FlatList
                keyboardShouldPersistTaps='handled' // so that list items are pressable when keyboard up
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.key}
            />
        </View>
    );
}