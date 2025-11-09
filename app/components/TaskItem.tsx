import { useState } from 'react';
import { TouchableOpacity, Text, View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import * as Haptics from 'expo-haptics';
import { formatDuration } from '../lib/utils';

const CHAR_LIMIT = 45;

type ItemProps = {
  id: string;
  title: string;
  isCompleted: boolean;
  lastDurationMs: number | null;
  archiveTask: (id: string) => void;
  updateTask: (id: string, newTitle: string) => void;
  toggleComplete: (id: string) => void;
}

// Swipe Action Renderer 
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


// TaskItem Component 
export default function TaskItem({ id, title, isCompleted, lastDurationMs, archiveTask, updateTask, toggleComplete }: ItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const router = useRouter();

  const handleSaveEdit = () => {
    const trimmedTitle = editTitle.trim();
    if (trimmedTitle.length > 0 && trimmedTitle !== title) {
      updateTask(id, trimmedTitle);
    }
    setIsEditing(false);
  };

  const handleStartFocus = () => {
    if (!isCompleted) {
      router.push({
        pathname: "/focus",
        params: { id: id },
      });
    }
  };

  const handleToggleComplete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleComplete(id);
  }


  return (
    <ReanimatedSwipeable
      renderRightActions={() => renderRightActions(id, archiveTask)}
    >
      <View className="flex-row items-center p-3 border-b border-gray-200 justify-between">

        {/* Toggle complete */}
        <TouchableOpacity
          onPress={handleToggleComplete}
          className="mr-3"
          disabled={isEditing}
        >
          <Ionicons
            name={isCompleted ? "checkmark-circle" : "ellipse-outline"}
            size={24}
            color={isCompleted ? "green" : "gray"}
          />
        </TouchableOpacity>

        {isEditing ? (
          /* Editing mode */
          <>
            <View className="flex-1">
              <TextInput
                value={editTitle}
                onChangeText={(text) => setEditTitle(text.slice(0, CHAR_LIMIT))}
                onBlur={handleSaveEdit}
                onSubmitEditing={handleSaveEdit}
                autoFocus
                maxLength={CHAR_LIMIT}
                className="text-lg border border-blue-400 p-1 rounded mr-3"
              />

              {/* Inline Edit Character Warning */}
              {editTitle.length >= CHAR_LIMIT && (
                <View className="flex-row items-center mt-1 ml-1">
                  <Ionicons name="warning" size={14} color="#ef4444" />
                  <Text className='text-xs text-red-500 ml-1'>
                    Max limit ({CHAR_LIMIT} chars) reached.
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={handleSaveEdit}
              className="p-1 rounded-full bg-green-500"
            >
              <Ionicons name="checkmark-circle-sharp" size={24} color="white" />
            </TouchableOpacity>
          </>
        ) : (
          /* Display Mode */
          <>
            <TouchableOpacity
              onPress={handleStartFocus}
              className="flex-1 py-1"
              activeOpacity={0.7}
            >
              <Text className={`text-lg ${isCompleted ? 'line-through text-gray-500 italic' : ''}`}>
                {title}
              </Text>
              {isCompleted && lastDurationMs !== null && (
                <Text className="text-sm text-green-600 mt-0.5">
                  {formatDuration(lastDurationMs)}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setEditTitle(title);
                setIsEditing(true);
              }}
              className="ml-4 p-1 rounded-full bg-gray-200"
            >
              <Ionicons name="create-outline" size={20} color="gray" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </ReanimatedSwipeable>
  );
}
