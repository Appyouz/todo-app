import { Text, TextInput, View } from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router';
import { useTodos } from "./providers/TodosProvider";
import CustomButton from './components/CustomButton';

export default function addTaskScreen() {
  const [taskTitle, setTaskTitle] = useState('')
  const { addTask } = useTodos();

  const router = useRouter()

  const handleSaveTask = () => {
    if (taskTitle.trim().length > 0) {
      addTask(taskTitle)
      router.back()
    }
  }

  return (
    <View className='flex-1 justify-center align-center'>
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


