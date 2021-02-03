import React, {useState} from 'react';
import {View,
    StyleSheet,
} from 'react-native';
import colors from '../config/colors';
import GenericPressable from './GenericPressable';
import GenericModal from './GenericModal';

// Usage: for pokemon set details, instead of failing Collapsible
// and for pickers without querying option
function PressActivatedModalContainer({children, message, pressableFlex=1, alignPressable='stretch'}){
    const [isModalVisible, setModalVisible] = useState(false);
    return(
        <View style={styles.modalSelectorContainer}>
            <GenericModal isModalVisible={isModalVisible}>
                {children}
                <GenericPressable
                    onPressFunc={() => setModalVisible(false)}
                    text={'Back'}
                    pressableFlex={0}
                />
            </GenericModal>
            <GenericPressable
                pressableFlex={pressableFlex}
                onPressFunc={() => setModalVisible(true)}
                text={message}
                fontSize={17}
                alignSelf={alignPressable}/>
        </View>
    );
}

const styles = StyleSheet.create({
  modalSelectorContainer: {
    flex:1, 
    justifyContent:'center',
    alignItems:'center',
    margin:5
  },
  centeredView: {
      flex:1,
      justifyContent:'center',
      padding:10,
  },
  modalView: {
    flex:1,
    justifyContent: 'center',
    backgroundColor:colors.primary,
    borderColor:'black',
    elevation: 5,

    borderRadius: 10,
    borderWidth:1,
  },   

});

export default PressActivatedModalContainer;