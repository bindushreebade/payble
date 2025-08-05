import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView,Alert } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons, FontAwesome, Feather } from '@expo/vector-icons';
import * as Font  from 'expo-font';
import { useNavigation } from '@react-navigation/native';


export default function SignIn() {
  const navigation = useNavigation();
  Font.loadAsync({
    Baloo: require('../assets/fonts/BalooDa2-VariableFont_wght.ttf'), // ← relative to App.tsx
  });
  
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });
  
  const handlePhoneChange = (text: string) => {
    // Only allow digits, remove everything else immediately
    const digitsOnly = text.replace(/[^0-9]/g, '');
    setPhone(digitsOnly);
  };

  const validateForm = () => {
    const newErrors = { msg : '' };

    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    let isValid = true;

    if(!name.trim()&&!phone.trim()&&!email.trim()&&!password.trim()){
      newErrors.msg+='All feilds are required!\n';
      isValid = false;
    }
    else{
      if (!name.trim()) {
        newErrors.msg += 'Name is required\n';
        isValid = false;
      }

      if (!phone.trim()) {
        newErrors.msg += 'Phone number is required\n';
        isValid = false;
      } else if (!phoneRegex.test(phone)) {
        newErrors.msg += 'Enter a valid 10-digit phone number\n';
        isValid = false;
      }

      if (!email.trim()) {
        newErrors.msg += 'Email is required\n';
        isValid = false;
      } else if (!emailRegex.test(email)) {
        newErrors.msg += 'Invalid email format\n';
        isValid = false;
      }

      if (!password.trim()) {
        newErrors.msg += 'Password is required\n';
        isValid = false;
      } else if (!strongPasswordRegex.test(password)) {
        newErrors.msg += 'Password must be 8+ chars, include upper, lower, and a number\n';
        isValid = false;
      }
    }

    setErrors(newErrors);
    if (isValid) {
      alert('Sign In successful!');
      navigation.navigate("Home");
    }
    else{
      alert(newErrors.msg)
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <MotiView from={{ opacity: 0, translateY: -30 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 200 }}>
          <Text style={styles.header}>Sign-In</Text>
        </MotiView>

        <MotiView from={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 400 }}>
          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color="#578b5bff" style={styles.icon} />
            <TextInput
              placeholder="Name/Nickname"
              placeholderTextColor="#5d564dff"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
          </View>
        </MotiView>

        <MotiView from={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 500 }}>
          <View style={styles.inputContainer}>
            <FontAwesome name="phone" size={20} color="#578b5bff" style={styles.icon} />
            <TextInput
              placeholder="Phone Number"
              placeholderTextColor="#5d564dff"
              value={phone}
              onChangeText={handlePhoneChange}
              style={styles.input}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
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

        <TouchableOpacity style={styles.button} onPress={validateForm} >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <Text style={{textAlign: 'center',fontFamily: 'Baloo',fontWeight:500,marginTop: 10}}>Already have an account?</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.buttonText} >Login</Text>
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
    color: '#323c2bff',
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

