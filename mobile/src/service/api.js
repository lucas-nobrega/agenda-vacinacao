import axios from 'axios'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
function getAccessToken() {
    return AsyncStorage.getItem("jwt") != null ? JSON.parse(AsyncStorage.getItem("jwt")).access : null
 }
const api = axios.create({
    baseURL: 'http://192.168.0.165:8000',
    timeout: 5000,
    headers: {
       'Content-Type': 'application/json',
       'Authorization': getAccessToken() != null ? 'Bearer ' + getAccessToken() : null
    }
 });