import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface Reminder {
  _id: string;
  task: string;
  date: string; // expected format: YYYY-MM-DD
  time: string; // expected format: HH:MM (24h)
  isPaid: boolean;
}

export default function Notifications() {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      // If testing on a device, replace localhost with your computer IP
      const response = await fetch('http://localhost:5000/api/reminders');
      const data = await response.json();
      setReminders(data);
    } catch (err) {
      console.error('Failed to fetch reminders:', err);
    }
  };

  const markAsPaid = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/reminders/${id}/mark-paid`, {
        method: 'PUT',
      });
      fetchReminders(); // Refresh after marking paid
    } catch (err) {
      console.error('Failed to mark as paid:', err);
    }
  };

  // Utility to format date + time strings nicely
  const formatDateTime = (dateStr: string, timeStr: string) => {
    try {
      // Construct a Date object from date + time strings
      const [year, month, day] = dateStr.split('-').map(Number);
      const [hour, minute] = timeStr.split(':').map(Number);
      const date = new Date(year, month - 1, day, hour, minute);

      // Options for displaying date & time nicely
      return date.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      // fallback just show raw
      return `${dateStr} at ${timeStr}`;
    }
  };

  const unpaid = reminders.filter((r) => !r.isPaid);
  const paid = reminders.filter((r) => r.isPaid);

  const renderReminder = ({ item }: { item: Reminder }) => (
    <View style={[styles.notificationCard, item.isPaid && styles.paidCard]}>
      <MaterialIcons name="notifications" size={28} color="#5b4a3f" style={styles.icon} />
      <View style={styles.notificationText}>
        <Text style={styles.description}>{item.task}</Text>
        <Text style={styles.details}>
          Due: {formatDateTime(item.date, item.time)}
        </Text>
      </View>
      {!item.isPaid && (
        <TouchableOpacity style={styles.payButton} onPress={() => markAsPaid(item._id)}>
          <Text style={styles.payButtonText}>Mark Paid</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      {unpaid.length === 0 ? (
        <Text style={styles.emptyText}>You don't have any notifications yet.</Text>
      ) : (
        <>
          <FlatList
            data={unpaid}
            keyExtractor={(item) => item._id}
            renderItem={renderReminder}
            ListHeaderComponent={<Text style={styles.sectionTitle}>Pending</Text>}
          />
        </>
      )}

      {paid.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Paid</Text>
          <FlatList
            data={paid}
            keyExtractor={(item) => item._id}
            renderItem={renderReminder}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0efe9',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Baloo',
    textAlign: 'center',
    color: '#3a362d',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    fontFamily: 'Baloo',
    color: '#5a513c',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 50,
    fontFamily: 'Baloo',
  },
  notificationCard: {
    backgroundColor: '#f7f6f1',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e2e0d5',
  },
  paidCard: {
    backgroundColor: '#e5efe5',
  },
  icon: {
    marginRight: 10,
  },
  notificationText: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Baloo',
    color: '#4e4637',
  },
  details: {
    fontSize: 14,
    color: '#66604d',
    marginTop: 4,
    fontFamily: 'Baloo',
  },
  payButton: {
    backgroundColor: '#6db181',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Baloo',
    fontWeight: '600',
  },
});





