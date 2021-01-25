import React, {useState, useContext } from 'react';
import { 
	View,
	Text,
	Switch,
	 } from 'react-native';

import colors from '../config/colors';
import ThemeContext from '../config/ThemeContext';

export default function ThemeSwitch({textColor}){
	const {theme, toggleTheme} = useContext(ThemeContext);
	const [isEnabled, setIsEnabled] = useState(false);
	const toggleSwitch = () => {
		setIsEnabled(previousState => !previousState);
		toggleTheme();
	}
	return (
		<View style={{flex: 1, flexDirection:'row', alignItems: "center", paddingLeft:20, paddingTop:20}}>
			<View>
				<Text style={{color: textColor, fontSize:12}}>Dark Theme:</Text>
			</View>
			<Switch
				trackColor={{ true: colors.darkHeader, false: colors.header}}
				thumbColor={isEnabled ? colors.darkPressable : colors.pressable}
				ios_backgroundColor="#3e3e3e"
				onValueChange={toggleSwitch}
				value={isEnabled}
			/>
		</View>
	);
}
