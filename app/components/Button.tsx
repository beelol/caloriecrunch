import { useTheme } from '@/app/styleGuide';
import React from 'react';
import { Pressable, Text, ViewStyle } from 'react-native';

export interface ButtonProps {
  label: string;
  variant?: 'filled' | 'outline' | 'ghost';
  tone?: 'primary' | 'secondary' | 'danger' | 'success' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  onPress?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'filled',
  tone = 'primary',
  size = 'md',
  style,
  onPress,
  disabled,
}) => {
  const t = useTheme();
  const base = t.components.button.base;
  const sizeDef = t.components.button.sizes[size];
  const variantDef = t.components.button.variants[variant][tone];

  const containerStyle: ViewStyle = {
    ...base,
    ...sizeDef.container,
    ...variantDef,
    opacity: disabled ? t.opacity.disabled : 1,
  };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        containerStyle,
        pressed && !disabled && variant === 'filled' ? { opacity: 0.85 } : null,
        style,
      ]}
    >
      <Text style={[base.label, sizeDef.label, variantDef.label]}>{label}</Text>
    </Pressable>
  );
};

export default Button;
