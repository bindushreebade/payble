import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';

interface BillItemProps {
  name: string;
  dueDate: string;
  isPaid: boolean;
}

const getRowColor = (dueDate: string): string => {
  const today = new Date();
  const due = new Date(dueDate);
  const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24));

  if (diff <= 10) return '#d82222ff';        // Red
  if (diff <= 20) return '#f6cd2aff';        // Yellow
  if (diff <= 30) return '#28de5eff';        // Green
  return '#e0e0e0';                         
};

const BillItem: React.FC<BillItemProps> = ({ name, dueDate, isPaid }) => {
  const rowColor = getRowColor(dueDate);

  return (
    <View style={[styles.billRow, { backgroundColor: rowColor }]}>
      <Text style={styles.billText}>
        {isPaid ? '✅' : '⭕'} {name} - Due: {format(new Date(dueDate), 'dd MMM')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  billRow: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  billText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily:"Baloo",
  },
});

export default BillItem;
