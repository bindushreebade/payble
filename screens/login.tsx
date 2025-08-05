import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView,Alert } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons, FontAwesome, Feather } from '@expo/vector-icons';
import * as Font  from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import Home from './home';


export default function Login() {
  Font.loadAsync({
    Baloo: require('../assets/fonts/BalooDa2-VariableFont_wght.ttf'), // ← relative to App.tsx
  });
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const validateForm = () => {
    const newErrors = { msg:'' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    let isValid = true;

    if (!email.trim()) {
      newErrors.msg = 'Email is required\n';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.msg = 'Invalid email format\n';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.msg = 'Password is required\n';
      isValid = false;
    } 

    setErrors(newErrors);
    if (isValid) {
      alert('Login Successful');
      navigation.navigate("Home");
    }
    else{
      alert(newErrors.msg);
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <MotiView from={{ opacity: 0, translateY: -30 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 200 }}>
          <Text style={styles.header}>Login</Text>
        </MotiView>

        <MotiView from={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 600 }}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} color="#578b5bff" style={styles.icon} />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#5d564dff"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </MotiView>

        <MotiView from={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 700 }}>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#578b5bff" style={styles.icon} />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#5d564dff"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureText}
              style={[styles.input, { flex: 1 }]}
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)}>
              <Feather name={secureText ? 'eye-off' : 'eye'} size={20} color="#45573bff" />
            </TouchableOpacity>
          </View>
        </MotiView>

        <TouchableOpacity style={styles.button} onPress={() => validateForm()}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#6db181',
    fontFamily: 'Baloo',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    
  },
  header: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#323c2bff',
    marginBottom: 10,
    fontFamily: 'Baloo',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    width: 320,
    shadowColor: '#686',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    fontFamily: 'Baloo',
    borderWidth: 2,
    borderColor: '#323c2bff',
  },
  icon: {
    marginRight: 10,
    color: '#45573bff',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2B3227',
    fontFamily: 'Baloo',      
    borderBlockColor: '#fff',
    borderWidth: 0,
    borderBottomWidth: 0,
  },
  button: {
    backgroundColor: '#45573bff',
    paddingVertical: 10,
    paddingHorizontal: 135,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: {
    color: '#FAF9EE',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'Baloo',
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    alignSelf: 'flex-start',
    marginLeft: 25,
    marginTop: -10,
    marginBottom: 5,
    fontFamily: 'Baloo',
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },

});
function setPhone(cleaned: string) {
  throw new Error('Function not implemented.');
}

