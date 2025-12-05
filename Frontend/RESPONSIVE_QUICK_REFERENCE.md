# Responsive Design Quick Reference

## Import & Use
```jsx
import { useResponsive } from "../../utils/responsive";

const { scaleWidth, scaleHeight, clampWidth } = useResponsive();
```

## Function Reference

### `scaleWidth(size: number) → number`
Scales a size proportionally to device width (reference: 430px)
```jsx
fontSize: scaleWidth(16)        // 16 on 430px, 12 on 320px, etc.
width: scaleWidth(200)
marginLeft: scaleWidth(12)
```

### `scaleHeight(size: number) → number`
Scales a size proportionally to device height (reference: 932px)
```jsx
height: scaleHeight(300)
marginTop: scaleHeight(20)
lineHeight: scaleHeight(28)
```

### `clampWidth(size: number, margin: number = 20) → number`
Scales width but limits to screen width minus safe margins
```jsx
width: clampWidth(330, 24)  // Max 330px with 24px padding on each side
```

---

## Component Patterns

### Basic Responsive Box
```jsx
<View style={{
  width: clampWidth(330, 24),
  height: scaleHeight(200),
  padding: scaleWidth(16),
  borderRadius: scaleWidth(16),
}}>
  <Text style={{ fontSize: scaleWidth(16), lineHeight: scaleHeight(24) }}>
    Content
  </Text>
</View>
```

### Responsive Icon
```jsx
<Image
  source={icon}
  style={{
    width: scaleWidth(24),
    height: scaleWidth(24),
    marginRight: scaleWidth(8),
  }}
  resizeMode="contain"
/>
```

### Responsive Button
```jsx
<TouchableOpacity
  style={{
    width: clampWidth(300, 32),
    height: scaleHeight(50),
    borderRadius: scaleWidth(25),
    backgroundColor: "#22C55E",
  }}
>
  <Text style={{ fontSize: scaleWidth(16), fontWeight: "600" }}>
    Button Text
  </Text>
</TouchableOpacity>
```

### Responsive Flex Row
```jsx
<View style={{
  flexDirection: "row",
  paddingHorizontal: scaleWidth(16),
  paddingVertical: scaleHeight(12),
  gap: scaleWidth(12),
}}>
  <Text style={{ fontSize: scaleWidth(14) }}>Item</Text>
</View>
```

---

## Tailwind Classes (NativeWind)

### Responsive Sizes
```jsx
className="
  xs:w-full xs:px-4      // Extra small phones
  sm:w-96 sm:px-6         // Small phones
  md:w-full md:px-8       // Tablets
  lg:w-1/2 lg:px-16       // Large tablets
"
```

### Safe Area
```jsx
className="px-safe-x py-safe-y"  // Respects notches/home indicators
```

### Responsive Text
```jsx
className="text-xs sm:text-sm md:text-base lg:text-lg"
```

---

## Device Dimensions Reference

| Device | Scale | Width | Height |
|--------|-------|-------|--------|
| iPhone SE | 0.87 | 375 | 667 |
| iPhone 14 | 0.91 | 390 | 844 |
| iPhone 14 PM | 1.0 | 430 | 932 |
| Galaxy S21 | 0.84 | 360 | 800 |
| iPad | 2.38+ | 1024+ | 1366+ |

---

## Common Mistakes ❌

```jsx
// DON'T: Hard-coded sizes
fontSize: 16
width: 200
padding: 12

// DO: Use responsive scaling
fontSize: scaleWidth(16)
width: scaleWidth(200)
padding: scaleWidth(12)
```

```jsx
// DON'T: Forget safe margins
width: '100%'  // Might overlap notch

// DO: Clamp width with margins
width: clampWidth(330, 24)
```

```jsx
// DON'T: Mix scaling approaches
style={{ width: 300 }}  // Hard-coded
className="md:w-96"     // Tailwind only

// DO: Combine for best results
className="px-4"        // NativeWind base
style={{
  width: clampWidth(330, 24),  // Scaled with clamps
  height: scaleHeight(200),
}}
```

---

## Testing Checklist

When adding new responsive components:
- [ ] Test on iPhone SE (375px)
- [ ] Test on iPhone 14 Pro Max (430px)
- [ ] Test on Android (360px - 390px)
- [ ] Test on tablet (1024px+)
- [ ] Verify landscape orientation
- [ ] Check safe areas (notches, home indicator)
- [ ] Confirm text readability at all sizes
- [ ] Verify touch targets are ≥44x44 pts

---

## File Locations

- **Responsive Hook**: `src/utils/responsive.js`
- **Tailwind Config**: `tailwind.config.js`
- **Full Guide**: `RESPONSIVE_DESIGN.md`

---

**Last Updated**: December 5, 2025
