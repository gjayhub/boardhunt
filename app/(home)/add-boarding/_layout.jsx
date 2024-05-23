import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="step1"
        options={{
          title: "Add Boarding",
          headerStyle: { backgroundColor: "#FDE49E" },
          headerTitleStyle: { fontWeight: "bold", fontSize: 30 },
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="step2"
        options={{
          title: "Add Boarding",
          headerStyle: { backgroundColor: "#FDE49E" },
          headerTitleStyle: { fontWeight: "bold", fontSize: 30 },
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="step3"
        options={{
          title: "Add Boarding",
          headerStyle: { backgroundColor: "#FDE49E" },
          headerTitleStyle: { fontWeight: "bold", fontSize: 30 },
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
