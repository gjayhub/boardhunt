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

const numColumns = 2; // Adjust this number to change the number of columns

const BoardingList = ({ boarding }) => {
  // Calculate the total number of cells needed including placeholders
  const totalCells = Math.ceil(boarding.length / numColumns) * numColumns;

  // Create a new data array with placeholders for empty cells
  const dataWithPlaceholders = [...boarding];
  while (dataWithPlaceholders.length < totalCells) {
    dataWithPlaceholders.push({
      id: `placeholder-${dataWithPlaceholders.length}`,
    });
  }

  const renderItem = ({ item }) => {
    if (item.title) {
      return (
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
    } else {
      // Render a placeholder view
      return <View style={[styles.item, styles.placeholder]} />;
    }
  };

  return (
    <FlatList
      data={dataWithPlaceholders}
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
  placeholder: {
    backgroundColor: "transparent", // Make placeholders invisible
  },
});

export default BoardingList;
