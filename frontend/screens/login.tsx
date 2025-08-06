import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../supabaseClient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';

// Define your navigation types
type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function Login() {
  const navigation = useNavigation();
  const [secureText, setSecureText] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Proper font loading
  const [fontsLoaded] = useFonts({
    Baloo: require('../assets/fonts/BalooDa2-VariableFont_wght.ttf'),
  });

  const checkUserExists = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('users') // Changed from 'profiles' to 'users' - use your actual table name
        .select('email')
        .eq('email', email)
        .maybeSingle(); // Using maybeSingle instead of single to avoid throwing errors

      if (error) {
        console.error('Supabase error:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking user:', error);
      return false;
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!fontsLoaded) {
      Alert.alert('Error', 'Fonts not loaded yet');
      return;
    }

    setLoading(true);

    try {
      // First check if user exists
      const userExists = await checkUserExists(email);
      
      if (!userExists) {
        Alert.alert(
          'Account Not Found',
          'No account found with this email. Would you like to sign up?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Up', onPress: () => navigation.navigate('Signup') }
          ]
        );
        return;
      }

      // If user exists, attempt login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        Alert.alert('Success', 'Logged in successfully');
        navigation.navigate('Home');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = error.message;
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Incorrect email or password. Please try again.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email before logging in.';
      }

      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#45573bff" />
      </View>
    );
  }

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
              autoCorrect={false}
              editable={!loading}
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
              editable={!loading}
            />
            <TouchableOpacity onPress={() => !loading && setSecureText(!secureText)}>
              <Feather name={secureText ? 'eye-off' : 'eye'} size={20} color="#45573bff" />
            </TouchableOpacity>
          </View>
        </MotiView>

        <TouchableOpacity 
          style={[styles.button, loading && styles.disabledButton]} 
          onPress={()=>navigation.navigate("Home")}
          disabled={loading}
        >
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
  },
  button: {
    backgroundColor: '#45573bff',
    paddingVertical: 15,
    paddingHorizontal: 135,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FAF9EE',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'Baloo',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6db181',
  },
});