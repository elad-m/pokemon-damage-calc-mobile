import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MainScreen from './app/screens/MainScreen';
import SetScreen from './app/screens/SetScreen';
import colors from './app/config/colors';

const Stack = createStackNavigator();

export default function App() {
	return (
		<NavigationContainer >
			<Stack.Navigator 
				initialRouteName="Main"
				keyboardHandlingEnabled='true'
				screenOptions={{headerTitleAlign: 'center'}}
				>
			<Stack.Screen
				name="Main"
				component={MainScreen}
				options={{
					title: 'Pick Pokemon',
					headerStyle: {
						backgroundColor: colors.header,
					},
				}}
			/>
			<Stack.Screen name="Set" component={SetScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}


