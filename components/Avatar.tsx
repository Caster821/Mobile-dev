import { Image, ImageSourcePropType, StyleSheet } from 'react-native';

interface Props{
    source:ImageSourcePropType;
    size?:number;
}
function Avatar({source, size = 50}:Props) {
  return (
    <Image
      source={source} width={size} height={size} borderRadius={size/2}
      />
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderWidth: 2,
    borderColor: '#000000',
    marginBottom: 15
  },
});

export default Avatar;
