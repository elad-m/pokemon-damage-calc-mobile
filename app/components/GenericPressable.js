import React, {useContext} from 'react';
import { StyleSheet, Pressable, Text, View } from "react-native";
import ThemeContext from '../config/ThemeContext';

import dimens from '../config/dimens';

export default function GenericPressable({onPressFunc, text, pressableBackgroundColor, 
    textColor, opacity=0.5, pressableFlex=1, textViewFlex=0, fontSize=20,
     textPadding=10, pressableMargin=5, alignSelf='stretch',minHeight=50, ...props}){
    const {theme} = useContext(ThemeContext);
    const pressableBackgroundColor2 = pressableBackgroundColor || theme.pressable;
    const textColor2 = textColor || theme.titleText;
    return (
        <Pressable
            style={{...styles.pressableWrapper, flex: pressableFlex, 
                backgroundColor:pressableBackgroundColor2, borderColor:theme.border, 
                margin:pressableMargin, alignSelf:alignSelf,
            minHeight: minHeight}}
            style={({pressed}) => [{opacity: pressed? opacity : 1}, 
                {...styles.pressableWrapper, flex: pressableFlex, 
                    backgroundColor:pressableBackgroundColor2, borderColor:theme.border, 
                    margin:pressableMargin, alignSelf:alignSelf}]}
            onPress={onPressFunc}>
            <View style={{flex:textViewFlex}}>    
                <Text style={{...styles.pressableInnerText, fontSize:fontSize, color:textColor2, 
                    padding: textPadding}}>
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
              