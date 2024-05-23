import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Dimensions,
  Pressable,
} from "react-native";
import { Card, Text } from "react-native-paper";
import Stars from "./Stars";

const data = [
  {
    id: "1",
    title: "Card Title 1",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    title: "Card Title 2",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "3",
    title: "Card Title 3",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "4",
    title: "Card Title 3",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "5",
    title: "Card Title 3",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "6",
    title: "Card Title 3",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "7",
    title: "Card Title 7",
    image: "https://via.placeholder.com/150",
  },
  // Add more items as needed
];

const numColumns = 2; // Adjust this number to change the number of columns

const BoardingList = ({ boarding }) => {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Pressable
        onPress={() =>
          router.push({
            pathname: `boardingscreen/${item.id}`,
            params: { id: item.id, rating: item.ratings },
          })
        }
      >
        <Card style={styles.card}>
          <Card.Cover
            source={{ uri: item.images[0] }}
            style={styles.cardCover}
          />
          <Card.Content>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Stars ratingArray={item.ratings} size={12} />
          </Card.Content>
        </Card>
      </Pressable>
    </View>
  );

  return (
    <FlatList
      data={boarding}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      numColumns={numColumns}
    />
  );
};

const { width } = Dimensions.get("window");
const cardWidth = (width - 32) / numColumns - 16;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  item: {
    flex: 1,
    margin: 8,
  },
  card: {
    width: cardWidth,
    height: "auto",
  },
  cardCover: {
    height: 120, // Adjust the height of the image here
  },
  title: {
    fontSize: 14,
    color: "#422F29",
  },
});

export default BoardingList;
