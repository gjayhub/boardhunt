// components/Rate.js

import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text, Button } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { supabase } from "@/utils/supabase";
import Toast from "react-native-toast-message";
import useStore from "@/hooks/useStore";

const Rate = ({
  maxStars = 5,
  starSize = 30,
  starColor = "#FFD700",
  onRate,
  boardingId,
  userId,
  modalRef,
}) => {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const { setRatings, ratings } = useStore();
  const handleRate = (rate) => {
    setRating(rate);

    if (onRate) {
      onRate(rate);
    }
  };
  const handleSubmitRating = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("ratings")
        .insert([{ rating, user_id: userId, boarding_id: boardingId }]);

      if (error) {
        console.error("Error updating rating:", error);
      } else {
        Toast.show({
          type: "success",
          text1: "Rated successfully!",
        });
        console.log("Rating submitted successfully:", data);
      }
      setRatings([...ratings, rating]);
      setLoading(false);
      modalRef?.current?.close?.();
    } catch (error) {
      console.error("Error submitting rating:", error);
      setLoading(false);
      modalRef?.current?.close?.();
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Rate this boarding</Text>
      </View>
      <View style={styles.starContainer}>
        {[...Array(maxStars)].map((_, index) => (
          <TouchableOpacity key={index} onPress={() => handleRate(index + 1)}>
            <FontAwesome
              name={index < rating ? "star" : "star-o"}
              size={starSize}
              color={starColor}
            />
          </TouchableOpacity>
        ))}
      </View>
      <Button
        disabled={loading}
        onPress={handleSubmitRating}
        title="Submit"
        color="#422F29"
        accessibilityLabel="Learn more about this purple button"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { justifyContent: "center", alignItems: "center" },
  starContainer: {
    flexDirection: "row",
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
  },
});

export default Rate;
