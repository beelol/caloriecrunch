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
    borderColor: error ? t.colors.danger[500] : t.colors.neutral[300],
    backgroundColor: t.colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: t.colors.text.primary,
    fontFamily: t.typography.text.md.fontFamily,
  };

  return (
    <View style={containerStyle}>
      {label && (
        <Text
          style={[
            t.typography.text.sm,
            {
              color: t.colors.text.primary,
              marginBottom: 4,
              fontWeight: "500",
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
              marginTop: 4,
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
