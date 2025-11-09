import { Link, Stack, useRouter } from "expo-router";
import { TouchableOpacity, Text, View, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "./components/CustomButton";
import { useTodos } from "./providers/TodosProvider";
import React, { useState } from "react";
import * as Haptics from 'expo-haptics';

import TaskItem from "./components/TaskItem";
import NewTaskInput from "./components/NewTaskInput";

export default function Index() {
  const { todos, archiveTask, updateTask, toggleComplete, archiveCompletedTasks } = useTodos()

  // State to manage inline task adding visibility
  const [showInput, setShowInput] = useState(false);

  const activeTodos = todos.filter(task => task.isArchived === false)

  const sortedActiveTodos = activeTodos.sort((a, b) => {
    // Sort completed tasks to the bottom
    const completionDifference = (a.isCompleted ? 1 : 0) - (b.isCompleted ? 1 : 0)

    if (completionDifference !== 0) {
      return completionDifference;
    }

    // Secondary sort: ascending by ID (oldest task first)
    const aId = parseInt(a.id, 10)
    const bId = parseInt(b.id, 10)

    return aId - bId
  })

  const handleClearTask = () => {
    const completedCount = sortedActiveTodos.filter(t => t.isCompleted).length;

    if (completedCount === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Nothing to clear", "You have no completed tasks to archive.")
      return;
    }

    Alert.alert(
      "Clear Completed Tasks",
      `Move all ${completedCount} completed tasks to the Archive?`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),

        },

        {
          text: "CLEAR & ARCHIVE",
          style: "default",
          onPress: () => {
            archiveCompletedTasks();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        }
      ],
      { cancelable: true }
    )
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 px-4">

        {/* Title section */}
        <View className="py-4 mb-4 items-center">
          <Text className="text-5xl text-primary font-bold">Todo App</Text>
        </View>

        {/* Task List Header*/}
        <Text className="text-3xl p-5"> Tasks: </Text>

        {/* Modularized New Task Input */}
        <NewTaskInput showInput={showInput} setShowInput={setShowInput} />

        <FlatList
          data={sortedActiveTodos}
          renderItem={({ item }) => (
            <TaskItem
              id={item.id}
              title={item.title}
              isCompleted={item.isCompleted}
              lastDurationMs={item.lastDurationMs}
              archiveTask={archiveTask}
              updateTask={updateTask}
              toggleComplete={toggleComplete}
            />
          )}
          keyExtractor={item => item.id}
          extraData={todos}
        />

        <View className="flex-row py-4 mb-4 justify-around">

          {/* Add Button toggles visibility of NewTaskInput */}
          <CustomButton
            title={showInput ? "Cancel Add" : "Add Task"}
            onPress={() => {
              // Toggle input visibility, logic for clearing input is now inside NewTaskInput
              setShowInput(!showInput);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }}
            className={showInput ? "bg-red-600" : "bg-green-400"}
          />

          <Link
            href="/archive"
            asChild
          >
            <CustomButton
              title="Archive"
              className="bg-yellow-500"
            />
          </Link>

          <CustomButton
            title="Clear"
            onPress={handleClearTask}
            className="bg-red-600"
          />
        </View>
      </SafeAreaView >
    </>
  );
}
