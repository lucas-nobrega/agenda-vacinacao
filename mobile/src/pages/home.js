import * as React from 'react';
import { View, Text,StyleSheet,TouchableOpacity,Image,Button  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class Home extends React.Component { 
  constructor(){
    super();
    this.verLogin();
  }


  verLogin = async() =>{
    const token = await AsyncStorage.getItem('token');
    if(token){
      this.props.navigation.navigate('Agendamentos')
    }
  }
    render() {
      return (
        <View style={styles.container}>
            <Image style={styles.image} source={require('../images/logo.png')} />
          <Text>Consulte seus agendamentos</Text>
          <TouchableOpacity
          style={styles.loginBtn} onPress={() => this.props.navigation.navigate('Login')}
          >
          <Text style={styles.loginText}>ENTRAR</Text>
        </TouchableOpacity>
        </View>
        
      );
    }
  }
  const styles = StyleSheet.create({ 
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    image: {
      marginBottom: 40,
    },
  
    inputView: { 
      backgroundColor: '#FFC0CB',
      borderRadius: 30,
      width: '70%',
      height: 45,
      marginBottom: 20,
  
      alignItems: 'center',
    },
  
    TextInput: {
      height: 50,
      flex: 1,
      padding: 10,
      marginLeft: 20,
    },
  
    forgot_button: {
      height: 30,
      marginBottom: 30,
    },
  
    loginBtn: {
      width: '80%',
      borderRadius: 25,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 40,
      backgroundColor: '#FFBC40',
    },
  });