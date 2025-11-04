import { Stack } from "expo-router";
import './globals.css'
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TodosProvider } from './providers/TodosProvider';
export default function RootLayout() {
  return (

    <SafeAreaProvider>
      <TodosProvider>
        <Stack
          screenOptions={{ keepScreenOn: false }}
        />
      </TodosProvider>
    </SafeAreaProvider>

  )
}
