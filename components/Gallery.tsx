import { View, FlatList, Image, useWindowDimensions, StyleSheet } from "react-native";

const images = Array.from({ length: 20 }).map((_, i) => ({
  id: i.toString(),
  uri: `https://picsum.photos/400/300?random=${i}`
}));

export default function Gallery() {
  const { width } = useWindowDimensions();

  const getColumns = () => {
    if (width < 375) return 2;
    if (width <= 768) return 3;
    return 4;
  };

  const columns = getColumns();
  const spacing = 10;
  const itemWidth = (width - spacing * (columns + 1)) / columns;

  return (
    <FlatList
      data={images}
      key={columns}
      numColumns={columns}
      contentContainerStyle={{ padding: spacing }}
      renderItem={({ item }) => (
        <View style={{ margin: spacing / 2 }}>
          <Image
            source={{ uri: item.uri }}
            style={{ width: itemWidth, height: itemWidth * 0.75, borderRadius: 10 }}
          />
        </View>
      )}
    />
  );
}