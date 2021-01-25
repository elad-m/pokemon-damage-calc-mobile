import React, {useContext} from 'react';
import { StyleSheet, Pressable, Text, View } from "react-native";
import ThemeContext from '../config/ThemeContext';

import dimens from '../config/dimens';

export default function GenericPressable({onPressFunc, text, opacity=0.5, pressableFlex=1, 
    fontSize=20, textPadding=10, pressableMargin=10, alignSelf='stretch',...props}){
    const {theme} = useContext(ThemeContext);
    return (
        <Pressable
            style={{...styles.pressableWrapper, flex: pressableFlex, 
                backgroundColor:theme.pressable, borderColor:theme.border, margin:pressableMargin, alignSelf:alignSelf}}
            style={({pressed}) => [{opacity: pressed? opacity : 1}, 
                {...styles.pressableWrapper, flex: pressableFlex, 
                    backgroundColor:theme.pressable, borderColor:theme.border, margin:pressableMargin, alignSelf:alignSelf}]}
            onPress={onPressFunc}>
            <View>    
                <Text style={{...styles.pressableInnerText, fontSize:fontSize, color:theme.titleText, padding: textPadding}}>
                    {text}
                </Text>
                {props.children}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    pressableWrapper:{  
        borderWidth:dimens.defaultBorderWidth,
        elevation:dimens.defaultElevation,
        borderRadius: dimens.defaultBorderRadius,

        shadowColor: "black", // ios only
        shadowOffset: {
          width: 5,
          height: 5
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      pressableInnerText:{
          textAlign:'center',      
      },
})
              