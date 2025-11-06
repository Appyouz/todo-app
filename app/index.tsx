import { Link, Stack } from "expo-router";
import { TouchableOpacity, Text, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "./components/CustomButton";
import { useTodos } from "./providers/TodosProvider";
import React from "react";

import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';



type ItemProps = {
  id: string;
  title: string
}

const renderRightActions = (id: string, archiveTask: (id: string) => void) => {
  return (
    <TouchableOpacity
      onPress={() => archiveTask(id)}
      className="bg-orange-500 justify-center items-center w-24 h-full"
    >
      <Text className="text-white font-bold">Archive</Text>
    </TouchableOpacity>
  );
};

const Item = ({ id, title, archiveTask }: ItemProps & { archiveTask: (id: string) => void }) => (
  <ReanimatedSwipeable
    renderRightActions={() => renderRightActions(id, archiveTask)}
  >
    <Link
      href={{ pathname: "/edit", params: { id: id } }}
      asChild
    >
      {/* <View className="p-1 border-b border-gray-200"> */}
      <TouchableOpacity className="p-3 border-b border-gray-200">
        <Text className="text-lg">{title}</Text>
      </TouchableOpacity>
    </Link>
  </ReanimatedSwipeable>
);

export default function Index() {
  const { todos, archiveTask, deleteArchivedTask, updateTask, clearTodos } = useTodos()

  const handleClearTask = () => {
    clearTodos()
  }
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 px-4">

        {/* Title section */}
        <View className="py-4 mb-4 items-center">
          <Text className="text-5xl text-primary font-bold">Todo App</Text>
        </View>

        {/* Task section*/}
        <Text className="text-3xl p-5"> Tasks: </Text>
        <FlatList
          data={todos.filter(task => task.isArchived === false)}
          renderItem={({ item }) => <Item id={item.id}
            title={item.title}
            archiveTask={archiveTask}
          />}
          keyExtractor={item => item.id}
          extraData={todos}
        />

        <View className="flex-row py-4 mb-4 justify-around">
          <Link
            href="/add"
            asChild>
            <CustomButton
              title="Add"
              // onPress={handleAddTask}
              className="bg-green-50"
            />
          </Link>

          <Link
            href="/archive"
            asChild
          >
            <CustomButton
              title="Archive"
              className="bg-yellow-200"
            />
          </Link>

          <CustomButton
            title="Clear"
            onPress={handleClearTask}
            className="bg-red-300"
          />
        </View>
      </SafeAreaView >
    </>
  );
}
