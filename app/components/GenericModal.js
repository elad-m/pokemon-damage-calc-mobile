import React, {useContext} from 'react';
import {View, 
  SafeAreaView,
  Modal,
  StyleSheet} from 'react-native';
import colors from '../config/colors';
import dimens from '../config/dimens';
import ThemeContext from '../config/ThemeContext';

export default function GenericModal(props){
    const {theme} = useContext(ThemeContext);
    const {isModalVisible, 
        mostInnerViewStyle={...styles.modalView,backgroundColor:theme.primary, borderColor:theme.divider},
        useMostInnerViewCustomStyle=false,
        modalViewFlex=1,
        } = props;
    return (
        <SafeAreaView >
            <Modal
                transparent={false}
                animationType='slide'
                visible={isModalVisible}>
                <View style={{...styles.centeredView, backgroundColor:theme.primary}} > 
                    <View 
                    style={[{...styles.modalView,
                            backgroundColor:theme.primary, 
                            borderColor:theme.divider,
                            flex:modalViewFlex},
                             !(useMostInnerViewCustomStyle)
                             ? mostInnerViewStyle
                             : {...styles.modalView,
                                backgroundColor:theme.primary, 
                                borderColor:theme.divider,
                                flex:modalViewFlex}]}>
                        {props.children}
                    </View>
                </View>    
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    modalSelectorContainer: {
        flex:1, 
        justifyContent:'center',
        alignItems:'center',
    
        borderStartWidth: 1,
        borderEndWidth: 1,
      },
    centeredView: {
        flex:1,
        justifyContent:'center',
        padding:10,
    },
    modalView: {
        justifyContent: 'center',
        backgroundColor:colors.primary,
        elevation: dimens.defaultElevation,
        borderRadius: dimens.defaultBorderRadius,
        borderWidth:dimens.defaultBorderWidth,
        overflow:'hidden',

        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },   
  
})