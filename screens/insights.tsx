// screens/insights.tsx
import React from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const expenseData = [
  { name: 'Food', amount: 450, color: '#FF6384', legendFontColor: '#333', legendFontSize: 15 },
  { name: 'Transport', amount: 200, color: '#36A2EB', legendFontColor: '#333', legendFontSize: 15 },
  { name: 'Shopping', amount: 300, color: '#FFCE56', legendFontColor: '#333', legendFontSize: 15 },
  { name: 'Bills', amount: 250, color: '#4BC0C0', legendFontColor: '#333', legendFontSize: 15 },
];

const lineData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      data: [500, 600, 450, 700, 800, 650],
      strokeWidth: 2,
    },
  ],
};

const Insights = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Expense Insights</Text>

      <Text style={styles.sectionTitle}>Monthly Spending</Text>
      <LineChart
        data={lineData}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
      />

      <Text style={styles.sectionTitle}>Category Breakdown</Text>
      <PieChart
        data={expenseData}
        width={screenWidth - 32}
        height={220}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="10"
        absolute
        chartConfig={chartConfig}
      />
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: () => '#333',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    marginVertical: 12,
    fontWeight: '600',
  },
  chart: {
    borderRadius: 8,
  },
});

export default Insights;
