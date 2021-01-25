import React, {useState, useContext} from 'react';
import {
    ScrollView,
    StyleSheet,
} from 'react-native';
import colors from '../config/colors';
import ThemeContext from '../config/ThemeContext';
import GenericPressable from './GenericPressable';
import GenericModal from './GenericModal';

// Usage: for pokemon set details, instead of failing Collapsible
function PressActivatedModalContainer({children, message}){
    const {theme} = useContext(ThemeContext);
    const [areResultsVisible, setResultsVisible] = useState(false);
    return(
        <ScrollView
            contentContainerStyle={{...styles.modalSelectorContainer, borderColor:theme.divider}}
            keyboardShouldPersistTaps={'always'}
            >
            <GenericModal isModalVisible={areResultsVisible}>
                {children}
                <GenericPressable
                    onPressFunc={() => setResultsVisible(false)}
                    text={'Back'}
                    pressableFlex={0}
                />
            </GenericModal>
            <GenericPressable
                onPressFunc={() => setResultsVisible(true)}
                text={message}
                fontSize={15}
                alignSelf={'center'}/>
        </ScrollView> 
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