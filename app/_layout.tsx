import { ConvexProvider, ConvexReactClient } from "convex/react";

import { Stack } from "expo-router";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="style-demo" options={{ title: "Style Demo" }} />
      </Stack>
    </ConvexProvider>
  );
}
