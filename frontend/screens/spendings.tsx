import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { bills as initialBills } from '../spendings-backend/data/billsData';
import { getSpreadColor } from '../spendings-backend/utils/spreadUtils';
import { spendingsStyles } from '../spendings-backend/styles/spendingsStyles';
import BillItem from '../spendings-backend/components/BillItem';
import SpreadMeter from '../spendings-backend/components/SpreadMeter';

export default function Spendings() {
  const [bills, setBills] = useState(initialBills);

  const handlePay = (index) => {
    setBills((prevBills) => {
      const updated = [...prevBills];
      updated[index] = { ...updated[index], isPaid: true };

      // unpaid first, paid last
      const unpaid = updated.filter((b) => !b.isPaid);
      const paid = updated.filter((b) => b.isPaid);
      return [...unpaid, ...paid];
    });
  };

  // Only unpaid bills count towards spread calculation
  const unpaidDates = bills
    .filter((b) => !b.isPaid)
    .map((b) => b.dueDate);

  const spreadColor = unpaidDates.length > 0
  ? getSpreadColor(unpaidDates)
  : 'green'; 


  return (
    <ScrollView contentContainerStyle={spendingsStyles.container}>
      <Text style={spendingsStyles.header}>Your Bills</Text>

      {bills.map((bill, index) => (
        <BillItem
          key={index}
          name={bill.name}
          isPaid={bill.isPaid}
          dueDate={bill.dueDate}
          onPay={() => handlePay(index)} urgencyColor={undefined}        />
      ))}

      <SpreadMeter spreadColor={spreadColor} />
    </ScrollView>
  );
}
