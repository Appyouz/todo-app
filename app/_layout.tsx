import { Stack } from "expo-router";
import './globals.css'
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TodosProvider } from './providers/TodosProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <TodosProvider>
          <Stack
            screenOptions={{ keepScreenOn: false }}
          />
        </TodosProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>

  )
}
