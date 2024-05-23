import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, ScrollView, Text } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Button } from "react-native-paper";
import { LogBox } from "react-native";

const { width } = Dimensions.get("window");

const Step2 = () => {
  const { title, details, price } = useLocalSearchParams();
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [tags, setTags] = useState([]);
  const [openLocation, setOpenLocation] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [openTags, setOpenTags] = useState(false);

  const locationItems = [
    { label: "Annafunan East", value: "annafunan east" },
    { label: "Annafunan West", value: "annafunan west" },
    { label: "Atulayan Norte", value: "atulayan norte" },
    { label: "Atulayan Sur", value: "atulayan sur" },
    { label: "Bagay", value: "bagay" },
    { label: "Buntun", value: "buntun" },
    { label: "Caggay", value: "caggay" },
    { label: "Capatan", value: "capatan" },
    { label: "Carig Norte", value: "carig norte" },
    { label: "Carig Sur", value: "carig sur" },
    { label: "Caritan Centro", value: "carita centro" },
    { label: "Caritan Norte", value: "carita norte" },
    { label: "Caritan Sur", value: "carita sur" },
    { label: "Cataggaman Nuevo", value: "cataggama nuevo" },
    { label: "Cataggaman Pardo", value: "cataggama pardo" },
    { label: "Cataggaman Viejo", value: "cataggama viejo" },
    { label: "Centro 1", value: "centro 1" },
    { label: "Centro 2", value: "centro 2" },
    { label: "Centro 3", value: "centro 3" },
    { label: "Centro 4", value: "centro 4" },
    { label: "Centro 5", value: "centro 5" },
    { label: "Centro 6", value: "centro 6" },
    { label: "Centro 7", value: "centro 7" },
    { label: "Centro 8", value: "centro 8" },
    { label: "Centro 9", value: "centro 9" },
    { label: "Centro 10", value: "centro 10" },
    { label: "Centro 11", value: "centro 11" },
    { label: "Centro 12", value: "centro 12" },
    { label: "Centro 13", value: "centro 13" },
    { label: "Centro 14", value: "centro 14" },
    { label: "Centro 15", value: "centro 15" },
    { label: "Centro 16", value: "centro 16" },
    { label: "Centro 17", value: "centro 17" },
    { label: "Dadda", value: "dadda" },
    { label: "Gosi Norte", value: "gosi norte" },
    { label: "Gosi Sur", value: "gosi sur" },
    { label: "Larion Alto", value: "larion alto" },
    { label: "Larion Bajo", value: "larion bajo" },
    { label: "Leonarda", value: "leonarda" },
    { label: "Libag Norte", value: "libag norte" },
    { label: "Libag Sur", value: "libag sur" },
    { label: "Linao East", value: "linao east" },
    { label: "Linao Norte", value: "linao norte" },
    { label: "Linao West", value: "linao west" },
    { label: "Namabbalan Norte", value: "namabbalan norte" },
    { label: "Namabbalan Sur", value: "namabbalan sur" },
    { label: "Pallua Norte", value: "pallua norte" },
    { label: "Pallua Sur", value: "pallua sur" },
    { label: "Pengue-Ruyu", value: "pengue ruyu" },
    { label: "Rebucung", value: "rebucung" },
    { label: "San Gabriel", value: "san gabriel" },
    { label: "Tagga", value: "tagga" },
    { label: "Tanza", value: "tanza" },
    { label: "Ugac Norte", value: "ugac norte" },
    { label: "Ugac Sur", value: "ugac sur" },
  ];

  const typeItems = [
    { label: "Apartment", value: "apartment" },
    { label: "House", value: "house" },
    { label: "Solo Room", value: "solo room" },
    { label: "Bedspace", value: "bedspace" },
    { label: "Studio", value: "studio" },
  ];

  const tagsItems = [
    { label: "Wifi", value: "wifi" },
    { label: "Affordable", value: "affordable" },
    { label: "No curfew", value: "no curfew" },
    { label: "Inclusive bills", value: "inclusive bills" },
    { label: "Parking lot", value: "parking lot" },
    { label: "Near mall", value: "near mall" },
    { label: "Near supermarket", value: "near supermarket" },
    // Add more tags as needed
  ];

  const router = useRouter();
  const isDisabled = tags == [] || type === "" || location === "";

  const nextStep = () => {
    router.push({
      pathname: "add-boarding/step3",
      params: { title, details, location, type, tags, price },
    });
    console.log(title, details, location, type, tags, price);
  };

  return (
    <View style={styles.container}>
      <Text>Location: </Text>
      <DropDownPicker
        searchable={true}
        open={openLocation}
        value={location}
        items={locationItems}
        setOpen={setOpenLocation}
        setValue={setLocation}
        placeholder="Select Location"
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
        dropDownStyle={styles.dropdown}
        zIndex={5}
      />
      <Text>Type: </Text>
      <DropDownPicker
        open={openType}
        value={type}
        items={typeItems}
        setOpen={setOpenType}
        setValue={setType}
        placeholder="Select Type"
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
        dropDownStyle={styles.dropdown}
        zIndex={4}
      />
      <Text>Tags: </Text>
      <DropDownPicker
        open={openTags}
        value={tags}
        items={tagsItems}
        setOpen={setOpenTags}
        setValue={setTags}
        placeholder="Select Tags"
        multiple={true}
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
        dropDownStyle={styles.dropdown}
        zIndex={3}
      />

      <View style={{ zIndex: -1 }}>
        <Button
          style={[styles.btn, isDisabled && styles.btnDisabled]}
          labelStyle={{ color: "#eee" }}
          disabled={isDisabled}
          onPress={nextStep}
        >
          NEXT
        </Button>
      </View>
    </View>
  );
};

export default Step2;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "center",
    padding: 20,
    backgroundColor: "#FDE49E",
  },
  dropdownContainer: {
    marginVertical: 10,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  btn: {
    backgroundColor: "#422F29",
    marginTop: 50,
  },
  btnDisabled: {
    opacity: 0.5,
  },
});
