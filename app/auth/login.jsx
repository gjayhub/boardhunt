import React, { useState } from "react";
import { Text, View, StyleSheet, Alert, Image } from "react-native";
import { Card, Button, TextInput } from "react-native-paper";
import { Link, router } from "expo-router";
import useStore from "../../hooks/useStore"; // Adjust the import path as needed

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, signIn } = useStore();

  async function handleLogin() {
    const { error, profile, session } = await signIn(email, password);

    if (error) {
      Alert.alert(error.message);
      return;
    }
    if (profile.role === "tenant") {
      router.replace("(home)/protected/tenantscreen");
    } else {
      router.replace("(home)/protected/initialscreen");
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Image
          style={styles.tinyLogo}
          source={require("@/assets/images/index.png")}
        />
      </View>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            secureTextEntry
          />
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.button}
            labelStyle={styles.buttonLabel} // Add this line
          >
            Login
          </Button>
          <Link href="/auth/signup" style={styles.signupTxt}>
            Create an account
          </Link>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDE49E",
    padding: 16,
  },
  card: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    backgroundColor: "#422F29",
  },
  buttonLabel: {
    color: "#FFF", // Change this to the desired color
  },
  signupTxt: {
    textAlign: "center",
    paddingTop: 10,
  },
  tinyLogo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});
