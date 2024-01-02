// App.js (atau index.js)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home';
import About from './About';

import EditFilm from './EditFilm';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Tambah Film" component={About} />
        <Stack.Screen name="EditFilm" component={EditFilm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
