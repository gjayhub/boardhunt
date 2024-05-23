import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { openURL } from "expo-linking";
import Carousel from "react-native-reanimated-carousel";
import { router, useLocalSearchParams } from "expo-router";
import { Button, Divider } from "react-native-paper";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useNavigation } from "expo-router";
import useStore from "@/hooks/useStore";
import OpenAI from "openai";
import LoadingItem from "@/components/loading";
import { supabase } from "@/utils/supabase";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Rate from "@/components/Rate";
import Stars from "@/components/Stars";
import useAdmin from "@/hooks/useAdmin";

const { width } = Dimensions.get("window");

const BoardingScreen = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);

  const rateModalRef = useRef(null);

  const snapPoints = useMemo(() => ["40%", "80%"], []);

  const handlePresentModalPress = useCallback(() => {
    rateModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  const {
    getBoardingDetails,
    boardingDetails,
    error,
    isFavorite,
    userProfile,
    toggleFavorite,
    isReserved,
    setIsReserved,
    chechReservation,
    ratings,
    setBoardingDetails,
    setIsAvailable,
    isAvailable,
  } = useStore();
  const { deleteBoarding, setPending, pending } = useAdmin();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleTrashPress = () => {
    setIsModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    const { error, loading } = await deleteBoarding(id);
    if (!error) {
      setIsModalVisible(false);
      router.replace("protected/initialscreen");
    }
  };
  const handleApprove = async () => {
    const { error } = await supabase
      .from("boarding")
      .update({ upload_status: "approved" })
      .eq("id", id);
    if (error) {
      Alert.alert("Error deleting", error);
    } else {
      setPending(pending.filter((item) => item.id !== id));
      setBoardingDetails({
        ...boardingDetails,
        upload_status: !boardingDetails.upload_status,
      });
      Toast.show({
        type: "success",
        text1: "Boarding upload has been approved",
      });
    }
  };

  const handleCancelDelete = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const getDetails = async () => {
      await getBoardingDetails(id, userProfile.id);
      await chechReservation(id, userProfile.id);

      setLoading(false);
    };
    getDetails();

    if (error) {
      Alert.alert(error.message);
    }
  }, [id]);
  useEffect(() => {
    if (!loading) {
      navigation.setOptions({
        title: "Preview",
        headerRight: () => {
          return userProfile.role === "tenant" ? (
            <Pressable style={{ marginEnd: 20 }} onPress={handleToggleFavorite}>
              {isFavorite ? (
                <FontAwesome name="bookmark" size={24} color="#422F29" />
              ) : (
                <FontAwesome name="bookmark-o" size={24} color="#422F29" />
              )}
            </Pressable>
          ) : (
            <Pressable onPress={handleTrashPress}>
              <FontAwesome name="trash-o" size={24} color="#422F29" />
            </Pressable>
          );
        },
      });
    }
  }, [id, isFavorite, loading, userProfile.role]);

  const handleToggleFavorite = async () => {
    const { error } = await toggleFavorite(id, userProfile.id, isFavorite);
    if (error) {
      console.error("Error toggling favorite:", error);
      return;
    }
  };

  const makeReservation = async () => {
    let error = null;
    const reservationData = {
      request_by: userProfile.id,
      requested_boarding: boardingDetails.id,

      boarding_owner: boardingDetails.owner_id,
      reservation_status: "pending",
    };
    if (isReserved) {
      const { errorDelete } = await supabase
        .from("reservation_requests")
        .delete()
        .eq("id", isReserved.id);
      if (!errorDelete) {
        Toast.show({
          type: "success",
          text1: "Reservation cancelled successfully",
        });
        setIsReserved(null);
      }
    } else {
      const { data, errorInsert } = await supabase
        .from("reservation_requests")
        .insert([reservationData])
        .select("id,reservation_status")
        .single();

      setIsReserved(data);

      if (!errorInsert) {
        Toast.show({
          type: "success",
          text1: "Reservation success",
          text2: "Wait for the approval by the owner",
        });
      }
    }
  };

  const updateAvailable = async () => {
    const { data, error } = await supabase
      .from("boarding")
      .update({ is_available: !boardingDetails.is_available })
      .eq("id", id);

    if (!error) {
      setIsAvailable(!isAvailable);

      Toast.show({
        type: "success",
        text1: "Updated successully",
        text2: "Availability is updated successfully",
      });
    }
  };

  if (loading) return <LoadingItem />;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View style={styles.container}>
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={handleCancelDelete}
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
                <Text>Are you sure you want to delete this item?</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    marginTop: 20,
                  }}
                >
                  <Button
                    style={{ borderColor: "#422F29" }}
                    labelStyle={[styles.buttonLabel]}
                    mode="outlined"
                    textColor="#422F29"
                    onPress={handleCancelDelete}
                  >
                    Cancel
                  </Button>
                  <Button
                    style={{ backgroundColor: "#422F29" }}
                    labelStyle={styles.buttonLabel}
                    mode="contained"
                    textColor="#eee"
                    onPress={handleConfirmDelete}
                  >
                    Delete
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
          <Toast />

          <View style={styles.carouselContainer}>
            <Carousel
              loop
              width={width}
              autoPlay={true}
              panGestureHandlerProps={{
                activeOffsetX: [-1, 1],
                activeOffsetY: [-10, 10],
              }}
              data={boardingDetails.images}
              scrollAnimationDuration={2000}
              renderItem={({ item }) => (
                <View style={styles.carouselItem}>
                  <Image source={{ uri: item }} style={styles.image} />
                </View>
              )}
            />
          </View>

          <View style={styles.blurWrapper}>
            <Divider />
            <ScrollView>
              <View style={styles.detailsContainer}>
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={[styles.detailTitle, { flex: 1 }]}>
                      {boardingDetails.title}
                    </Text>
                    <View style={{ paddingEnd: 20, width: "auto" }}>
                      <Stars ratingArray={ratings} />
                    </View>
                  </View>

                  <Text style={styles.detailText}>
                    {boardingDetails.details}
                  </Text>

                  <Divider />
                  <View style={styles.outerTextContainer}>
                    <View style={styles.textContainer}>
                      <Text style={styles.label}>Price: </Text>
                      <Text style={styles.detailPrice}>
                        {boardingDetails.price}
                      </Text>
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={styles.label}>Type: </Text>
                      <Text style={styles.detailType}>
                        {boardingDetails.type}
                      </Text>
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={styles.label}>Location: </Text>
                      <Text style={styles.detailLocation}>
                        {boardingDetails.location}
                      </Text>
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={styles.label}>Other tags: </Text>
                      <View style={{ flexWrap: "wrap" }}>
                        {boardingDetails.tags.length !== 0 ? (
                          boardingDetails.tags.map((tag, index) => (
                            <Text key={index} style={styles.detailTags}>
                              {tag}
                            </Text>
                          ))
                        ) : (
                          <Text style={styles.detailTags}>none</Text>
                        )}
                      </View>
                    </View>

                    <View style={styles.ownerInfo}>
                      <Text style={styles.label}>Owner: </Text>
                      <Text style={styles.detailOwner}>
                        {boardingDetails.profiles?.full_name}
                      </Text>
                    </View>
                    <View style={styles.contactInfo}>
                      <View
                        style={[
                          styles.textContainer,
                          { alignItems: "center", gap: 4 },
                        ]}
                      >
                        <Text style={styles.label}>Contact:</Text>
                        <Text style={styles.detailOwner}>
                          {boardingDetails.profiles?.contact}
                        </Text>
                      </View>
                      <View style={styles.contactIcons}>
                        <Feather
                          name="phone-call"
                          size={24}
                          color="green"
                          onPress={() =>
                            openURL(`tel:+${boardingDetails.profiles?.contact}`)
                          }
                        />
                        <MaterialIcons
                          name="sms"
                          size={24}
                          color="red"
                          onPress={() =>
                            openURL(`sms:+${boardingDetails.profiles?.contact}`)
                          }
                        />
                      </View>
                    </View>
                  </View>
                  {userProfile.role === "tenant" && (
                    <>
                      {isReserved?.reservation_status === "approved" ? (
                        <TouchableOpacity
                          style={[
                            {
                              backgroundColor: "#422F29",
                              width: 100,
                              alignSelf: "center",
                              paddingVertical: 5,
                              borderRadius: 20,
                              marginTop: 10,
                            },
                          ]}
                          onPress={handlePresentModalPress}
                        >
                          <Text style={{ textAlign: "center", color: "#eee" }}>
                            Rate
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <Button
                          style={styles.btnStyle}
                          labelStyle={styles.buttonLabel}
                          mode="contained"
                          textColor="#eee"
                          onPress={makeReservation}
                        >
                          {isReserved
                            ? "Cancel Reservation"
                            : "Make Reservation"}
                        </Button>
                      )}
                    </>
                  )}
                  {userProfile.role === "owner" && (
                    <View>
                      {boardingDetails.upload_status !== "pending" ? (
                        <Button
                          style={styles.btnStyle}
                          labelStyle={styles.buttonLabel}
                          mode="contained"
                          textColor="#eee"
                          onPress={updateAvailable}
                        >
                          {boardingDetails.is_available
                            ? "Mark as unavailable"
                            : "Mark as available"}
                        </Button>
                      ) : (
                        <Text
                          style={{
                            textAlign: "center",
                            marginTop: 20,
                            fontSize: 20,
                            fontWeight: "700",
                            fontStyle: "italic",
                          }}
                        >
                          Waiting for approval
                        </Text>
                      )}
                    </View>
                  )}
                  {userProfile.role === "admin" && (
                    <View style={styles.buttonContainer}>
                      {boardingDetails.upload_status === "pending" && (
                        <>
                          <Button
                            style={{ borderColor: "#422F29" }}
                            labelStyle={[styles.buttonLabel]}
                            mode="outlined"
                            textColor="#422F29"
                            onPress={handleConfirmDelete}
                          >
                            Reject
                          </Button>
                          <Button
                            style={{ backgroundColor: "#422F29", margin: 0 }}
                            labelStyle={styles.buttonLabel}
                            mode="contained"
                            textColor="#eee"
                            onPress={handleApprove}
                          >
                            Approve
                          </Button>
                        </>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
        <BottomSheetModal
          ref={rateModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <BottomSheetView style={styles.contentContainer}>
            <Rate
              userId={userProfile.id}
              boardingId={id}
              modalRef={rateModalRef}
            />
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default BoardingScreen;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#FDE49E",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textTransform: "capitalize",
  },
  carouselContainer: {
    flex: 1,
    zIndex: -1000,
  },
  carouselItem: {
    width: width - 40,

    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  blurWrapper: {
    flex: 1,
    width: "95%",
    marginTop: 20,
  },
  blurView: {
    flex: 1,
  },
  detailsContainer: {
    backgroundColor: "#FDE49E",
    paddingTop: 15,
    marginBottom: 10,
    textTransform: "capitalize",
  },
  outerTextContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  textContainer: {
    flexDirection: "row",
    marginBottom: 5,
    width: "50%",
    alignItems: "stretch",
  },
  label: {
    fontWeight: "bold",
    color: "#422F29",
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#422F29",
  },
  detailText: {
    fontSize: 16,
    color: "#422F29",
    marginBottom: 10,
  },
  detailPrice: {
    fontSize: 12,
    color: "#422F29",
    marginTop: 2,
  },
  detailLocation: {
    fontSize: 12,
    color: "#422F29",
    flex: 1,
    marginTop: 2,
    textTransform: "capitalize",
  },
  detailTags: {
    fontSize: 12,
    color: "#422F29",
    marginTop: 2,
    textTransform: "capitalize",
  },
  detailType: {
    fontSize: 12,
    color: "#422F29",
    marginTop: 2,
    textTransform: "capitalize",
  },
  detailOwner: {
    fontSize: 14,
    color: "#422F29",
    textTransform: "capitalize",
  },
  ownerInfo: {
    width: "100%",
    flexDirection: "row",
    gap: 4,
    color: "#422F29",
  },
  contactInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingRight: 10,
    fontSize: 14,
    paddingTop: 10,
    marginTop: 2,
    color: "#422F29",
  },
  contactIcons: {
    flexDirection: "row",
    gap: 20,
  },
  btnStyle: {
    backgroundColor: "#422F29",
    marginTop: 20,
  },
  buttonLabel: {
    fontSize: 15,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
    marginTop: 20,
  },
  adminButtonsContainer: {
    paddingTop: 20,
    flexDirection: "row",
    gap: 10,
  },
  rejectButton: {
    borderColor: "#DD761C",
    flex: 1,
  },
  reservationButtonContainer: {
    paddingTop: 20,
  },
});
