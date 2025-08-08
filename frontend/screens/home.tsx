import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView,Alert } from 'react-native';
import { MotiView } from 'moti';
import{Image} from 'moti';
import { Ionicons, FontAwesome, Feather } from '@expo/vector-icons';
import * as Font  from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../supabaseClient';

export default function Home() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('profiles') 
            .select('full_name')
            .eq('id', user.id)
            .single();

          if (data) {
            setUserName(data.full_name || user.email?.split('@')[0] || 'User');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);
  return (
    
    <SafeAreaView style={styles.container}>
      <MotiView from={{ translateY: -50, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{ type: 'timing', duration: 800 }}style={styles.navbar}>
        <MotiView style={styles.navLinks}>
          <TouchableOpacity style={styles.navText}> Dashboard </TouchableOpacity>
          <TouchableOpacity style={styles.navText} onPress={()=>navigation.navigate("Reminders")}> Reminders </TouchableOpacity>
          <TouchableOpacity style={styles.navText} onPress={()=>navigation.navigate("Spendings")}> Spendings </TouchableOpacity>
          <TouchableOpacity style={styles.navText}> Insights </TouchableOpacity>
        </MotiView>
        <View style={styles.rightContainer}>
        </View>
        <TouchableOpacity style={styles.notification}>
          <Feather name="bell" size={24} color="#2b2f28" />
          <View style={styles.badge} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.user} onPress={() => navigation.navigate('Profile')}>
          <Feather name="user" size={24} color="#2b2f28" />
        </TouchableOpacity>
      </MotiView>

    {/* Hero Section */}
    <View style={styles.heroContainer}>
        <MotiView from={{ translateX: -100, opacity: 0 }}
            animate={{ translateX: 0, opacity: 1 }}
            transition={{ type: 'timing', duration: 1000 }}
            style={styles.textCard} >
            <Text style={styles.welcome}>Welcome {userName || 'User'}!</Text>
            <Text style={styles.track}>Stay on Track.</Text>
            <Text style={styles.control}>Stay in Control.</Text>
            <Text style={styles.subtitle}>
            Stay ahead of your bills with effortless tracking and timely payment reminders. Take charge of your finances and eliminate late fees with confidence :)
            </Text>
        </MotiView>

        <MotiView from={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 10 }}
            style={styles.imageCard} >
            <Image
            source={require('../assets/images/homeimg.svg')} 
            style={styles.heroImage}
            />
        </MotiView>
    </View>
        <Text style={{ 
        fontSize: 30, 
        fontWeight: '300', 
        color: '#2b2f28', 
        textAlign: 'center', 
        fontFamily: 'Baloo', 
        backgroundColor: '#2f7e40ff',
        marginBottom: 30,
        }}>
        Manage. Remind. Pay Smart
    </Text>

    {/* Footer */}
    <MotiView from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1500 }}
        style={styles.footer} >
              <Text style={styles.footerText}>© 2024 Payble</Text>

        <MotiView style={styles.footerLinks}>
            <TouchableOpacity>
            <Text style={styles.linkText}>support@paybleapp.com</Text>
            </TouchableOpacity>

            <TouchableOpacity>
            <Text style={styles.linkText}>Privacy Policy</Text>
            </TouchableOpacity>

            <TouchableOpacity>
            <Text style={styles.linkText}>Terms of Service</Text>
            </TouchableOpacity>
        </MotiView>

        <Text style={styles.footerVersion}>v1.0.0</Text>
    </MotiView>
    </SafeAreaView>

    
    
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#76ce91ff',
    flexDirection: 'column',
  },
  navbar: {
    backgroundColor: '#d8d1bfff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 2,
    marginBottom: 30,
  },
  welcome: {
  fontSize: 50,
  fontWeight: 700,
  marginBottom: 10,
  fontFamily: 'Baloo'
},
  textGroup: {
    gap: 6, 
    },

    track: {
    fontSize: 40,
    fontWeight: '600',
    marginBottom: -5, 
    fontFamily: 'Baloo',
    },

    control: {
    fontSize: 40,
    fontWeight: '600',
    marginTop: 0,
    fontFamily: 'Baloo',
    },
  logo: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  navLinks: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    pointerEvents: 'auto',
    },

  link: {
    fontSize: 14,
    color: '#2b2f28',
    fontWeight: '500',
    position: 'relative',
  },
  activeLink: {
    textDecorationLine: 'underline',
    fontWeight: '700',
  },
  notification: {
    position: 'relative',
    marginRight:0,
  },
  user: {
    position: 'relative',
    marginRight: 15,
    borderRadius: 50,
    borderWidth: 2,
  },
  badge: {
    width: 8,
    height: 8,
    backgroundColor: 'red',
    borderRadius: 4,
    position: 'absolute',
    top: -2,
    right: -2,
  },
  navText: {
    fontSize: 16,
    color: '#2b2f28',
    fontWeight: '500',
    fontFamily: 'Baloo',
  },
  hero: {
    marginTop: 5,
    textAlign: 'left',
    paddingTop: 50,
    gap: 10,
    marginLeft: 30,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#2b2f28',
    fontFamily: 'Baloo',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 20,
    color: '#2b2f28',
    marginBottom: 20,
    fontFamily: 'Baloo',
    fontWeight: 200,
    marginRight: 200,
  },
  curve: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    tintColor: '#284237',
  },
  rightContainer: {
  flexDirection: 'row',
  justifyContent: 'flex-end', // Push content to the right              // Full width to align correctly
  paddingRight: 20,           // Add spacing from the right edge
},
    image:{
        flexDirection: 'row',
        justifyContent: 'space-between', // pushes text left, image right
        display:'flex',
        paddingHorizontal: 20,
        marginTop: 50,
        height:200,
        width:200,
        backgroundColor: '#76ce91ff',
    },
    sectionCard: {
  backgroundColor: '#d8d1bfff',
  borderRadius: 16,
  padding: 20,
  margin: 10,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 4,
}
,
heroRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

heroContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  marginTop: 30,
  gap: 10,
},

textCard: {
    flex:1.5,
  marginTop:30,
  backgroundColor: '#d8d1bfff',
  borderRadius: 16,
  padding: 20,
  marginRight: 10,
  width:300,
  marginBottom: 30,
},

imageCard: {
  flex: 1,

  borderRadius: 16,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 10,
  elevation: 3,
},

heroImage: {
  width: 350,
  height: 350,
  resizeMode: 'contain',
  borderRadius: 12,
},
footer: {
  backgroundColor: '#d8d1bfff',
  alignItems: 'center',
  paddingVertical: 16,
  borderTopWidth: 1,
  borderTopColor: '#ccc',
},

footerText: {
  fontSize: 14,
  color: '#2b2f28',
  fontFamily: 'Baloo',
},

footerLinks: {
  flexDirection: 'row',
  gap: 20,
  marginTop: 8,
  flexWrap: 'wrap',
  justifyContent: 'center',
},

linkText: {
  color: '#2b2f28',
  fontSize: 14,
  textDecorationLine: 'underline',
  fontFamily: 'Baloo',
},

footerVersion: {
  fontSize: 12,
  color: '#888',
  marginTop: 8,
},

});
