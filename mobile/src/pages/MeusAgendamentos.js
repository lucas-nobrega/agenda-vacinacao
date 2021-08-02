import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Button, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class DetailsScreen extends React.Component {
  constructor(){
    super();
    this.checkToken();
  }
  logout = async() =>{
    const token = await AsyncStorage.removeItem('token');    
    this.props.navigation.navigate('home')
    
  }
  checkToken = async() =>{
    console.log("edimar");
    const token = await AsyncStorage.getItem('token');
    if(!token){
      this.props.navigation.navigate('home')
    }
  }
    render() {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
           <Button onPress={this.logout()}>Sair</Button>
          <Text>Details Screen</Text>

        </View> 
      );
    }
  } 