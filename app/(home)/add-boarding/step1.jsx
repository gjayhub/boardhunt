import React, { useState } from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { Button } from "react-native-paper";

const Step1 = () => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [price, setPrice] = useState("");

  const nextStep = () => {
    router.push({
      pathname: "add-boarding/step2",
      params: { title, details, price },
    });
  };

  const isDisabled = title === "" || details === "" || price === "";

  return (
    <View style={styles.container}>
      <Text style={{ alignItems: "left", paddingBottom: 5 }}>Title:</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <Text style={{ textAlign: "left", paddingBottom: 5 }}>Details:</Text>
      <TextInput
        style={[styles.input, { height: 150, textAlignVertical: "top" }]}
        placeholder="Details"
        multiline={true}
        numberOfLines={4}
        value={details}
        onChangeText={setDetails}
      />
      <Text style={{ textAlign: "left", paddingBottom: 5 }}>Price:</Text>
      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />
      <Button
        style={[styles.btn, isDisabled && styles.btnDisabled]}
        labelStyle={{ color: "#eee" }}
        disabled={isDisabled}
        onPress={nextStep}
      >
        NEXT
      </Button>
    </View>
  );
};

export default Step1;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "center",
    padding: 20,
    backgroundColor: "#FDE49E",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  btn: {
    backgroundColor: "#422F29",
    marginTop: 50,
  },
  btnDisabled: {
    opacity: 0.5,
  },
});
