import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
  const navigation = useNavigation();
  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Edit profile button clicked');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'You have been logged out.');
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={require('../assets/images/user.png')} // You can use any local image or a remote URL
          style={styles.avatar}
        />
        <Text style={styles.name}>Sara</Text>
        <Text style={styles.email}>sara@example.com</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
        <Feather name="edit" size={20} color="#fff" />
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Feather name="log-out" size={20} color="#fff" />
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#76ce91ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#132117ff',
  },
  name: {
    fontSize: 24,
    color: '#152019ff',
    fontFamily: "Baloo",
    fontWeight: 800,
  },
  email: {
    fontSize: 20,
    marginTop: 5,
    color:"#152019ff",
    fontFamily: "Baloo",
    fontWeight: 500,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#45573bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    borderColor: "#0b150fff",
    borderWidth:2,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#e57373',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: "#ae0606ff",
    borderWidth:2,
  },
  buttonText: {
    color: '#ffffffff',
    fontSize: 16,
    marginLeft: 10,
    fontFamily: "Baloo",
    fontWeight: 500,
  },
});
