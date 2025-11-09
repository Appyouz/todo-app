import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTodos } from '../providers/TodosProvider';

const CHAR_LIMIT = 20;

type NewTaskInputProps = {
  showInput: boolean;
  setShowInput: (show: boolean) => void;
};

export default function NewTaskInput({ showInput, setShowInput }: NewTaskInputProps) {
  const { addTask } = useTodos();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleSaveNewTask = () => {
    const trimmedTitle = newTaskTitle.trim();
    if (trimmedTitle.length > 0) {
      addTask(trimmedTitle);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setNewTaskTitle(''); // Clear input
      setShowInput(false); // Hide input
      Keyboard.dismiss();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "Invalid Task Title",
        "Task title cannot be empty or contain only spaces. Please enter a valid description."
      );
    }
  };

  if (!showInput) return null;

  return (
    <View className="px-4 pt-2 pb-4">
      <View className="flex-row items-center">
        <TextInput
          placeholder={`Enter new task (max ${CHAR_LIMIT} chars)`}
          value={newTaskTitle}
          // Strict state control with slice and native limit
          onChangeText={(text) => setNewTaskTitle(text.slice(0, CHAR_LIMIT))}
          onSubmitEditing={handleSaveNewTask}
          autoFocus
          maxLength={CHAR_LIMIT}
          className="flex-1 text-lg border border-gray-400 p-3 rounded-md mr-3"
        />
        <TouchableOpacity
          onPress={handleSaveNewTask}
          className={`p-2 rounded-full ${newTaskTitle.trim().length > 0 ? 'bg-green-600' : 'bg-gray-400'}`}
          disabled={newTaskTitle.trim().length === 0}
        >
          <Ionicons name="checkmark-circle-sharp" size={32} color="white" />
        </TouchableOpacity>
      </View>

      {/* Character Limit Warning */}
      {newTaskTitle.length >= CHAR_LIMIT && (
        <View className="flex-row items-center mt-2 ml-1">
          <Ionicons name="warning" size={16} color="#ef4444" />
          <Text className='text-sm text-red-500 ml-1'>
            Maximum limit ({CHAR_LIMIT} characters) reached.
          </Text>
        </View>
      )}
    </View>
  );
}
