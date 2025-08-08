import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { bills } from '../spendings-backend/data/billsData';
import BillItem from '../spendings-backend/components/BillItem';

const SpendingsScreen = () => {
  return (
    <ScrollView style={{ padding: 16, backgroundColor: '#d6fae1ff' }}>
      <Text style={{ fontSize: 35, fontWeight: 'bold', marginBottom: 16 ,fontFamily:"Baloo"}}>Your Bills</Text>
      {bills.map((bill, index) => (
        <BillItem
          key={index}
          name={bill.name}
          dueDate={bill.dueDate}
          isPaid={bill.isPaid}
        />
      ))}
    </ScrollView>
  );
};

export default SpendingsScreen;
