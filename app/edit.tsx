import { Text, View, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTodos } from "./providers/TodosProvider";
import { useState } from 'react';
import CustomButton from './components/CustomButton';

export default function EditTaskScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { todos, updateTask } = useTodos(); // 💡 Get updateTask from hook

  const taskToEdit = todos.find(task => task.id === id);

  // Guard clause: If for some reason the task isn't found
  if (!taskToEdit) {
    return <Text>Task not found!</Text>;
  }

  const [newTitle, setNewTitle] = useState(taskToEdit.title);

  // Save Handler Implementation
  const handleUpdateTask = () => {
    const trimmedTitle = newTitle.trim();

    // 1. Validation: Ensure the new title is not empty
    if (trimmedTitle.length === 0) {
      console.warn("Task title cannot be empty.");
      return;
    }

    // 2. Call the global update function with the ID and the new title
    updateTask(id as string, trimmedTitle);

    router.back();
  };

  return (
    <View className='flex-1 justify-center p-4'>
      <Text className="text-xl font-bold mb-8 text-center">Editing Task</Text>

      <TextInput
        placeholder="Enter new title"
        value={newTitle}
        onChangeText={setNewTitle}
        maxLength={10}
        className="border border-gray-400 p-3 rounded-md w-full mb-2 text-lg"
      />

      <Text className="text-right text-xs text-gray-500 mb-6">
        {newTitle.length} / 10
      </Text>
      {newTitle.length >= 10 && (
        <Text className="text-sm text-red-600 mb-4">
          ⚠️ Maximum limit (10 characters) reached.
        </Text>
      )}

      {newTitle.trim().length > 0 && (
        <CustomButton
          title="Save Changes"
          onPress={handleUpdateTask}
          className="bg-blue-600"
        />
      )}
    </View>
  );
}
