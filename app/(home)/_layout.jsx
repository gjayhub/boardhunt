import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Drawer } from "expo-router/drawer";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerToggleButton,
} from "@react-navigation/drawer";
import { Feather, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, router, usePathname, useSegments } from "expo-router";
import { supabase } from "@/utils/supabase";
import useStore from "@/hooks/useStore";

const CustomDrawerContent = (props) => {
  const pathname = usePathname();
  const profiles = useStore((state) => state.userProfile);

  const userHasImage = profiles.avatar_url && profiles.avatar_url !== "";

  // Get the initial from the user's full name
  const getInitial = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase();
  };

  return (
    <DrawerContentScrollView style={{ backgroundColor: "#FDE49E" }} {...props}>
      <View style={styles.userInfoWrapper}>
        {userHasImage ? (
          <Image
            source={{ uri: profiles.profileImageUri }}
            width={80}
            height={80}
            style={styles.userImg}
          />
        ) : (
          <View style={styles.initialWrapper}>
            <Text style={styles.initialText}>
              {getInitial(profiles.full_name)}
            </Text>
          </View>
        )}
        <View style={styles.userDetailsWrapper}>
          <Text style={styles.userName}>{profiles.full_name}</Text>
          <Text style={styles.userEmail}>{profiles.contact}</Text>
        </View>
      </View>
      <DrawerItem
        icon={({ color, size }) => (
          <Feather
            name="home"
            size={size}
            color={
              pathname == "/tenantscreen" ||
              pathname == "/protected/initialscreen"
                ? "#eee"
                : "#422F29"
            }
          />
        )}
        label={"Home"}
        labelStyle={[
          styles.navItemLabel,
          {
            color:
              pathname == "/tenantscreen" ||
              pathname == "/protected/initialscreen"
                ? "#eee"
                : "#422F29",
          },
        ]}
        style={{
          backgroundColor:
            pathname == "/tenantscreen" ||
            pathname == "/protected/initialscreen"
              ? "#422F29"
              : "#eee",
        }}
        onPress={() => {
          if (profiles.role === "tenant") {
            router.push("(home)/protected/tenantscreen");
          } else {
            router.push("(home)/protected/initialscreen");
          }
        }}
      />
      {profiles.role === "tenant" && (
        <>
          <DrawerItem
            icon={({ color, size }) => (
              <Feather
                name="list"
                size={size}
                color={pathname == "/preference" ? "#eee" : "#422F29"}
              />
            )}
            label={"Preference"}
            labelStyle={[
              styles.navItemLabel,
              { color: pathname == "/preference" ? "#eee" : "#422F29" },
            ]}
            style={{
              backgroundColor: pathname == "/preference" ? "#422F29" : "#eee",
            }}
            onPress={() => {
              router.push("preference");
            }}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <AntDesign
                name="staro"
                size={size}
                color={pathname == "/mylist" ? "#eee" : "#422F29"}
              />
            )}
            label={"My List"}
            labelStyle={[
              styles.navItemLabel,
              { color: pathname == "/mylist" ? "#eee" : "#422F29" },
            ]}
            style={{
              backgroundColor: pathname == "/mylist" ? "#422F29" : "#eee",
            }}
            onPress={() => {
              router.push("/mylist");
            }}
          />
        </>
      )}
      {profiles.role === "owner" && (
        <>
          <DrawerItem
            icon={({ color, size }) => (
              <AntDesign
                name="staro"
                size={size}
                color={
                  pathname == "/protected/reservations" ? "#eee" : "#422F29"
                }
              />
            )}
            label={"Reservations"}
            labelStyle={[
              styles.navItemLabel,
              {
                color:
                  pathname == "/protected/reservations" ? "#eee" : "#422F29",
              },
            ]}
            style={{
              backgroundColor:
                pathname == "/protected/reservations" ? "#422F29" : "#eee",
            }}
            onPress={() => {
              router.push("/protected/reservations");
            }}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="home-alert-outline"
                size={26}
                color={
                  pathname == "/protected/pendingupload" ? "#eee" : "#422F29"
                }
              />
            )}
            label={"Pending Upload"}
            labelStyle={[
              styles.navItemLabel,
              {
                color:
                  pathname == "/protected/pendingupload" ? "#eee" : "#422F29",
              },
            ]}
            style={{
              backgroundColor:
                pathname == "/protected/pendingupload" ? "#422F29" : "#eee",
            }}
            onPress={() => {
              router.push("/protected/pendingupload");
            }}
          />
        </>
      )}
      {profiles.role === "admin" && (
        <>
          <DrawerItem
            icon={({ color, size }) => (
              <AntDesign
                name="staro"
                size={size}
                color={
                  pathname == "/protected/pendingupload" ? "#eee" : "#422F29"
                }
              />
            )}
            label={"Pending Upload"}
            labelStyle={[
              styles.navItemLabel,
              {
                color:
                  pathname == "/protected/pendingupload" ? "#eee" : "#422F29",
              },
            ]}
            style={{
              backgroundColor:
                pathname == "/protected/pendingupload" ? "#422F29" : "#eee",
            }}
            onPress={() => {
              router.push("/protected/pendingupload");
            }}
          />
        </>
      )}

      <DrawerItem
        icon={({ color, size }) => (
          <AntDesign name="logout" size={size} color={pathname == "#422F29"} />
        )}
        label={"Logout"}
        labelStyle={[styles.navItemLabel, { color: pathname == "#422F29" }]}
        style={{
          backgroundColor: "#eee",
        }}
        onPress={() => {
          supabase.auth.signOut();
          router.replace("auth/login");
        }}
      />
    </DrawerContentScrollView>
  );
};

export default function DrawerLayout() {
  const { userProfile } = useStore();
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {userProfile.role === "tenant" ? (
        <Drawer.Screen
          name="protected/tenantscreen"
          options={{
            headerShown: true,
            title: "BoardHunt",
            headerStyle: { backgroundColor: "#FDE49E" },
            headerTitleStyle: styles.headerTitle,
            headerTitleAlign: "center",
            headerLeft: () => <DrawerToggleButton />,
          }}
        />
      ) : (
        <Drawer.Screen
          name="protected/initialscreen"
          options={{
            headerShown: true,
            title: "BoardHunt",
            headerStyle: { backgroundColor: "#FDE49E" },
            headerTitleStyle: styles.headerTitle,
            headerTitleAlign: "center",
            headerLeft: () => <DrawerToggleButton />,
            headerRight: () => (
              <View>
                {userProfile.role === "owner" && (
                  <TouchableOpacity
                    onPress={() => router.push("/add-boarding/step1")}
                  >
                    <MaterialCommunityIcons
                      style={{ paddingRight: 10 }}
                      name="home-plus-outline"
                      size={30}
                      color="black"
                    />
                  </TouchableOpacity>
                )}
              </View>
            ),
          }}
        />
      )}

      <Drawer.Screen
        name="protected/reserved"
        options={{
          headerShown: true,
          title: "Reserved",
          headerStyle: { backgroundColor: "#FDE49E" },
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: "center",
        }}
      />
      <Drawer.Screen
        name="protected/reservations"
        options={{
          headerShown: true,
          title: "Reservations",
          headerStyle: { backgroundColor: "#FDE49E" },
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: "center",
        }}
      />

      <Drawer.Screen
        name="protected/pendingupload"
        options={{
          headerShown: true,
          title: "Pending",
          headerStyle: { backgroundColor: "#FDE49E" },
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: "center",
        }}
      />

      <Drawer.Screen
        name="mylist"
        options={{
          headerShown: true,
          title: "My List",
          headerStyle: { backgroundColor: "#FDE49E" },
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: "center",
        }}
      />

      <Drawer.Screen
        name="preference"
        options={{
          headerShown: true,
          // Set the presentation mode to modal for our modal route.
          title: "Preference",
          headerStyle: { backgroundColor: "#FDE49E" },
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: "center",
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  navItemLabel: {
    marginLeft: -20,
    fontSize: 18,
  },
  headerTitle: { color: "#422F29", fontWeight: "bold", fontSize: 30 },
  userInfoWrapper: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 10,
    backgroundColor: "#FDE49E",
    alignItems: "center",
  },
  userImg: {
    borderRadius: 40,
  },
  initialWrapper: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: "#ccc", // Placeholder background color
    justifyContent: "center",
    alignItems: "center",
  },
  initialText: {
    fontSize: 32,
    color: "#fff", // Text color for the initial
  },
  userDetailsWrapper: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 16,
    fontStyle: "italic",
    textDecorationLine: "underline",
  },
});
