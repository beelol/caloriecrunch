import Button from '@/app/components/Button';
import { spacing, useTheme, useThemedStyles, utility } from '@/app/styleGuide';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const useStyles = useThemedStyles(t => ({
  screen: { ...utility.screen(t), padding: spacing(4) },
  section: { marginBottom: spacing(6) },
  sectionTitle: { ...t.typography.heading.md, marginBottom: spacing(2), color: t.colors.text.primary },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing(2) } as any,
  swatch: { width: 64, height: 64, borderRadius: t.radii.md, marginRight: spacing(2), marginBottom: spacing(2), alignItems: 'center', justifyContent: 'center' },
  swatchLabel: { fontSize: 10, color: t.colors.text.inverted },
  card: { ...t.components.card.base, marginBottom: spacing(3) },
  badge: { paddingVertical: spacing(1), paddingHorizontal: spacing(2), borderRadius: t.radii.pill, marginRight: spacing(2), marginBottom: spacing(2) },
  badgeText: { fontSize: 12, fontWeight: '600' },
  mono: { ...t.typography.monospace, fontSize: 12, color: t.colors.text.muted },
}));

export default function StyleDemo() {
  const styles = useStyles();
  const t = useTheme();
  const colorGroups: Array<[string, any]> = [
    ['primary', t.colors.primary],
    ['secondary', t.colors.secondary],
    ['success', t.colors.success],
    ['warning', t.colors.warning],
    ['danger', t.colors.danger],
    ['info', t.colors.info],
  ];

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: spacing(12) }} style={styles.screen}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Buttons</Text>
        <View style={styles.row}>
          <Button label="Primary" />
          <Button label="Secondary" tone="secondary" />
          <Button label="Danger" tone="danger" />
          <Button label="Outline" variant="outline" />
          <Button label="Ghost" variant="ghost" />
          <Button label="Large" size="lg" />
          <Button label="Disabled" disabled />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Color Swatches</Text>
        {colorGroups.map(([name, scale]) => (
          <View key={name} style={{ marginBottom: spacing(2) }}>
            <Text style={{ ...t.typography.text.sm, marginBottom: spacing(1), color: t.colors.text.secondary }}>{name}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {Object.entries(scale).filter(([k]) => !['foreground'].includes(k)).map(([k, v]) => (
                <View key={k} style={[styles.swatch, { backgroundColor: v as string }]}> 
                  <Text style={styles.swatchLabel}>{k}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Typography</Text>
        <Text style={t.typography.heading.sm}>Heading sm</Text>
        <Text style={t.typography.heading.md}>Heading md</Text>
        <Text style={t.typography.heading.lg}>Heading lg</Text>
        <Text style={t.typography.heading.xl}>Heading xl</Text>
        <Text style={t.typography.heading["2xl"]}>Heading 2xl</Text>
        <View style={{ height: spacing(2) }} />
        <Text style={t.typography.text.xs}>Text xs</Text>
        <Text style={t.typography.text.sm}>Text sm</Text>
        <Text style={t.typography.text.md}>Text md</Text>
        <Text style={t.typography.text.lg}>Text lg</Text>
        <Text style={t.typography.text.xl}>Text xl</Text>
        <Text style={t.typography.text["2xl"]}>Text 2xl</Text>
        <Text style={t.typography.text["3xl"]}>Text 3xl</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cards</Text>
        <View style={t.components.card.base}>
          <Text style={t.typography.text.md}>Base Card</Text>
          <Text style={{ ...t.typography.text.sm, color: t.colors.text.secondary }}>Secondary text example</Text>
        </View>
        <View style={{ height: spacing(2) }} />
        <View style={t.components.card.elevated}>
          <Text style={t.typography.text.md}>Elevated Card</Text>
          <Text style={{ ...t.typography.text.sm, color: t.colors.text.secondary }}>Shadow + surface</Text>
        </View>
        <View style={{ height: spacing(2) }} />
        <View style={t.components.card.outlined}>
          <Text style={t.typography.text.md}>Outlined Card</Text>
          <Text style={{ ...t.typography.text.sm, color: t.colors.text.secondary }}>Border accent</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Badges</Text>
        <View style={styles.row}>
          {(['primary','secondary','success','warning','danger','info'] as const).map(tone => (
            <View key={tone} style={{ ...t.components.badge.base, ...t.components.badge.tones[tone] }}>
              <Text style={{ ...t.components.badge.base.label, ...t.components.badge.tones[tone].label }}>{tone}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tokens (sample)</Text>
        <Text style={styles.mono}>Spacing scale: {JSON.stringify(t.spacingScale)}</Text>
        <Text style={styles.mono}>Radii: {JSON.stringify(t.radii)}</Text>
      </View>
    </ScrollView>
  );
}
