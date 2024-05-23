import React, { useState } from "react";
import { supabase } from "../../utils/supabase";
import {
  View,
  StyleSheet,
  Text,
  Alert,
  AppState,
  Modal,
  Image,
} from "react-native";
import {
  Card,
  Button,
  TextInput as PaperTextInput,
  RadioButton,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

// AppState.addEventListener("change", (state) => {
//   if (state === "active") {
//     supabase.auth.startAutoRefresh();
//   } else {
//     supabase.auth.stopAutoRefresh();
//   }
// });

export default function Signup() {
  const [fullname, setFullname] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tenant");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);

      setLoading(false);
      return;
    }

    // Save user details to profiles table
    if (user) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          full_name: fullname,
          contact: number,
          role: role,
        });
      console.log(profile);

      if (profileError) {
        Alert.alert(profileError.message);
      } else {
        setModalVisible(true);
      }
      //navigate to login page is this -- router.replace("/auth/login")
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Account creation successful!</Text>
            <FontAwesome name="check-square" size={50} color="green" />
            <Button
              style={{ marginTop: 10 }}
              onPress={() => {
                setModalVisible(!modalVisible);
                router.replace("/auth/login");
              }}
            >
              Go to Login
            </Button>
          </View>
        </View>
      </Modal>
      <View style={{ alignItems: "center" }}>
        <Image
          style={styles.tinyLogo}
          source={require("@/assets/images/index.png")}
        />
      </View>
      <Card style={styles.card}>
        <Card.Content>
          <View style={{ flexDirection: "row", width: "100%", gap: 5 }}>
            <PaperTextInput
              label="Full Name"
              value={fullname}
              onChangeText={(text) => setFullname(text)}
              // left={<PaperTextInput.Icon icon="account" size={20} />}
              style={[styles.input, { flex: 1 }]}
            />
            <PaperTextInput
              label="Contact"
              value={number}
              onChangeText={(text) => setNumber(text)}
              style={[styles.input, { flex: 1 }]}
              // left={<PaperTextInput.Icon icon="phone" size={20} />}
              keyboardType="phone-pad"
            />
          </View>
          <PaperTextInput
            label="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
            // left={<PaperTextInput.Icon icon="email" />}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <PaperTextInput
            label="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            // left={<PaperTextInput.Icon icon="lock" />}
            secureTextEntry
          />
          <View style={styles.radioContainer}>
            <Text style={styles.radioLabel}>Role</Text>
            <RadioButton.Group
              onValueChange={(newValue) => setRole(newValue)}
              value={role}
            >
              <View style={styles.radioItemContainer}>
                <View style={styles.radioItem}>
                  <RadioButton value="tenant" />
                  <Text style={styles.radioText}>Tenant</Text>
                </View>
                <View style={styles.radioItem}>
                  <RadioButton value="owner" />
                  <Text style={styles.radioText}>Owner</Text>
                </View>
              </View>
            </RadioButton.Group>
          </View>
          <Button
            mode="contained"
            onPress={signUpWithEmail}
            loading={loading}
            disabled={loading}
            style={styles.button}
            labelStyle={styles.label}
          >
            Signup
          </Button>
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
    padding: 0,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 16,
    padding: 0,
  },
  radioContainer: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  radioItemContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioText: {
    marginLeft: 8,
    fontSize: 16,
  },
  button: {
    marginTop: 16,
    backgroundColor: "#422F29",
  },
  label: {
    color: "#eee",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  tinyLogo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});
