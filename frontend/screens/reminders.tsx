// Reminders.tsx
import React, { useState } from 'react';
import { Ionicons, FontAwesome, Feather } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from 'react-native';

const sendReminderToBackend = async (text: string, parsed: { task: string; date: string }) => {
  try {
    const response = await fetch('http://192.168.1.5/api/reminders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        original: text,
        task: parsed.task,
        date: parsed.date,
      }),
    });

    if (!response.ok) throw new Error('Failed to save reminder');

    console.log('Reminder saved to backend');
  } catch (error) {
    console.error('Error saving reminder:', error);
  }
};

const Reminders = () => {
  const [reminderText, setReminderText] = useState('');
  const [savedReminders, setSavedReminders] = useState<string[]>([]);
  const [parsedReminders, setParsedReminders] = useState<{ task: string; date: string }[]>([]);

  const handleSaveReminder = async () => {
    if (reminderText.trim()) {
      const newText = reminderText.trim();
      setSavedReminders([...savedReminders, newText]);

      const parsed = parseReminder(newText);
      setParsedReminders((prev) => {
        const updated = [parsed, ...prev];
        return updated.slice(0, 5); // Keep only latest 5
      });

      setReminderText('');

      // Send to backend
      await sendReminderToBackend(newText, parsed);
    }
  };


  // Basic simulated parser
  const parseReminder = (text: string) => {
    const dateRegex = /\b(\d{1,2}(st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December))\b/i;
    const match = text.match(dateRegex);
    const date = match ? match[0] : 'Unknown date';

    // Remove parts like "Remind me to", "on <date>"
    const cleaned = text
      .replace(/remind me to/i, '')
      .replace(/please/i, '')
      .replace(dateRegex, '')
      .replace(/(about|of|on)/gi, '')
      .trim();

    return {
      task: cleaned || 'Unknown task',
      date,
    };
  };

  return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('../assets/images/clock.png')}
            style={styles.icon}
          />
          <Text style={styles.title}>Reminders</Text>
        </View>

        <Text style={styles.description}>
          Reminders help you stay on track with your goals, bills, payments, or tasks.
          This space can be used to set up smart reminders based on your conversations or planned activities.
        </Text>

        <View style={styles.layout}>
          {/* Chat Box */}
          <View style={styles.chatBox}>
            {/* List of saved reminders */}
            {savedReminders.map((item, index) => (
              <Text key={index} style={styles.chatBubble}>
                {item}
              </Text>
            ))}

            {/* Input area */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Type your reminder here..."
                value={reminderText}
                onChangeText={setReminderText}
                style={styles.input}
                placeholderTextColor="#777"
              />
              <TouchableOpacity style={styles.button} onPress={handleSaveReminder}>
                <Text style={styles.buttonText}>Send</Text>
              </TouchableOpacity>
            </View>

            {/* Structured AI Summary */}
            {parsedReminders.length > 0 && (
              <View style={styles.aiSummaryBox}>
                <Text style={styles.summaryHeader}>Recent Reminders</Text>
                {parsedReminders.map((item, index) => (
                  <Text key={index} style={styles.summaryItem}>
                    • {item.task} – {item.date}
                  </Text>
                ))}
              </View>
            )}
          </View>

          {/* Reminder Info */}
          <View style={styles.sidePanel}>
            <Text style={styles.sideTitle}>Reminder Info</Text>
            <Text style={styles.sideText}>
              Our app uses AI-powered voice agents to make setting reminders effortless.
              Just speak to the app — say something like “Remind me to pay my credit card bill on the 10th,”
              and the AI takes care of the rest.{"\n\n"}
              Whether it's your monthly rent, subscription renewals, or loan EMIs,
              our AI ensures you're reminded just when you need it — no more stress, no more late fees.
            </Text>
          </View>
        </View>
      </ScrollView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    backgroundColor:'#d7f4e1ff',
    
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    width: 60,
    height: 60,
    marginRight: 10,
    color:"black",
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#3a2e2e',
    paddingLeft: 3,
    fontFamily: 'Baloo',
  },
  description: {
    fontSize: 17,
    color: '#333',
    marginBottom: 25,
    fontFamily: 'Baloo',
  },
  layout: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'space-between',
  },
  chatBox: {
    backgroundColor: '#98c0a2ff',
    borderRadius: 10,
    padding: 20,
    flex: 3,
    minHeight: 300,
    justifyContent: 'space-between',
    elevation: 3,
  },
  chatBubble: {
    backgroundColor: '#5b7d42ff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
    maxWidth: '80%',
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    fontFamily: 'Baloo',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    fontSize: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontFamily: 'Baloo',
  },
  button: {
    backgroundColor: '#25D366',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'Baloo',
  },
  aiSummaryBox: {
    marginTop: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontFamily: 'Baloo',
  },
  summaryHeader: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444',
    fontSize: 16,
    fontFamily: 'Baloo',
  },
  summaryItem: {
    fontSize: 15,
    color: '#222',
    marginBottom: 5,
  },
  sidePanel: {
    backgroundColor: '#81cfa0ff',
    borderRadius: 10,
    padding: 20,
    flex: 2,
    minHeight: 300,
    elevation: 3,
  },
  sideTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 12,
    color: '#333',
    fontFamily: 'Baloo',
  },
  sideText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    fontFamily: 'Baloo',
  },
});

export default Reminders;
