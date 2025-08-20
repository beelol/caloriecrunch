import { useTheme } from "@/app/styleGuide";
import React from "react";
import {
  TextInput as RNTextInput,
  View,
  Text,
  TextInputProps,
  ViewStyle,
} from "react-native";

export interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  variant?: "default" | "outline";
}

export const TextInput: React.FC<CustomTextInputProps> = ({
  label,
  error,
  containerStyle,
  variant = "outline",
  style,
  ...props
}) => {
  const t = useTheme();

  const inputStyle = {
    borderWidth: 1,
    borderColor: error ? t.colors.danger[500] : t.colors.border,
    backgroundColor: t.colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: t.colors.text.primary,
    fontFamily: t.typography.text.md.fontFamily,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  };

  return (
    <View style={containerStyle}>
      {label && (
        <Text
          style={[
            t.typography.text.sm,
            {
              color: t.colors.text.primary,
              marginBottom: 8,
              fontWeight: "600",
            },
          ]}
        >
          {label}
        </Text>
      )}
      <RNTextInput
        style={[inputStyle, style]}
        placeholderTextColor={t.colors.text.secondary}
        {...props}
      />
      {error && (
        <Text
          style={[
            t.typography.text.sm,
            {
              color: t.colors.danger[500],
              marginTop: 6,
              fontWeight: "500",
            },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

export default TextInput;
