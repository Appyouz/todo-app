import { Text, TextInput, View, Alert } from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router';
import { useTodos } from "./providers/TodosProvider";
import CustomButton from './components/CustomButton';
import * as Haptics from 'expo-haptics';

export default function addTaskScreen() {
  const [taskTitle, setTaskTitle] = useState('')
  const { addTask } = useTodos();

  const router = useRouter()

  const handleSaveTask = () => {
    const trimmedTitle = taskTitle.trim();
    if (trimmedTitle.length > 0) {
      addTask(trimmedTitle)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back()
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "Invalid Task Title",
        "Task title cannot be empty or contain only spaces. Please enter a valid description."
      );
    }
  }

  return (
    <View className='flex-1 justify-center align-center p-4'>
      <TextInput
        placeholder='Enter your new task'
        value={taskTitle}
        onChangeText={setTaskTitle}
        className="border border-gray-400 p-3 rounded-md w-full mb-6"
        maxLength={10}
      />

      {taskTitle.length >= 10 && (
        <Text className='text-sm text-red-600 mb-4'>
          ⚠️ Maximum limit (10 characters) reached.
        </Text>
      )}

      {taskTitle.length > 0 && (
        <CustomButton
          title="Save Task"
          onPress={handleSaveTask}
          className="bg-blue-600"
        />
      )}
    </View>
  )
}


