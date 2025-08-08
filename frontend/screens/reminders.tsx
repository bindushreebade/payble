import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TextInput, 
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';


const Reminders = () => {
  const [savedReminders, setSavedReminders] = useState<string[]>([]);
  const [parsedReminders, setParsedReminders] = useState<{ task: string; date: string }[]>([]);
  const [reminderText, setReminderText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [liveTranscript, setLiveTranscript] = useState('');

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join(' ');
          setReminderText(transcript);
          setLiveTranscript(transcript);
        };

        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          Alert.alert('Error', 'Could not process voice input');
        };

        setRecognition(recognitionInstance);
      } else {
        Alert.alert('Warning', 'Your browser does not support speech recognition');
      }
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setReminderText('');
      setLiveTranscript('');
      recognition.start();
      setIsListening(true);
    }
  };

  const parseReminder = (text: string) => {
    const dateRegex = /\b(\d{1,2}(st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\b/i;
    const match = text.match(dateRegex);
    const date = match ? match[0] : 'No date specified';

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

  const sendReminderToBackend = async (text: string) => {
    try {
      // Parse task and date from user input
      const parsed = parseReminder(text);

      // Send to backend
      const response = await fetch('http://192.168.1.5:5000/api/reminders', {
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

      if (!response.ok) {
        throw new Error(`Failed to save reminder. Status: ${response.status}`);
      }

      console.log('✅ Reminder saved to backend');
    } catch (error) {
      console.error('❌ Error saving reminder:', error);
    }
  };


  const handleSaveReminder = async () => {
    if (reminderText.trim()) {
      const newText = reminderText.trim();
      const parsed = parseReminder(newText);
      
      // Update local state
      setSavedReminders([...savedReminders, newText]);
      setParsedReminders([parsed, ...parsedReminders].slice(0, 5));
      
      // Send to backend
      await sendReminderToBackend(newText);
      
      // Reset states
      setReminderText('');
      setLiveTranscript('');
      if (isListening) {
        recognition.stop();
        setIsListening(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <MotiView
        style={styles.header}
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 100, type: 'timing', duration: 500 }}
      >
        <Image
          source={require('../assets/images/clock.png')}
          style={styles.icon}
        />
        <Text style={styles.title}>Reminders</Text>
      </MotiView>

      <View style={styles.mainLayout}>
        <View style={styles.chatColumn}>
          <ScrollView style={styles.chatBox}>
            <AnimatePresence>
          {isListening && liveTranscript && (
            <MotiView
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={styles.speechBubble}
            >
            <Text style={styles.speechText}>{liveTranscript}</Text>
              </MotiView>
            )}

      {savedReminders.map((msg, idx) => (
        <MotiView
          key={idx}
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ delay: idx * 100 }}
          style={styles.speechBubble}
        >
          <Text style={styles.speechText}>{msg}</Text>
        </MotiView>
      ))}
    </AnimatePresence>

          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Type or speak your reminder..."
              value={reminderText}
              onChangeText={setReminderText}
              style={styles.input}
              placeholderTextColor="#777"
              multiline
            />
            <TouchableOpacity 
              style={[styles.voiceButton, isListening && styles.voiceButtonActive]} 
              onPress={toggleListening}
            >
              <Ionicons 
                name={isListening ? 'mic' : 'mic-outline'} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleSaveReminder}
            >
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
          </View>

          <MotiView
            style={styles.recentReminders}
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 600 }}
          >
            <Text style={styles.sectionTitle}>Your Recent Reminders</Text>
            {parsedReminders.length > 0 ? (
              parsedReminders.map((item, index) => (
                <View key={index} style={styles.reminderItem}>
                  <Text style={styles.reminderTask}> - {item.task}</Text>
                  <Text style={styles.reminderDate}>{item.date}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noRemindersText}>No reminders yet</Text>
            )}
          </MotiView>
        </View>

        <View style={styles.instructionsColumn}>
          <Text style={styles.instructionsTitle}>🧠 Smart Reminder Guide</Text>

          <MotiView
            style={styles.instructionItem}
            from={{ opacity: 0, translateX: -10 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 300}}
          >
            <Ionicons name="mic-outline" size={20} color="#3a2e2e" />
            <Text style={styles.instructionText}>
              Tap the mic and say your reminder naturally — like you're texting a friend.
            </Text>
          </MotiView>

          <MotiView
            style={styles.instructionItem}
            from={{ opacity: 0, translateX: -10 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 300}} 
          >
            <Ionicons name="bulb-outline" size={20} color="#3a2e2e" />
            <Text style={styles.instructionText}>
              Try: "Remind me to submit the assignment on Friday"
            </Text>
          </MotiView>

          <MotiView
            style={styles.instructionItem}
            from={{ opacity: 0, translateX: -10 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 300 }} 
          >
            <Ionicons name="calendar-outline" size={20} color="#3a2e2e" />
            <Text style={styles.instructionText}>
              Dates and tasks are detected automatically with AI.
            </Text>
          </MotiView>

          <MotiView
            style={styles.tipBox}
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 1000, type: 'spring' }}
          >
            <Text style={styles.tipTitle}>🎯 Pro Tip</Text>
            <Text style={styles.tipText}>
              For best results, speak clearly and include both the task and the date.
            </Text>
          </MotiView>

        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#76ce91ff',
    fontWeight: 'bold',
    
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    fontFamily: 'Baloo',
  },
  icon: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#323c2bff',
    fontFamily: 'Baloo',
  },
  mainLayout: {
    flexDirection: 'row',
    flex: 1,
  },
  chatColumn: {
    flex: 2,
    marginRight: 10,
  },
  instructionsColumn: {
    flex: 1,
    backgroundColor: '#39a646ff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#142814ff',
    fontFamily: 'Baloo',
  },
  chatBox: {
    flex: 1,
    backgroundColor: '#d8d1bfff',
    borderRadius: 10,
    padding: 10,
    borderWidth: 3,
    borderColor: '#142814ff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    fontFamily: 'Baloo',
  },
  input: {
    flex: 1,
    backgroundColor: '#deffe4ff',
    borderRadius: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#1b321fff',
    minHeight: 40,
    textAlignVertical: 'center',
    fontFamily: 'Baloo',
  },
  voiceButton: {
    backgroundColor: '#37681cff',
    padding: 10,
    borderRadius: 50,
    marginLeft: 5,
    borderColor:'#0e331cff',
    borderWidth: 3
  },
  voiceButtonActive: {
    backgroundColor: '#ec3a3aff',
    borderWidth: 3,
    borderColor: '#820f09ff'
  },
  button: {
    backgroundColor: '#37681cff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 50,
    marginLeft: 5,
    borderWidth: 3,
    borderColor: '#0e331cff'
  },
  buttonText: {
    color: '#FAF9EE',
    fontWeight: 'bold',
  },
  speechBubble: {
    backgroundColor: '#48924eff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
    fontFamily: 'Baloo',
  },
  speechText: {
    color: '#333',
    fontFamily: 'Baloo',
  },
  listeningText: {
    fontStyle: 'italic',
    color: '#ff6b6b',
    marginBottom: 5,
    fontFamily: 'Baloo',
  },
  recentReminders: {
    marginTop: 10,
    backgroundColor: '#39a646ff',
    padding: 10,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#133316ff',
    fontFamily: 'Baloo',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Baloo',
  },
  reminderItem: {
    marginBottom: 5,
  },
  reminderTask: {
    fontSize: 15,
  },
  reminderDate: {
    fontSize: 14,
    fontStyle: 'italic',
    fontFamily: 'Baloo',
    marginLeft: 10,
  },
  noRemindersText: {
    fontStyle: 'italic',
    fontFamily: 'Baloo',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Baloo',
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  instructionText: {
    marginLeft: 5,
    fontSize: 14,
    fontFamily: 'Baloo',
  },
  tipBox: {
    backgroundColor: '#e0ffe7ff',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  tipTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Baloo',
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Baloo',
  },
});

export default Reminders;
