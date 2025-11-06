import { Text, View, FlatList } from 'react-native';
import { useTodos } from './providers/TodosProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from './components/CustomButton';
import React from 'react';

const ArchivedItem = ({ title }: { title: string }) => (
  <View className="p-3 border-b border-gray-200 bg-gray-100 opacity-60">
    <Text className="text-lg italic text-gray-700">{title}</Text>
  </View>
)

export default function ArchiveScreen() {
  const { todos, deleteArchivedTask } = useTodos()

  const archivedTodos = todos.filter(task => task.isArchived === true)

  const handleDeleteArchived = () => {
    deleteArchivedTask()
  }
  return (
    <SafeAreaView className="flex-1 px-4">
      <View className="py-4 mb-4 items-center">
        <Text className="text-4xl font-bold text-gray-700">Task Archive</Text>
        <Text className="text-sm text-gray-500 mt-2">
          Total Archived: {archivedTodos.length}
        </Text>
      </View>

      {/* Conditional Rendering for Empty Archive */}
      {archivedTodos.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-xl text-gray-400">The archive is empty!</Text>
        </View>
      ) : (
        // 3. Display the filtered list
        <FlatList
          data={archivedTodos} // 💡 Use the filtered list
          renderItem={({ item }) => <ArchivedItem title={item.title} />}
          keyExtractor={item => item.id}
        />
      )}

      {/* Delete Button */}
      {archivedTodos.length > 0 && (
        <View className="py-4">
          <CustomButton
            title="Permanently Delete All Archived"
            onPress={handleDeleteArchived} // 💡 Wired to the delete logic
            className="bg-red-500"
          />
        </View>
      )}
    </SafeAreaView>
  );
}
