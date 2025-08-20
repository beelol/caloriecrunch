import { api } from "@/convex/_generated/api";

import { useQuery } from "convex/react";

import Button from "@/app/components/Button";
import { spacing, useTheme } from "@/app/styleGuide";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  const tasks = useQuery(api.tasks.get);
  const t = useTheme();

  return (
    <View style={{ flex: 1, padding: spacing(4), backgroundColor: t.colors.background }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {tasks?.map(({ _id, text }) => <Text key={_id} style={{ ...t.typography.text.md, color: t.colors.text.primary }}>{text}</Text>)}
        <View style={{ height: spacing(6) }} />
        <Link href="/style-demo" asChild>
          <Button label="Open Style Demo" />
        </Link>
      </View>
    </View>
  );
}
