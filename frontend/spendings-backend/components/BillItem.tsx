import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function BillItem({ name, isPaid, dueDate, urgencyColor, onPay }) {
  return (
    <View style={styles.item}>
      {/* Left: urgency indicator */}
      <View style={[styles.colorIndicator, { backgroundColor: urgencyColor }]} />

      {/* Middle: Bill details */}
      <View style={styles.details}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.date}>Due: {dueDate}</Text>
      </View>

      {/* Right: Pay button or Paid label */}
      {!isPaid ? (
        <TouchableOpacity style={styles.payBtn} onPress={onPay}>
          <Text style={styles.payBtnText}>Pay</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.paidText}>Paid</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#555',
  },
  payBtn: {
    backgroundColor: 'green',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  payBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  paidText: {
    color: 'gray',
    fontStyle: 'italic',
  },
});
