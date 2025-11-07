import { Link, Stack } from "expo-router";
import { TouchableOpacity, Text, View, FlatList, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "./components/CustomButton";
import { useTodos } from "./providers/TodosProvider";
import React, { useState } from "react";
import { Ionicons } from '@expo/vector-icons'


import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';



type ItemProps = {
  id: string;
  title: string
  isCompleted: boolean,
}

type ItemFunctionProps = {
  archiveTask: (id: string) => void;
  updateTask: (id: string, newTitle: string) => void;
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

const Item = ({ id, title, isCompleted, archiveTask, updateTask }: ItemProps & ItemFunctionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const handleSaveEdit = () => {
    const trimmedTitle = editTitle.trim();
    if (trimmedTitle.length > 0 && trimmedTitle !== title) {
      updateTask(id, trimmedTitle)
    }
    setIsEditing(false)
  }

  return (
    < ReanimatedSwipeable
      renderRightActions={() => renderRightActions(id, archiveTask)}
    >
      <View className="flex-row items-center p-3 border-b border-gray-200 justify-between">
        {isEditing ?
          <>
            <TextInput
              value={editTitle}
              onChangeText={setEditTitle}
              onBlur={handleSaveEdit}
              onSubmitEditing={handleSaveEdit}
              autoFocus
              maxLength={10}
              className="flex-1 text-lg border border-blue-400 p-1 rounded mr-3"
            />
            <TouchableOpacity
              onPress={handleSaveEdit}
              className="p-1 rounded-full bg-green-500"
            >
              <Ionicons name="checkmark-circle-sharp" size={24} color="white" />
            </TouchableOpacity>
          </>
          : (
            <>
              {/*Strikethrough*/}

              <Text className={`text-lg flex-1 ${isCompleted ? 'line-through text-gray-500 italic' : ''}`}>
                {title}
              </Text>

              {/*Edit Button*/}
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                className="ml-4 p-1 rounded-full bg-gray-200"
              >
                <Ionicons name="create-outline" size={20} color="gray" />
              </TouchableOpacity>
            </>
          )
        }
      </View>

      {/* <View className="p-1 border-b border-gray-200"> */}
    </ReanimatedSwipeable >
  );
};

export default function Index() {
  const { todos, archiveTask, deleteArchivedTask, updateTask, clearTodos, toggleComplete } = useTodos()

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
            isCompleted={item.isCompleted}
            archiveTask={archiveTask}
            updateTask={updateTask}
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
