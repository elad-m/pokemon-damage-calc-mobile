import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MainScreen from './app/screens/MainScreen';
import SavedSetsScreen from './app/screens/SavedSetsScreen';
import colors from './app/config/colors';
import {ThemeProvider} from './app/config/ThemeContext';

const Stack = createStackNavigator();

export default function App() {
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
				<Stack.Screen 
					name="SavedSets" 
					component={SavedSetsScreen}
					options={{
						title: 'Saved Sets',
						headerStyle: {
							backgroundColor: colors.header,
						},
					}} />
				</Stack.Navigator>
			</NavigationContainer>
		</ThemeProvider>
	);
}


