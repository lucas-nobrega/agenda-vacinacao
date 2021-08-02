import React, {Component} from 'react';
import axios from 'axios'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';

export default class Login extends Component {
  constructor(){
    super();
    this.checkToken();
  }  
  state = {username: '', password: '', loading: false};
   
  onChangeHandle(state, value){
    this.setState({[state]: value})
  }
  checkToken = async() =>{    
    const token = await AsyncStorage.getItem('token');
    if(token){
      console.log("edimartoken");
      this.props.navigation.navigate('Agendamentos')
    }
  }
  doLogin(){//admin@localhost
    console.log("edimar");
    const {username, password} = this.state;
    const req ={      
        'email': username, 
        'password': password     
    }
    axios.post('http://localhost:8000/api/token/',req)
    .then(
      res => {
        console.log(res);
        AsyncStorage.setItem('token',res.data.access)
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
    const {username, password,loading} = this.state;
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
          disabled={loading}
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
    backgroundColor: '#FF1493',
  },
});