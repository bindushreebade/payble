import { useState, useEffect } from 'react';

const useVoiceRecognition = () => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isListening) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in your browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setText(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setError(`Error: ${event.error}`);
      stopListening();
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      }
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  const startListening = () => {
    setError(null);
    setIsListening(true);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const resetTranscript = () => {
    setText('');
  };

  return {
    text,
    isListening,
    error,
    startListening,
    stopListening,
    resetTranscript,
    setText
  };
};

export default useVoiceRecognition;