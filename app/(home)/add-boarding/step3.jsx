import React, { useState, useEffect } from "react";
import {
  View,
  Pressable,
  Text,
  Image,
  FlatList,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Button } from "react-native-paper";
import { supabase, supabaseAdmin } from "@/utils/supabase";
import useStore from "@/hooks/useStore";
import useAdmin from "@/hooks/useAdmin";

const Step3 = () => {
  const [loading, setLoading] = useState(false);
  const { userProfile } = useStore();
  const { title, details, location, type, tags, price } =
    useLocalSearchParams();
  const [images, setImages] = useState([]);
  const { setPending, pending } = useAdmin();

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    })();
  }, []);

  const isDisabled = images.length === 0;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.2,
      base64: true,
    });

    if (!result.canceled) {
      setImages([...result.assets.map((asset) => asset.uri)]);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();
      const fileName = `public/${Date.now()}.jpg`;

      const { data, error } = await supabaseAdmin.storage
        .from("boardings")
        .upload(fileName, arrayBuffer, {
          contentType: "image/jpeg",
          upsert: false,
        });

      if (error) {
        console.error("Error uploading top: ", error);
      }

      const {
        data: { publicUrl },
      } = supabaseAdmin.storage.from("boardings").getPublicUrl(`${fileName}`);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const saveBoardingData = async (data) => {
    const { data: pendingData, error } = await supabase
      .from("boarding")
      .insert([data])
      .select()
      .single();
    if (error) {
      console.error("Error saving boarding data:", error);
    } else {
      setPending([...pending, pendingData]);
      router.push("/protected/pendingupload");
    }
  };

  const handleAddProperty = async () => {
    setLoading(true);
    const tagsArray = tags.split(",").map(String);
    const pricey = parseInt(price);

    const uploadedImages = [];
    for (let i = 0; i < images.length; i++) {
      const imageUrl = await uploadImage(images[i]);
      if (imageUrl) {
        uploadedImages.push(imageUrl);
      }
    }

    const boardingData = {
      owner_id: userProfile.id,
      title,
      details,
      location,
      type,
      tags: tagsArray,
      images: uploadedImages,
      price: pricey,
      is_available: true,
      upload_status: "pending",
    };

    await saveBoardingData(boardingData);

    setLoading(false);
  };
  if (loading)
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.imagePreviewContainer}>
        <FlatList
          horizontal
          data={images}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.imagePreview} />
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.imagePreviewList}
        />
      </View>
      <Pressable style={{ height: "auto" }} onPress={pickImage}>
        <View style={styles.imagePicker}>
          <AntDesign name="pluscircleo" size={40} color="black" />
          <Text>{images.length == 0 ? "Pick Images" : "Change image"}</Text>
        </View>
      </Pressable>
      <Button
        style={[styles.btn, isDisabled && styles.btnDisabled]}
        labelStyle={{ color: "#eee" }}
        onPress={handleAddProperty}
      >
        Submit Boarding
      </Button>
    </View>
  );
};

export default Step3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#FDE49E",
  },
  imagePicker: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  imagePreviewContainer: {
    height: 220,
    marginBottom: 20,
  },
  imagePreviewList: {
    alignItems: "center",
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginRight: 10,
  },
  btn: {
    backgroundColor: "#422F29",
    marginTop: 50,
  },
  btnDisabled: {
    opacity: 0.5,
  },
});
