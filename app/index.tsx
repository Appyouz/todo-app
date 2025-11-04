import { Link, Stack } from "expo-router";
import { TouchableOpacity, Text, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "./components/CustomButton";
import { useTodos } from "./providers/TodosProvider";

type ItemProps = {
  title: string
}

const Item = ({ title }: ItemProps) => (
  <View className="p-1 border-b border-gray-200">
    <Text className="text-lg">{title}</Text>
  </View>
);

export default function Index() {
  const { todos, addTask, deleteTask, updateTask, clearTodos } = useTodos()
  const handleAddTask = () => {
    addTask("New task")
  }

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
          data={todos}
          renderItem={({ item }) => <Item title={item.title} />}
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
          <CustomButton
            title="Clear"
            onPress={handleClearTask}
            className="bg-red-300"
          />
        </View>
      </SafeAreaView>
    </>
  );
}
