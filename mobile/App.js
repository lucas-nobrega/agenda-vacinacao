import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import MeusAgendamentosScreen from './src/pages/MeusAgendamentos'
import LoginScreen from './src/pages/login'
import HomeScreen from './src/pages/home'  



const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Login: LoginScreen,
    Agendamentos: MeusAgendamentosScreen, 
  },
  {
    initialRouteName: 'Home',  
  }
);

const AppContainer = createAppContainer(RootStack);

export default class Appp extends React.Component {
  render() {
    return <AppContainer />;
  }
}