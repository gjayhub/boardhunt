// import React, { useEffect, useState } from "react";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import { Tabs, router } from "expo-router";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { ActivityIndicator, Pressable, Text } from "react-native";
// import { DrawerToggleButton } from "@react-navigation/drawer";

// import useStore from "@/hooks/useStore";

// export default function TabLayout() {
//   const profiles = useStore((state) => state.userProfile);

//   return (
//     <Tabs
//       backBehavior="history"
//       screenOptions={{
//         tabBarActiveTintColor: "#DD761C",
//         tabBarStyle: {
//           backgroundColor: "#FDE49E",

//         },
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{

//           title: `${profiles.role === "admin" ? "Boarding List" : "Available"}`,
//           headerStyle: {
//             backgroundColor: "#FDE49E",

//           },
//           headerTitleStyle: { fontWeight: "bold", fontSize: 30 },
//           headerTitleAlign: "center",
//           headerLeft: () => <DrawerToggleButton />,
//           headerRight: () => {
//             return profiles.role === "admin" ? (
//               <></>
//             ) : (
//               <Pressable onPress={() => router.push(`addproperty/add`)}>
//                 <MaterialCommunityIcons
//                   name="home-plus-outline"
//                   size={35}
//                   color="#DD761C"
//                 />
//               </Pressable>
//             );
//           },
//           tabBarIcon: ({ color }) => (
//             <FontAwesome size={28} name="home" color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="reserved"
//         options={{
//           title: "Reserved",
//           headerStyle: {
//             backgroundColor: "#FDE49E",
//           },
//           headerTitleStyle: { fontWeight: "bold", fontSize: 30 },

//           headerTitleAlign: "center",
//           tabBarIcon: ({ color }) => (
//             <MaterialCommunityIcons name="home-lock" size={28} color={color} />
//           ),
//           href: profiles.role === "admin" ? null : "reserved",
//         }}
//       />

//       <Tabs.Screen
//         name="reservations"
//         options={{
//           title: "Reservations",
//           headerStyle: { backgroundColor: "#FDE49E" },
//           headerTitleStyle: { fontWeight: "bold", fontSize: 30 },
//           headerTitleAlign: "center",
//           tabBarIcon: ({ color }) => (
//             <MaterialCommunityIcons name="home-alert" size={28} color={color} />
//           ),
//           href: profiles.role === "admin" ? null : "reservations",
//         }}
//       />

//       <Tabs.Screen
//         name="approveupload"
//         options={{
//           title: "Pending Uploads",
//           headerStyle: { backgroundColor: "#FDE49E" },
//           headerTitleStyle: { fontWeight: "bold", fontSize: 30 },
//           headerTitleAlign: "center",
//           tabBarIcon: ({ color }) => (
//             <MaterialCommunityIcons name="home-alert" size={28} color={color} />
//           ),
//           href: profiles.role !== "admin" ? null : "approveupload",
//         }}
//       />
//     </Tabs>
//   );
// }
