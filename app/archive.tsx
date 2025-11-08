import { Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useTodos } from './providers/TodosProvider';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from './components/CustomButton';
import React from 'react';
import { formatDuration } from './lib/utils';
import * as Haptics from 'expo-haptics'


// Type Definition for the data display
type ArchivedItemProps = {
  id: string;
  title: string;
  isCompleted: boolean;
  lastDurationMs: number | null;
  failureReason: string | null;
  deleteTask: (id: string) => void;
  restoreTask: (id: string) => void;
};

// ArchivedItem component to display all tracking data and buttons
const ArchivedItem = ({ id, title, isCompleted, lastDurationMs, failureReason, deleteTask, restoreTask }: ArchivedItemProps) => {
  return (
    <View className="p-4 border border-gray-700 bg-gray-800 mb-4 rounded-lg shadow-md">

      {/* Title and Action Buttons */}
      <View className="flex-row justify-between items-start mb-3">
        <Text className={`flex-1 text-xl font-bold ${isCompleted ? 'text-green-300' : 'text-red-300'}`}>
          {title}
        </Text>

        <View className="flex-row space-x-2 ml-4">
          {/* Restore Button (for Failed tasks) */}
          {!isCompleted && (
            <TouchableOpacity onPress={() => restoreTask(id)} className="p-2 bg-blue-600 rounded-md">
              <Ionicons name="repeat-outline" size={20} color="white" />
            </TouchableOpacity>
          )}

          {/* Delete Button */}
          <TouchableOpacity onPress={() => deleteTask(id)} className="p-2 bg-red-600 rounded-md">
            <Ionicons name="trash-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Status and Duration Row */}
      <View className="flex-row justify-start items-center space-x-4 mb-2">
        <Text className={`text-sm font-semibold ${isCompleted ? 'text-green-400' : 'text-red-400'}`}>
          <Ionicons name={isCompleted ? "checkmark-circle" : "close-circle"} size={16} />
          {' '}
          {isCompleted ? 'Completed' : 'Failed Focus'}
        </Text>

        {lastDurationMs !== null && lastDurationMs > 0 && (
          <Text className="text-sm text-gray-400">
            <Ionicons name="time-outline" size={14} color="gray" /> {formatDuration(lastDurationMs)}
          </Text>
        )}
      </View>

      {/* Failure Reason Display (Only for failed tasks) */}
      {!isCompleted && failureReason && (
        <View className="mt-2 p-3 border-l-4 border-red-500 bg-gray-700 rounded-sm">
          <Text className="text-sm font-bold text-gray-300 mb-1">Reason for Failure:</Text>
          <Text className="text-sm text-gray-200 italic">{failureReason}</Text>
        </View>
      )}

    </View>
  );
};


export default function ArchiveScreen() {
  // Destructure the new restoreTask function here
  const { todos, deleteArchivedTaskById, deleteAllArchivedTask, restoreTask } = useTodos();
  const archivedTodos = todos.filter(task => task.isArchived);

  // Function to delete ALL archived tasks
  const handleDeleteAllArchived = () => {
    Alert.alert(
      "Confirm Permanent Detection",
      "Are you absolutely sure you want to Permanently delete All archived tasks? This action cannot be undone.",
      [
        // Option 1: For cancel
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),

        },
        // Option 2 Delete
        {
          text: "DELETE ALL",
          style: "destructive",
          onPress: () => {
            deleteAllArchivedTask()
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
          }
        },
      ],
      { cancelable: true }
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Set Stack options to style the header, if needed */}
      <Stack.Screen options={{ title: 'Task Archive', headerTitleStyle: { color: 'white' }, headerStyle: { backgroundColor: '#1f2937' } }} />

      <View className="py-4 px-4 mb-4 items-center">
        <Text className="text-4xl font-bold text-white">Task Archive</Text>
        <Text className="text-sm text-gray-400 mt-2">
          Total Archived: {archivedTodos.length}
        </Text>
      </View>

      <View className="flex-1 px-4">
        {/* Conditional Rendering for Empty Archive */}
        {archivedTodos.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-xl text-gray-500">The archive is empty!</Text>
          </View>
        ) : (
          <FlatList
            data={archivedTodos}
            renderItem={({ item }) => (
              <ArchivedItem
                id={item.id}
                title={item.title}
                isCompleted={item.isCompleted}
                lastDurationMs={item.lastDurationMs}
                failureReason={item.failureReason}
                deleteTask={() => deleteArchivedTaskById(item.id)}
                restoreTask={restoreTask}
              />
            )}
            keyExtractor={item => item.id}
          />
        )}
      </View>

      {/* Delete All Button (remains at the bottom) */}
      {archivedTodos.length > 0 && (
        <View className="py-4 px-4">
          <CustomButton
            title="Permanently Delete All Archived"
            onPress={handleDeleteAllArchived}
            className="bg-red-500"
          />
        </View>
      )}
    </SafeAreaView>
  );
}
