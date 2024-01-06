import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home';
import Create from './Create';
import Register from './Register';
import EditFilm from './EditFilm';
import Login from './Login';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Tambah Film" component={Create} />
        <Stack.Screen name="EditFilm" component={EditFilm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
