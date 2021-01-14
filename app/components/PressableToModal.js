import React, {useState} from 'react';
import {View, 
    ScrollView,
  Text,
  StyleSheet,
  SafeAreaView,
  Modal,
  Pressable} from 'react-native';
import colors from '../config/colors';
import dimens from '../config/dimens';

function SimpleModal(props){
    const {areResultsVisible, setResultsVisible} = props;
    return (
        <SafeAreaView >
            <Modal
                transparent={false}
                animationType='slide'
                visible={areResultsVisible}>
                <View style={{...styles.centeredView, }} > 
                    <View style={{...styles.modalView, }} >
                        {props.children}
                        
                        <Pressable
                            onPress={() => setResultsVisible(false)}
                            style={{...styles.pressableWrapper, flex:0 }}>
                            <Text style={{...styles.pressableInnerText, fontSize:20}}>
                                Back
                            </Text>
                        </Pressable>
                    </View>
                </View>    
            </Modal>
        </SafeAreaView>
    );
}

function PressableToModal(props){    
    const [areResultsVisible, setResultsVisible] = useState(false);
    return(
        <ScrollView
            contentContainerStyle={{...styles.modalSelectorContainer}}
            keyboardShouldPersistTaps={'always'}
            >
            {/* <View 
                style={{...styles.modalSelectorContainer,}}
            > */}
            <SimpleModal
                areResultsVisible={areResultsVisible}
                setResultsVisible={setResultsVisible}>
                {props.children}
            </SimpleModal>
            <Pressable
                onPress={() => setResultsVisible(true)}
                style={{...styles.pressableWrapper}}>
                <Text style={{...styles.pressableInnerText, fontSize:17}}>
                    More Set Details
                </Text>
            </Pressable>
            {/* </View> */}
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
    borderColor:'black'
  },
  pressableWrapper:{  
    flex:1,  
    backgroundColor: colors.pressable,
    margin:5,
    borderColor:'grey',
    borderWidth:1,
    elevation:2,
    borderRadius: dimens.defaultBorderRadius,    
  },
  pressableInnerText:{
      textAlign:'center',
      fontSize: 20,  
      padding: 10,        
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

export default PressableToModal;