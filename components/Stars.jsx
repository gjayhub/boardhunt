import React from "react";
import { StyleSheet, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function Stars({ ratingArray, size = 15, color = "#422F29" }) {
  // Calculate the average rating
  const rating =
    ratingArray.reduce((sum, rating) => sum + rating, 0) / ratingArray.length;

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      // Full star
      stars.push(<FontAwesome name="star" size={size} color={color} key={i} />);
    } else if (i - rating < 1) {
      // Half star
      stars.push(
        <FontAwesome name="star-half-empty" size={size} color={color} key={i} />
      );
    } else {
      // Empty star
      stars.push(
        <FontAwesome name="star-o" size={size} color={color} key={i} />
      );
    }
  }

  return <View style={styles.starsContainer}>{stars}</View>;
}

const styles = StyleSheet.create({
  starsContainer: {
    flexDirection: "row",
  },
});
