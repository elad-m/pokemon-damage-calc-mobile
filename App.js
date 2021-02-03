import React from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MainScreen from './app/screens/MainScreen';
import {ThemeProvider} from './app/config/ThemeContext';

const Stack = createStackNavigator();

export default function App(){
	return (
		<ThemeProvider>
			<NavigationContainer>
				<Stack.Navigator 
					initialRouteName="Main"
					keyboardHandlingEnabled='true'
					screenOptions={{headerShown:false, }}
					>
				<Stack.Screen
					name="Main"
					component={MainScreen}		
				/>
				</Stack.Navigator>
			</NavigationContainer>
		</ThemeProvider>
	);

}
