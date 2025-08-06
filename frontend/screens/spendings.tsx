import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { supabase } from '../supabaseClient';
import { removeContents } from '@expo/config-plugins/build/utils/generateCode.js';

type Bill = {
  id: string;
  name: string;
  amount: number;
  due_date?: string;
  is_paid?: boolean;
};

export default function Spendings() {
  const flatListRef = useRef<FlatList>(null);
  const [fontsLoaded] = useFonts({
    Baloo: require('../assets/fonts/BalooDa2-VariableFont_wght.ttf'),
  });
  const [bills, setBills] = useState<Bill[]>([]);
  const [newBillName, setNewBillName] = useState('');
  const [newBillAmount, setNewBillAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;
      if (data) setBills(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch bills');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const addBill = async () => {
    if (!newBillName.trim() || !newBillAmount.trim()) {
      Alert.alert('Error', 'Please enter both bill name and amount');
      return;
    }

    const amount = parseFloat(newBillAmount);
    if (isNaN(amount)) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      const newBill: Bill = {
        id: Date.now().toString(),
        name: newBillName.trim(),
        amount,
        due_date: new Date().toISOString(),
      };

      setBills(prev => [...prev, newBill]);
      setNewBillName('');
      setNewBillAmount('');

      const { error } = await supabase.from('bills').insert([
        {
          name: newBill.name,
          amount: newBill.amount,
          due_date: newBill.due_date,
        },
      ]);

      if (error) {
        Alert.alert('Supabase Error', error.message);
        console.error(error);
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong while adding bill');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteBill = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.from('bills').delete().eq('id', id);

      if (error) throw error;
      setBills(prev => prev.filter(bill => bill.id !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete bill');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Your Bills</Text>

      <View style={styles.addBillContainer}>
        <TextInput
          style={styles.input}
          placeholder="Bill Name"
          value={newBillName}
          onChangeText={setNewBillName}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={newBillAmount}
          onChangeText={setNewBillAmount}
          keyboardType="numeric"
          placeholderTextColor="#888"
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={addBill}
          disabled={loading}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        contentContainerStyle={styles.billsListContainer}
        data={bills}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.billItem}>
            <View style={styles.billRow}>
              <Text style={styles.billName}>{item.name}</Text>
              <Text style={styles.billAmount}>${item.amount.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteBill(item.id)}
              disabled={loading}
            >
              <Ionicons name="trash" size={20} color="#ff4444" />
            </TouchableOpacity>
          </View>
        )}

        ListEmptyComponent={<Text style={styles.emptyText}>No bills added yet</Text>}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6db181',
    paddingHorizontal: 16,
    paddingLeft: 20,
  },
  header: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    fontFamily: 'Baloo',
  },
  addBillContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#8daf8dff',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    fontFamily: 'Baloo',
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#324826ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  billsListContainer: {
    paddingBottom: 100,
    
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap:500,
  },
  billItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    
  },
  billInfo: {
    flex: 1,
  },
  billName: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'Baloo',
  },
  billAmount: {
    fontSize: 16,
    color: '#1a231aff',
    marginTop: 5,
    fontFamily: 'Baloo',
  },
  deleteButton: {
    padding: 8,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Baloo',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1c2418ff',
    fontFamily: 'Baloo',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#3f443fff',
    fontFamily: 'Baloo',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});