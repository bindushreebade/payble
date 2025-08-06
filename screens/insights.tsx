// // screens/insights.tsx
// import React from 'react';
// import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
// import { LineChart, PieChart } from 'react-native-chart-kit';

// const screenWidth = Dimensions.get('window').width;

// const expenseData = [
//   { name: 'Food', amount: 450, color: '#FF6384', legendFontColor: '#333', legendFontSize: 15 },
//   { name: 'Transport', amount: 200, color: '#36A2EB', legendFontColor: '#333', legendFontSize: 15 },
//   { name: 'Shopping', amount: 300, color: '#FFCE56', legendFontColor: '#333', legendFontSize: 15 },
//   { name: 'Bills', amount: 250, color: '#4BC0C0', legendFontColor: '#333', legendFontSize: 15 },
// ];

// const lineData = {
//   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//   datasets: [
//     {
//       data: [500, 600, 450, 700, 800, 650],
//       strokeWidth: 2,
//     },
//   ],
// };

// const Insights = () => {
//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.header}>Expense Insights</Text>

//       <Text style={styles.sectionTitle}>Monthly Spending</Text>
//       <LineChart
//         data={lineData}
//         width={screenWidth - 32}
//         height={220}
//         chartConfig={chartConfig}
//         style={styles.chart}
//       />

//       <Text style={styles.sectionTitle}>Category Breakdown</Text>
//       <PieChart
//         data={expenseData}
//         width={screenWidth - 32}
//         height={220}
//         accessor="amount"
//         backgroundColor="transparent"
//         paddingLeft="10"
//         absolute
//         chartConfig={chartConfig}
//       />
//     </ScrollView>
//   );
// };

// const chartConfig = {
//   backgroundGradientFrom: '#ffffff',
//   backgroundGradientTo: '#ffffff',
//   color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//   labelColor: () => '#333',
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#FAFAFA',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     marginVertical: 12,
//     fontWeight: '600',
//   },
//   chart: {
//     borderRadius: 8,
//   },
// });

// export default Insights;

// screens/insights.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import axios from 'axios';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: () => '#333',
};

export default function Insights() {
  const [monthlyTotals, setMonthlyTotals] = useState<number[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<any[]>([]);
  const [remark, setRemark] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    try {
      const res = await axios.get('http://localhost:5050/api/insight/USER123'); // update port if needed
      const { monthlyTotals, categoryTotals, wittyRemark } = res.data;

      setMonthlyTotals(monthlyTotals);
      setRemark(wittyRemark);

      const formattedCategoryData = Object.keys(categoryTotals).map((category, index) => ({
        name: category,
        amount: categoryTotals[category],
        color: getColor(index),
        legendFontColor: '#333',
        legendFontSize: 15,
      }));
      setCategoryTotals(formattedCategoryData);
    } catch (err) {
      console.error('Failed to fetch insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const getColor = (index: number) => {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#F7464A'];
    return colors[index % colors.length];
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#4BC0C0" />
        <Text>Loading insights...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Expense Insights</Text>
      <Text style={styles.remark}>{remark}</Text>

      <Text style={styles.sectionTitle}>Monthly Spending</Text>
      <LineChart
        data={{
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{ data: monthlyTotals }],
        }}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
      />

      <Text style={styles.sectionTitle}>Category Breakdown</Text>
      <PieChart
        data={categoryTotals}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#2b2f28',
  },
  remark: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 12,
    color: '#2b2f28',
  },
  chart: {
    borderRadius: 8,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
