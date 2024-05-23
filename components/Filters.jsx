import useStore from "@/hooks/useStore";
import { supabase } from "@/utils/supabase";
import React, { useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { Button, Divider, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";

const locations = [
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
  { label: "Caritan Centro", value: "caritan centro" },
  { label: "Caritan Norte", value: "caritan norte" },
  { label: "Caritan Sur", value: "caritan sur" },
  { label: "Cataggaman Nuevo", value: "cataggaman nuevo" },
  { label: "Cataggaman Pardo", value: "cataggaman pardo" },
  { label: "Cataggaman Viejo", value: "cataggaman viejo" },
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

const types = [
  { label: "Apartment", value: "apartment" },
  { label: "House", value: "house" },
  { label: "Solo Room", value: "solo room" },
  { label: "Bedspace", value: "bedspace" },
  { label: "Studio", value: "studio" },
];

const tags = [
  { label: "Wifi", value: "wifi" },
  { label: "Affordable", value: "affordable" },
  { label: "No curfew", value: "no curfew" },
  { label: "Inclusive bills", value: "inclusive bills" },
  { label: "Parking lot", value: "parking lot" },
  { label: "Near mall", value: "near mall" },
  { label: "Near supermarket", value: "near supermarket" },
  // Add more tags as needed
];

export function Filters({ text, modalRef }) {
  const priceRanges = [
    { lowest: 1000, highest: 2000 },
    { lowest: 2000, highest: 3000 },
    { lowest: 3000, highest: 4000 },
    { lowest: 5000, highest: 6000 },
    { lowest: 7000, highest: "Above" },
  ];

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchLocation, setSearchLocation] = useState("");

  const {
    searchWithFilter,
    setSearchResult,
    userProfile,
    searchResult,
    setUserProfile,
    searchQuery,
    setUserPreference,
  } = useStore();

  const filteredLocations = locations.filter((location) =>
    location.label.toLowerCase().includes(searchLocation.toLowerCase())
  );

  const handleFilter = async () => {
    if (text === "preference") {
      const preference = {
        type: selectedType,
        location: selectedLocation,
        tags: selectedTag,
      };

      const { data: user, error } = await supabase
        .from("profiles")
        .update({ preference: preference })
        .eq("id", userProfile.id)
        .select();
      if (!error) {
        Toast.show({
          type: "success",
          text1: "Preference is applied successfully",
        });

        setUserPreference(preference);
      } else {
        console.log(error);
      }
      return;
    }
    let newSearch = searchQuery;

    const range = priceRanges[selectedPriceRange];

    if (selectedLocation) {
      newSearch += ` ${selectedLocation} `;
    }

    if (selectedType) {
      newSearch += ` ${selectedType} `;
    }
    if (selectedTag) {
      newSearch += ` ${selectedTag} `;
    }

    const { transformedData, error } = await searchWithFilter(newSearch, range);
    setSearchResult(transformedData);
    modalRef.current?.close?.();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Set {text}</Text>
      <View style={styles.searchLoc}>
        <Text style={styles.label}>Location:</Text>
        <TextInput
          placeholder="Search locations"
          value={searchLocation}
          onChangeText={(text) => setSearchLocation(text)}
          style={styles.searchInput}
        />
      </View>
      <View style={styles.btnContainer}>
        {filteredLocations.slice(0, 5).map((location) => (
          <Button
            key={location.value}
            mode="outlined"
            onPress={() => setSelectedLocation(location.value)}
            style={[
              styles.filterButton,
              selectedLocation === location.value
                ? styles.selectedButton
                : styles.unselectedButton,
            ]}
            labelStyle={[
              styles.buttonLabel,
              selectedLocation === location.value && styles.selectedButtonLabel,
            ]}
          >
            {location.label}
          </Button>
        ))}
        {filteredLocations.length > 5 && (
          <Button
            mode="outlined"
            onPress={() => setSelectedLocation(null)} // Optional: Define an action for this button
            style={[
              styles.filterButton,
              styles.unselectedButton, // Keep it unselected for clarity
            ]}
            labelStyle={styles.buttonLabel}
          >
            +{filteredLocations.length - 5} more
          </Button>
        )}
      </View>
      <Divider style={styles.divider} />

      <Text style={styles.label}>Price Range</Text>
      <View style={styles.btnContainer}>
        {priceRanges?.map((priceRange, index) => (
          <Button
            key={index}
            mode="outlined"
            onPress={() => setSelectedPriceRange(index)}
            style={[
              styles.filterButton,
              selectedPriceRange === index
                ? styles.selectedButton
                : styles.unselectedButton,
            ]}
            labelStyle={[
              styles.buttonLabel,
              selectedPriceRange === index && styles.selectedButtonLabel,
            ]}
          >
            {`${priceRange.lowest} - ${priceRange.highest}`}
          </Button>
        ))}
      </View>

      <Divider style={styles.divider} />

      <Text style={styles.label}>Type</Text>
      <View style={styles.btnContainer}>
        {types.map((type) => (
          <Button
            key={type.value}
            mode="outlined"
            onPress={() => setSelectedType(type.value)}
            style={[
              styles.filterButton,
              selectedType === type.value
                ? styles.selectedButton
                : styles.unselectedButton,
            ]}
            labelStyle={[
              styles.buttonLabel,
              selectedType === type.value && styles.selectedButtonLabel,
            ]}
          >
            {type.label}
          </Button>
        ))}
      </View>
      <Divider style={styles.divider} />

      <Text style={styles.label}>Other tags</Text>
      <View style={styles.btnContainer}>
        {tags.map((tag) => (
          <Button
            key={tag.value}
            mode="outlined"
            onPress={() => setSelectedTag(tag.value)}
            style={[
              styles.filterButton,
              selectedTag === tag.value
                ? styles.selectedButton
                : styles.unselectedButton,
            ]}
            labelStyle={[
              styles.buttonLabel,
              selectedTag === tag.value && styles.selectedButtonLabel,
            ]}
          >
            {tag.label}
          </Button>
        ))}
      </View>
      <View style={[styles.btnContainer, styles.applyBtnContainer]}>
        <Button
          mode="outlined"
          style={{ borderColor: "#422F29" }}
          labelStyle={styles.applyBtnLabel}
          textColor="#422F29"
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          style={{ backgroundColor: "#422F29" }}
          labelStyle={[styles.applyBtnLabel]}
          onPress={handleFilter}
          textColor="#eee"
        >
          Apply
        </Button>
      </View>
      <Toast />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    zIndex: -1000,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#422F29",
  },
  label: {
    fontSize: 18,
    color: "#422F29",
  },
  searchLoc: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  searchInput: {
    backgroundColor: "#eee",
    flex: 1,
    height: 30,
    borderBottomColor: "#422F29",
    marginLeft: 10,
  },
  buttonLabel: {
    fontSize: 12,
    marginHorizontal: 5,
    marginVertical: 0,
    color: "#422F29", // Unselected label color
  },
  applyBtnLabel: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  btnContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 5,
    alignItems: "center",
  },
  filterButton: {
    marginBottom: 10,
  },
  selectedButton: {
    backgroundColor: "#422F29",
  },
  selectedButtonLabel: {
    color: "#eee",
  },
  unselectedButton: {
    borderColor: "#422F29", // Outline color for unselected buttons
  },
  applyBtnContainer: {
    justifyContent: "flex-end",
    paddingTop: 10,
  },
  divider: {
    marginVertical: 10,
  },
});
