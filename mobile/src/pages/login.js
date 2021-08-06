import React, {Component} from 'react';
import axios from 'axios'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';

export default class Login extends Component {
  constructor(){
    super();
    this.verLogin();
  }  
  state = {username: '', password: '', loading: false};
   
  onChangeHandle(state, value){
    this.setState({[state]: value})
  }
  verLogin = async() =>{    
    const token = await AsyncStorage.getItem('jwt');
    if(token){
      this.props.navigation.navigate('Agendamentos')
    }
  }
  doLogin(){
    const {username, password} = this.state; 
    const req ={      
        'email': username, 
        'password': password     
    }
    axios.post('http://192.168.0.165:8000/api/token/',req) 
    .then(
      res => {
        console.log("LogiiEdimar",res.data);
        AsyncStorage.setItem('jwt',res.data.access)
          .then(
            res => {
              this.props.navigation.navigate('Agendamentos')
            }
          )
        
      },
      err => {
        alert("A senha ou usuários estão incorretos");
      }
    ) 
  }

  render() {
    const {username, password} = this.state;
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={require('../images/logo.png')} />

        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput} 
            placeholderTextColor="#003f5c"
            placeholder="Endereço de e-mail"
            value={username}
            onChangeText={(value)=> this.onChangeHandle('username', value)}
            autoCapitalize="none"
            autoCorrect={false}
            
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholderTextColor="#003f5c"
            placeholder="Senha"
            value={password}
            onChangeText={(value)=> this.onChangeHandle('password', value)}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
          />
        </View>      

        <TouchableOpacity
          style={styles.loginBtn}
          onPress= { () => this.doLogin()}          
          >
          <Text style={styles.loginText}>LOGIN</Text>
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
    backgroundColor: '#FFD890',
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