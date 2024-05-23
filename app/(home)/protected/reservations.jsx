import useAdmin from "@/hooks/useAdmin";
import useStore from "@/hooks/useStore";
import { supabase } from "@/utils/supabase";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { openURL } from "expo-linking";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { Button } from "react-native-paper";
import Toast from "react-native-toast-message";

export default function Reservations() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { userProfile } = useStore();
  const [reservations, setReservations] = useState([]);
  const [currentItem, setCurrentItem] = useState({});
  const [loading, setLoading] = useState(false);
  const { getReservations } = useAdmin();
  useEffect(() => {
    const fetchReserve = async () => {
      const { data, error } = await getReservations(userProfile.id);

      if (error) {
        console.log(error);
      } else {
        setReservations(data);
      }
    };
    fetchReserve();
  }, []);

  const handleModalPress = (item) => {
    setCurrentItem(item);
    setIsModalVisible(true);
  };
  const handleReject = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("reservation_requests")
      .delete()
      .eq("id", currentItem.id);

    if (error) {
      console.log(error);
    } else {
      Toast.show({
        type: "success",
        text1: `Reservation has been rejected!`,
      });
      setReservations((prev) =>
        prev.filter((item) => item.id !== currentItem.id)
      );
      setIsModalVisible(false);
    }
    setLoading(false);
  };
  const handleApprove = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("reservation_requests")
      .update({ reservation_status: "approved" })
      .eq("id", currentItem.id);

    if (error) {
      console.log(error);
    } else {
      Toast.show({
        type: "success",
        text1: `You accepted ${currentItem.profiles.full_name} as your tenant!`,
      });
      setReservations((prev) =>
        prev.filter((item) => item.id !== currentItem.id)
      );
      setIsModalVisible(false);
    }
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleModalPress(item)}>
      <View style={styles.requestItem}>
        <View style={styles.info}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.tinyLogo}
              source={{ uri: item.boarding?.images[0] }}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.requestText}>
              {item.profiles.full_name} is requesting for your room:
            </Text>
            <Text style={styles.requestText}>{item.boarding.title}</Text>
          </View>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Feather
              name="phone-call"
              size={24}
              color="green"
              onPress={() => openURL(`tel:${item.profiles.contact}`)}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons
              name="sms"
              size={24}
              color="red"
              onPress={() => openURL(`sms:+098821832`)}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Toast />
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              width: 300,
              padding: 20,
              backgroundColor: "white",
              borderRadius: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={{
                position: "absolute",
                right: 5,
                zIndex: 1,
              }}
            >
              <Text style={{ fontSize: 20, color: "black" }}>✖</Text>
            </TouchableOpacity>

            <Text style={styles.confirmTitle}>Confirm request?</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 20,
              }}
            >
              <Button
                style={{ borderColor: "#422F29" }}
                labelStyle={styles.buttonLabel}
                mode="outlined"
                textColor="#422F29"
                onPress={handleReject}
              >
                Reject
              </Button>
              <Button
                style={styles.btnStyle}
                labelStyle={styles.buttonLabel}
                mode="contained"
                textColor="#eee"
                onPress={handleApprove}
                disabled={loading}
              >
                Accept
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      <Text style={styles.header}>Reservation Requests</Text>
      {reservations.length === 0 && (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 0.5 }}
        >
          <Text style={{ fontSize: 15 }}>No reservation found!</Text>
        </View>
      )}
      <View style={{ zIndex: -10 }}>
        <FlatList
          data={reservations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDE49E",
    padding: 10,
    width: "100%",
  },
  tinyLogo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    flex: 2,
  },
  textContainer: {
    marginLeft: 10,
    flexShrink: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 20,
    zIndex: -10,
  },
  requestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 5,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 3,
    width: "100%",
  },
  requestText: {
    fontSize: 14,
    flexShrink: 1,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    gap: 15,
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
  },
  iconButton: {
    marginLeft: 10,
  },
  approve: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderColor: "green",
    color: "green",
    textAlign: "center",
  },
  reject: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderColor: "red",
    color: "red",
    textAlign: "center",
  },
  btnStyle: {
    backgroundColor: "#422F29",
  },
  buttonLabel: {
    fontSize: 15,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },
});
