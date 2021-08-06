import React, {Component} from 'react';
import { View, Text, Button } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { DataTable } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; 
import AuthloadingLogin from './AuthloadingLogin'



const print = async (local, data, status) => {
  let options = {
    html: '<h1>Comprovante de '+status+'</h1><h3>Status : '+status+'</h3><h3>Local : '+local+'</h3><h3>Data : '+data+'</h3>',
    fileName: 'Comprovante',
    directory: 'Documents', 
  };

  let file = await RNHTMLtoPDF.convert(options)
  console.log(file.filePath);
  alert("O comprovante foi baixado e encontra-se na pasta 'Documents' de seus aplicativo");

}

export default class MeusAgendamentos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meusagendamentos: [],
      aguardandoDados: false      
    };
    this.getMeusAgendamentos();
  }
  

  getMeusAgendamentos = async() =>{    
  const token = await AsyncStorage.getItem('jwt');
    const headers= {
      'Content-Type' : 'application/json', 
       'Authorization' : 'Bearer ' + token
      }  
    let url = 'http://192.168.0.165:8000/api/v1/agendamento-vacinacao/';     
    axios.get(url, {headers: headers} ) 
    .then(      
      res => {
        this.setState({aguardandoDados: true})
        this.setState({meusagendamentos: res.data.results})           
      },
      err => {
        console.log(err); 
        alert("Não existe agendamento para este usuário");
      }
    )  
}

getStatus(satus){
  switch (satus) {
    case 1:
      return 'Agendado'
    case 2:
      return 'Cancelado'
    case 3:
      return 'Vaciando'
    default:
      console.log(`Sorry, we are out of ${satus}.`);
  }
}  

  render() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      
      
      {!this.state.aguardandoDados && (<AuthloadingLogin/>)}
                 
     
      {this.state.aguardandoDados && (
        <Text>Meus agendamentos</Text>)}
        <DataTable>
        <DataTable.Header>
          <DataTable.Title>Status</DataTable.Title>
          <DataTable.Title>Local</DataTable.Title>
          <DataTable.Title >Data</DataTable.Title>
          <DataTable.Title >Ação</DataTable.Title>
        </DataTable.Header>
        
        {this.state.meusagendamentos.map((agendamento, index) => (
          <DataTable.Row>
            <DataTable.Cell>{this.getStatus(agendamento.status)}</DataTable.Cell>
        <DataTable.Cell>{agendamento.local_vacinacao.nom_estab}</DataTable.Cell>
          <DataTable.Cell >{agendamento.data}</DataTable.Cell>
          <DataTable.Cell ><Button
            onPress={() => print(agendamento.local_vacinacao.nom_estab, agendamento.data, this.getStatus(agendamento.status))}
            title="Imprimir"
            color="blue"
          /></DataTable.Cell>
           </DataTable.Row>
        ))}
       
      </DataTable>
    </View>
  );
}

}
