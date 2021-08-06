import * as React from 'react';
import LoginScreen from './src/pages/login';
import HomeScreen from './src/pages/home';
import MeusAgendamentosScreen from './src/pages/MeusAgendamentos';
import { Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 



const logout = () => {
  AsyncStorage.removeItem('jwt');
}

function HomeScreent() {
  const navigation = useNavigation();
  return (
    <Button
      onPress={() => { logout(); navigation.navigate('Home') }}
      title="Sair"
      color="red"
    />
  );
}
const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="Agendamentos"
          component={MeusAgendamentosScreen}
          options={{
            headerRight: () => (
              <HomeScreent />
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;