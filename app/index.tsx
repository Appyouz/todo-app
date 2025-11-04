import { Stack } from "expo-router";
import { Text, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

type ItemProps = {
  title: string
}

const Item = ({ title }: ItemProps) => (
  <View className="p-1 border-b border-gray-200">
    <Text className="text-lg">{title}</Text>
  </View>
);

export default function Index() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 px-4">
        <View className="py-4 mb-4 items-center">
          <Text className="text-5xl text-primary font-bold">Todo App</Text>
        </View>
        <FlatList
          data={DATA}
          renderItem={({ item }) => <Item title={item.title} />}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    </>
  );
}
