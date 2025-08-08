import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SpreadMeter({ spreadColor }: { spreadColor: "green" | "yellow" | "red" }) {
  return (
    <View style={[styles.meter, { backgroundColor: spreadColor }]}>
      <Text style={styles.text}>
        {spreadColor === "green" ? "Evenly spread" : spreadColor === "yellow" ? "Moderate spread" : "Clumped"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  meter: { padding: 10, borderRadius: 10, marginVertical: 10 },
  text: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
});
