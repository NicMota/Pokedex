import * as React from 'react';
import List from './components/List';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Details from './components/Details';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen name="Lista" component={List} />
        <Stack.Screen name="Details" component={Details}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}
