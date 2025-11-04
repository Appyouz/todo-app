import { TouchableOpacity, Text } from 'react-native'

type ButtonProps = {
  title: string;
  onPress: () => void;
  // Optional prop to control styling, using Native wind classes
  className?: string;
}


const CustomButton = ({ title, onPress, className }: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`p-3 rounded-lg ${className ? className : 'bg-blue-50'}`}
    >
      <Text className="text-2xl text-yellow-600">{title}</Text>
    </TouchableOpacity >
  )
}

export default CustomButton

