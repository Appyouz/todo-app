import { Text, View, TextInput, BackHandler } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useTodos } from './providers/TodosProvider';
import React, { useEffect, useState } from 'react';
import CustomButton from './components/CustomButton';

const MAX_FOCUS_TIME_MINUTES = 1;

export default function FocusScreen() {
  const { id } = useLocalSearchParams();
  const { todos, completeFocusSession } = useTodos();

  const taskId = id as string;
  const task = todos.find(t => t.id === taskId);


  // Initial State Setup
  const [timeLeft, setTimeLeft] = React.useState(MAX_FOCUS_TIME_MINUTES * 60);
  const [isRunning, setIsRunning] = React.useState(true)
  const [failureReason, setFailureReason] = useState('');
  const [isFailed, setIsFailed] = useState(false);


  // Task not found
  if (!task) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Task not found!</Text>
      </View>
    );
  }



  // Function to format seconds into MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const router = useRouter();

  // Logic for navigation block
  React.useEffect(() => {
    // Function to prevent hardware back button press for (Android)
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
      // Returning true prevents the default action going back
    );
    //. Clean up event listener
    return () => backHandler.remove();
  }, [])


  // Timer logic
  React.useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      if (timeLeft <= 0) {
        console.log("Time's up! Focus session ended.");
        setIsRunning(false)
        setIsFailed(true)
      }
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isRunning])

  // Success Handler
  const handleFinishTask = () => {
    setIsRunning(false)

    // Calcuate duration
    const initialTimeSeconds = MAX_FOCUS_TIME_MINUTES * 60;
    const secondsSpent = initialTimeSeconds - timeLeft;
    const durationMs = secondsSpent * 1000;

    if (durationMs <= 0) {
      console.warn("Duration calculated as zero or negative. Using 1ms as minimum.");
      // Set a minimum duration to avoid confusion
      completeFocusSession(taskId, 1, true);
    } else {
      //  Call the provider function
      completeFocusSession(taskId, durationMs, true);
    }

    // Navigation back to the list
    router.back()
  }

  // Failure handler
  const handleGiveUp = () => {
    setIsRunning(false);

    const initialTimeSeconds = MAX_FOCUS_TIME_MINUTES * 60;
    const secondsSpent = initialTimeSeconds - timeLeft;
    const durationMs = secondsSpent * 1000;


    // Call provider function with isSuccessful: false, saving the reason
    completeFocusSession(
      taskId,
      durationMs,
      false,
      failureReason.trim().length > 0 ? failureReason.trim() : "No Reason provided (Time Expired)."
    );
    router.back();
  }

  return (
    <KeyboardAwareScrollView
      // Ensure the content always occupies the full screen height
      contentContainerStyle={{ flexGrow: 1 }}
      // Adjust behavior and scroll settings
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={100}
      // Set class name for padding/background
      className="flex-1 bg-gray-900"
    >
      <View className="flex-1 p-6 bg-gray-900 justify-around items-center">
        <Stack.Screen
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        <View className="w-full items-center">
          <Text className="text-xl text-gray-400 mb-2">Focusing On:</Text>
          <Text className="text-4xl font-bold text-white text-center">{task.title}</Text>
        </View>

        {/* Timer Display */}
        <View className={`items-center justify-center w-64 h-64 border-8 rounded-full ${isFailed ? 'border-red-500' : 'border-green-500'}`}>
          <Text className={`text-7xl font-light ${isFailed ? 'text-red-400' : 'text-green-400'}`}>
            {formatTime(timeLeft)}
          </Text>
        </View>

        {isFailed ? (
          // Show Reason input
          <View className="w-full items-center">
            <Text className="text-xl font-bold text-red-500 mb-4 text-center">Time Expired. Why couldn't you finish?</Text>

            <TextInput
              placeholder="Reason for failure (optional)"
              placeholderTextColor="gray"
              value={failureReason}
              onChangeText={setFailureReason}
              multiline
              className="border border-red-400 p-3 rounded-md w-full mb-6 bg-white text-lg h-24"
              style={{ textAlignVertical: 'top' }} // Fix for Android multiline
            />

            <CustomButton
              title="Archive Failed Task"
              onPress={handleGiveUp}
              className="bg-red-700 w-3/4"
            />
          </View>
        ) : (
          // Finish Button
          <CustomButton
            title="I Finished!"
            onPress={handleFinishTask}
            className="bg-green-600 w-3/4"
            disabled={timeLeft <= 0}
          />
        )}
      </View>

    </KeyboardAwareScrollView>
  );
}
