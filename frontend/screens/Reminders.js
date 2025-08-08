import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Change this URL if testing on a physical device to your machine's LAN IP
  const API_BASE_URL = 'http://localhost:5000/api/reminders';

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE_URL);
      const data = await res.json();
      setReminders(data);
    } catch (err) {
      console.error('Failed to fetch reminders:', err);
      Alert.alert('Error', 'Failed to fetch reminders from server.');
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}/mark-paid`, {
        method: 'PUT',
      });
      if (!res.ok) throw new Error('Failed to mark as paid');
      fetchReminders(); // Refresh list
    } catch (err) {
      console.error('Failed to mark as paid:', err);
      Alert.alert('Error', 'Failed to mark reminder as paid.');
    }
  };

  const addReminder = async () => {
    if (!newMessage.trim()) {
      Alert.alert('Validation', 'Please enter a reminder message.');
      return;
    }

    setSending(true);
    try {
      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to add reminder');
      }

      const addedReminder = await res.json();
      setReminders((prev) => [addedReminder, ...prev]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to add reminder:', err);
      Alert.alert('Error', err.message);
    } finally {
      setSending(false);
    }
  };

  const unpaid = reminders.filter((r) => !r.isPaid);
  const paid = reminders.filter((r) => r.isPaid);

  const renderReminder = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.task}</Text>
      <Text style={styles.subtitle}>
        Due: {item.date} at {item.time}
      </Text>
      {!item.isPaid && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => markAsPaid(item._id)}
        >
          <Text style={styles.buttonText}>Mark as Paid</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Text style={styles.heading}>Add a New Reminder</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="E.g. Remind me to pay ₹400 for electricity by 15th August at 6 PM"
          value={newMessage}
          onChangeText={setNewMessage}
          editable={!sending}
        />
        <TouchableOpacity
          style={[styles.addButton, sending && { backgroundColor: '#aaa' }]}
          onPress={addReminder}
          disabled={sending}
        >
          <Text style={styles.buttonText}>{sending ? 'Adding...' : 'Add'}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6db181" style={{ marginTop: 20 }} />
      ) : (
        <>
          <Text style={styles.heading}>Upcoming Bills</Text>
          {unpaid.length === 0 ? (
            <Text style={styles.emptyText}>No upcoming bills.</Text>
          ) : (
            <FlatList
              data={unpaid}
              keyExtractor={(item) => item._id}
              renderItem={renderReminder}
            />
          )}

          <Text style={styles.heading}>Paid Bills</Text>
          {paid.length === 0 ? (
            <Text style={styles.emptyText}>No paid bills yet.</Text>
          ) : (
            <FlatList
              data={paid}
              keyExtractor={(item) => item._id}
              renderItem={renderReminder}
            />
          )}
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2efe7',
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#4f5e4e',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  addButton: {
    backgroundColor: '#6db181',
    marginLeft: 10,
    paddingHorizontal: 18,
    justifyContent: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#e0d3c0',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b4a39',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    color: '#5c665c',
  },
  button: {
    backgroundColor: '#6db181',
    marginTop: 10,
    padding: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  emptyText: {
    color: '#7a7a7a',
    fontStyle: 'italic',
    marginBottom: 10,
  },
});

