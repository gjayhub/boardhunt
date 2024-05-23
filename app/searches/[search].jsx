import React, { useState, useCallback, useMemo, useRef } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Button, Searchbar } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import BoardingList from "@/components/BoardingList";

import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Filters } from "@/components/Filters";
import useStore from "@/hooks/useStore";

const SearchResult = () => {
  const { search } = useLocalSearchParams();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const {
    searchResult,
    searchWithFilter,
    searchQuery,
    setSearchQuery,
    filters,
  } = useStore();
  const bottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => ["40%", "90%"], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);
  const handleSearch = async () => {
    console.log(filters);
    if (searchQuery && searchQuery !== "") {
      const { transformedData } = await searchWithFilter(searchQuery);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <Searchbar
              style={styles.searchInput}
              onChangeText={setSearchQuery}
              inputStyle={{
                minHeight: 0,
              }}
              placeholder="Search"
              value={searchQuery}
              onSubmitEditing={handleSearch}
            />
            <Button
              icon="filter"
              style={styles.searchBtn}
              textColor="#eee"
              onPress={handlePresentModalPress}
              title="Present Modal"
            >
              Filter
            </Button>
          </View>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
          >
            <BottomSheetView style={styles.contentContainer}>
              <Filters text="filter" modalRef={bottomSheetModalRef} />
            </BottomSheetView>
          </BottomSheetModal>
          <View style={{ flex: 1 }}>
            <Text style={styles.resultsTitle}>Search results: {search}</Text>
            {searchResult?.length == 0 ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 0.5,
                }}
              >
                <Text>No Result found</Text>
              </View>
            ) : (
              <BoardingList boarding={searchResult} />
            )}
          </View>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default SearchResult;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDE49E",
  },
  searchContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  searchInput: {
    width: "70%",
    margin: 10,
    height: 40,
  },
  searchBtn: {
    width: "30%",
    backgroundColor: "#422F29",
    padding: 0,
    margin: 0,
  },
  resultsTitle: {
    fontSize: 18,
    paddingLeft: 15,
  },
  contentContainer: {
    flex: 1,
    padding: 10,
  },
});
