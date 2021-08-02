import * as React from 'react';
import { View, Text,StyleSheet,TouchableOpacity,Alert,Button  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; 
import { DataTable } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import * as Print from 'expo-print';
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";


export default class DetailsScreen extends React.Component {
  constructor() {
    super();
    this.verLogin();
  }

 
  createPDF = async () => {
    const htmlContentt = '<!DOCTYPE html> <html lang="en"><head><meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Pdf Content</title></head><body><h1>Hello, UppLabs!</h1> </body></html>';
 
    console.log("dsfsd22");
    try {
      const { uri } = await Print.printToFileAsync({ htmlContentt });
      if (Platform.OS === "ios") {
        await Sharing.shareAsync(uri);
      } else {
        const permission = await MediaLibrary.requestPermissionsAsync();
        if (permission.granted) {
          await MediaLibrary.createAssetAsync(uri);
        }
      }
    } catch (error) {
      console.log("dsfsd2fff2");
      console.error(error);
    }
}

  logout = async () => {
    const token = await AsyncStorage.removeItem('token');
    if (!token) {
      this.props.navigation.navigate('Home')
    }
  }
 
 
  verLogin = async () => {    
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.log("edimarHometoken", token);
      this.props.navigation.navigate('home')
    }
  }
  getAgendamentos(){//admin@localhost
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
    return (

      <View  style={styles.container}>
<TouchableOpacity
          style={styles.loginBtn}
          onPress= { () => this.logout()}          
          >
          <Text style={styles.loginText}>Sair da aplicação</Text>
        </TouchableOpacity>
        
        <DataTable>
      <DataTable.Header>
        <DataTable.Title>Descrição</DataTable.Title>
        <DataTable.Title >Data</DataTable.Title>
        <DataTable.Title >Imprimir comprovante</DataTable.Title>
      </DataTable.Header>

      <DataTable.Row>
        <DataTable.Cell>Vacindo</DataTable.Cell>
        <DataTable.Cell >20/01/2020</DataTable.Cell>
        <DataTable.Cell  onPress= { () => this.createPDF()}   ><Icon name="print" size={30} color="#4F8EF7" /></DataTable.Cell>
      </DataTable.Row>
     
      <DataTable.Row>
        <DataTable.Cell>Agendado</DataTable.Cell>
        <DataTable.Cell >20/01/2020</DataTable.Cell>
        <DataTable.Cell onPress= { () => this.createPDF()}   ><Icon name="print" size={30} color="#4F8EF7" /></DataTable.Cell>
      </DataTable.Row>
      </DataTable>
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
    width: '20%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: '#FF1493',
  },
});




