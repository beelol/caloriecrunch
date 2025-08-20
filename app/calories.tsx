import React, { useState } from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTheme, spacing } from "@/app/styleGuide";
import Button from "@/app/components/Button";
import TextInput from "@/app/components/TextInput";
import { Id } from "@/convex/_generated/dataModel";

export default function CaloriesPage() {
  const t = useTheme();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Queries
  const todayEntries = useQuery(api.foodEntries.getByDate, {
    date: selectedDate,
  });
  const totalCalories = useQuery(api.foodEntries.getTotalCaloriesByDate, {
    date: selectedDate,
  });

  // Get last 7 days for previous days view
  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const previousDays = useQuery(api.foodEntries.getByDateRange, {
    startDate,
    endDate,
  });

  // Mutations
  const addFood = useMutation(api.foodEntries.add);
  const removeFood = useMutation(api.foodEntries.remove);

  const handleAddFood = async () => {
    if (!foodName.trim() || !calories.trim()) {
      Alert.alert("Error", "Please enter both food name and calories");
      return;
    }

    const calorieNum = parseInt(calories);
    if (isNaN(calorieNum) || calorieNum <= 0) {
      Alert.alert("Error", "Please enter a valid number of calories");
      return;
    }

    try {
      await addFood({
        name: foodName.trim(),
        calories: calorieNum,
        date: selectedDate,
      });
      setFoodName("");
      setCalories("");
      setShowAddForm(false);
    } catch (error) {
      Alert.alert("Error", "Failed to add food entry");
    }
  };

  const handleRemoveFood = async (id: Id<"foodEntries">) => {
    try {
      await removeFood({ id });
    } catch (error) {
      Alert.alert("Error", "Failed to remove food entry");
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().split("T")[0];
    return dateStr === today;
  };

  const goToPreviousDay = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);
    setSelectedDate(currentDate.toISOString().split("T")[0]);
  };

  const goToNextDay = () => {
    const currentDate = new Date(selectedDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (currentDate < tomorrow) {
      currentDate.setDate(currentDate.getDate() + 1);
      setSelectedDate(currentDate.toISOString().split("T")[0]);
    }
  };

  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: t.colors.background,
      }}
      contentContainerStyle={{ padding: spacing(4) }}
    >
      {/* Header */}
      <View style={{ marginBottom: spacing(6) }}>
        <Text
          style={[
            t.typography.heading.lg,
            { color: t.colors.text.primary, textAlign: "center" },
          ]}
        >
          Calorie Tracker
        </Text>
      </View>

      {/* Date Navigation */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: spacing(4),
          padding: spacing(3),
          backgroundColor: t.colors.neutral[50],
          borderRadius: 12,
        }}
      >
        <TouchableOpacity
          onPress={goToPreviousDay}
          style={{
            padding: spacing(2),
            backgroundColor: t.colors.primary[500],
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>←</Text>
        </TouchableOpacity>

        <View style={{ alignItems: "center" }}>
          <Text
            style={[
              t.typography.text.lg,
              { color: t.colors.text.primary, fontWeight: "bold" },
            ]}
          >
            {isToday(selectedDate) ? "Today" : formatDate(selectedDate)}
          </Text>
          {!isToday(selectedDate) && (
            <TouchableOpacity onPress={goToToday}>
              <Text
                style={[
                  t.typography.text.sm,
                  { color: t.colors.primary[500], marginTop: 2 },
                ]}
              >
                Go to Today
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          onPress={goToNextDay}
          style={{
            padding: spacing(2),
            backgroundColor:
              selectedDate >= new Date().toISOString().split("T")[0]
                ? t.colors.neutral[300]
                : t.colors.primary[500],
            borderRadius: 8,
          }}
          disabled={selectedDate >= new Date().toISOString().split("T")[0]}
        >
          <Text
            style={{
              color:
                selectedDate >= new Date().toISOString().split("T")[0]
                  ? t.colors.neutral[500]
                  : "white",
              fontWeight: "bold",
            }}
          >
            →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Total Calories for Selected Day */}
      <View
        style={{
          backgroundColor: t.colors.primary[500],
          padding: spacing(4),
          borderRadius: 12,
          marginBottom: spacing(4),
          alignItems: "center",
        }}
      >
        <Text
          style={[
            t.typography.text.sm,
            { color: "white", marginBottom: spacing(1) },
          ]}
        >
          Total Calories
        </Text>
        <Text
          style={[
            t.typography.heading.xl,
            { color: "white", fontWeight: "bold" },
          ]}
        >
          {totalCalories || 0}
        </Text>
      </View>

      {/* Add Food Section */}
      <View style={{ marginBottom: spacing(6) }}>
        {!showAddForm ? (
          <Button
            label="Add Food"
            onPress={() => setShowAddForm(true)}
            style={{ marginBottom: spacing(3) }}
          />
        ) : (
          <View
            style={{
              backgroundColor: t.colors.neutral[50],
              padding: spacing(4),
              borderRadius: 12,
              marginBottom: spacing(3),
            }}
          >
            <Text
              style={[
                t.typography.text.md,
                {
                  color: t.colors.text.primary,
                  marginBottom: spacing(3),
                  fontWeight: "bold",
                },
              ]}
            >
              Add Food Entry
            </Text>

            <TextInput
              label="Food Name"
              value={foodName}
              onChangeText={setFoodName}
              placeholder="e.g. Apple, Pizza slice, etc."
              containerStyle={{ marginBottom: spacing(3) }}
            />

            <TextInput
              label="Calories"
              value={calories}
              onChangeText={setCalories}
              placeholder="e.g. 150"
              keyboardType="numeric"
              containerStyle={{ marginBottom: spacing(4) }}
            />

            <View style={{ flexDirection: "row", gap: spacing(2) }}>
              <Button
                label="Cancel"
                variant="outline"
                tone="neutral"
                onPress={() => {
                  setShowAddForm(false);
                  setFoodName("");
                  setCalories("");
                }}
                style={{ flex: 1 }}
              />
              <Button label="Add" onPress={handleAddFood} style={{ flex: 1 }} />
            </View>
          </View>
        )}
      </View>

      {/* Today's Food Entries */}
      <View style={{ marginBottom: spacing(6) }}>
        <Text
          style={[
            t.typography.heading.md,
            { color: t.colors.text.primary, marginBottom: spacing(3) },
          ]}
        >
          {isToday(selectedDate) ? "Today's" : "Day's"} Food Entries
        </Text>

        {todayEntries && todayEntries.length > 0 ? (
          todayEntries.map((entry: any) => (
            <View
              key={entry._id}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: spacing(3),
                backgroundColor: t.colors.neutral[50],
                borderRadius: 8,
                marginBottom: spacing(2),
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    t.typography.text.md,
                    { color: t.colors.text.primary, fontWeight: "500" },
                  ]}
                >
                  {entry.name}
                </Text>
                <Text
                  style={[
                    t.typography.text.sm,
                    { color: t.colors.text.secondary },
                  ]}
                >
                  {entry.calories} calories
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => handleRemoveFood(entry._id)}
                style={{
                  padding: spacing(1),
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: t.colors.danger[500], fontSize: 18 }}>
                  ×
                </Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View
            style={{
              padding: spacing(4),
              backgroundColor: t.colors.neutral[50],
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text
              style={[
                t.typography.text.md,
                { color: t.colors.text.secondary, textAlign: "center" },
              ]}
            >
              No food entries for this day
            </Text>
          </View>
        )}
      </View>

      {/* Previous Days Summary */}
      <View>
        <Text
          style={[
            t.typography.heading.md,
            { color: t.colors.text.primary, marginBottom: spacing(3) },
          ]}
        >
          Recent Days
        </Text>

        {previousDays && previousDays.length > 0 ? (
          previousDays.map((day: any) => (
            <TouchableOpacity
              key={day.date}
              onPress={() => setSelectedDate(day.date)}
              style={{
                padding: spacing(3),
                backgroundColor:
                  selectedDate === day.date
                    ? t.colors.primary[100]
                    : t.colors.neutral[50],
                borderRadius: 8,
                marginBottom: spacing(2),
                borderWidth: selectedDate === day.date ? 2 : 0,
                borderColor:
                  selectedDate === day.date
                    ? t.colors.primary[500]
                    : "transparent",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text
                    style={[
                      t.typography.text.md,
                      {
                        color: t.colors.text.primary,
                        fontWeight: isToday(day.date) ? "bold" : "500",
                      },
                    ]}
                  >
                    {isToday(day.date) ? "Today" : formatDate(day.date)}
                  </Text>
                  <Text
                    style={[
                      t.typography.text.sm,
                      { color: t.colors.text.secondary },
                    ]}
                  >
                    {day.entries.length} food{" "}
                    {day.entries.length === 1 ? "entry" : "entries"}
                  </Text>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={[
                      t.typography.text.lg,
                      { color: t.colors.primary[500], fontWeight: "bold" },
                    ]}
                  >
                    {day.totalCalories}
                  </Text>
                  <Text
                    style={[
                      t.typography.text.sm,
                      { color: t.colors.text.secondary },
                    ]}
                  >
                    calories
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View
            style={{
              padding: spacing(4),
              backgroundColor: t.colors.neutral[50],
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text
              style={[
                t.typography.text.md,
                { color: t.colors.text.secondary, textAlign: "center" },
              ]}
            >
              No previous days data available
            </Text>
          </View>
        )}
      </View>

      {/* Bottom spacing */}
      <View style={{ height: spacing(8) }} />
    </ScrollView>
  );
}
