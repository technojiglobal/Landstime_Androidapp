# Responsive Design Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   RESPONSIVE DESIGN SYSTEM ARCHITECTURE                 │
└─────────────────────────────────────────────────────────────────────────┘

                           ┌──────────────────┐
                           │  Device Screen   │
                           │   Dimensions     │
                           │  (375px - 1024px)│
                           └────────┬─────────┘
                                    │
                    ┌───────────────┴────────────────┐
                    │                                │
        ┌───────────▼──────────────┐    ┌───────────▼──────────────┐
        │ React Native             │    │  useWindowDimensions()   │
        │ Dimensions API           │    │  (built-in hook)         │
        └───────────┬──────────────┘    └───────────┬──────────────┘
                    │                               │
                    └───────────────────┬───────────┘
                                        │
                    ┌───────────────────▼────────────────┐
                    │   src/utils/responsive.js          │
                    │   (Core Responsive Utility)        │
                    │                                    │
                    │  ┌─────────────────────────────┐  │
                    │  │ useResponsive Hook          │  │
                    │  │  ├─ scaleWidth(size)        │  │
                    │  │  ├─ scaleHeight(size)       │  │
                    │  │  └─ clampWidth(size, margin)│  │
                    │  └─────────────────────────────┘  │
                    │                                    │
                    │  Reference Device: 430 x 932      │
                    │  (iPhone 14 Pro Max)               │
                    └────────┬─────────────────┬────────┘
                             │                 │
        ┌────────────────────┴─┐          ┌────┴──────────────────┐
        │                      │          │                       │
    ┌───▼───────┐  ┌──────────▼────┐  ┌──▼────────┐  ┌──────────▼───┐
    │Components │  │  Screens      │  │ Tailwind  │  │ Animations   │
    │           │  │               │  │ Classes   │  │              │
    │ TopAlert  │  │ Welcome 2,3,4 │  │ xs/sm/md/ │  │ Animated     │
    │ SavedCard │  │ Flats Screen  │  │ lg        │  │ Views        │
    │ VastuModal│  │ Property      │  │           │  │              │
    │ Voice Cmp │  │ Details       │  │ safe-x    │  │ useResponsive│
    │ RoomTabs  │  │ etc.          │  │ safe-y    │  │ for dynamic  │
    └───────────┘  └───────────────┘  └───────────┘  │ values       │
                                                      └──────────────┘
        │                   │                  │              │
        └───────────────────┴──────────────────┴──────────────┘
                            │
                    ┌───────▼────────┐
                    │  RESPONSIVE    │
                    │  APPLICATION   │
                    │                │
                    │  Adapts to:    │
                    │  ✓ iPhone SE   │
                    │  ✓ iPhone 14   │
                    │  ✓ Android 360+│
                    │  ✓ Tablets     │
                    │  ✓ Landscape   │
                    │  ✓ Safe Areas  │
                    └────────────────┘
```

---

## Component Hierarchy & Scaling

```
┌─────────────────────────────────────────────────────────────┐
│  Application Layer (Screens)                                │
├─────────────────────────────────────────────────────────────┤
│ ├─ Home Screen                                              │
│ ├─ Property Details                                         │
│ ├─ Search Results                                           │
│ └─ Settings/Profile                                         │
└─────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│  Component Layer (Reusable UI)                              │
├─────────────────────────────────────────────────────────────┤
│ ├─ TopAlert (scaled sizes)                                  │
│ ├─ SavedPropertyCard (scaled icons)                         │
│ ├─ VastuModal (scaled modal + items)                        │
│ ├─ Voice Component (scaled buttons + text)                  │
│ └─ RoomTabs (scaled icons + margins)                        │
└─────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│  Responsive Layer                                           │
├─────────────────────────────────────────────────────────────┤
│ ├─ useResponsive Hook                                       │
│ │  ├─ scaleWidth(size) → Proportional width scale           │
│ │  ├─ scaleHeight(size) → Proportional height scale         │
│ │  └─ clampWidth(size, margin) → Safe area clamping        │
│ │                                                            │
│ ├─ Tailwind Classes                                         │
│ │  ├─ xs/sm/md/lg breakpoints                              │
│ │  ├─ safe-x/safe-y utilities                               │
│ │  └─ Responsive spacing                                    │
│ │                                                            │
│ └─ Platform Detection                                       │
│    ├─ Android → 24px status bar                            │
│    └─ iOS → Notch/home indicator safe areas               │
└─────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│  Device Layer                                               │
├─────────────────────────────────────────────────────────────┤
│ ├─ Small: 360-375px (Galaxy S, iPhone SE)                  │
│ ├─ Medium: 390-430px (iPhone 14, most phones)              │
│ ├─ Large: 600-900px (Tablets, foldables)                   │
│ └─ Extra Large: 1024px+ (iPads, large tablets)             │
└─────────────────────────────────────────────────────────────┘
```

---

## Scaling Flow Diagram

```
┌──────────────────┐
│  Component Prop  │  ▶ fontSize: scaleWidth(16)
└────────┬─────────┘
         │
         ▼
    ┌─────────────────────────────────────────┐
    │  useResponsive Hook                     │
    │  ┌───────────────────────────────────┐  │
    │  │ Get window dimensions              │  │
    │  │ width = 390px (iPhone 14)          │  │
    │  │ height = 844px                     │  │
    │  └───────────────────────────────────┘  │
    └────────┬────────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────────────┐
    │  Calculate Scale Factor                  │
    │  scaleWidth = 390 / 430 = 0.907          │
    │  scaleHeight = 844 / 932 = 0.906         │
    └────────┬─────────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────────────┐
    │  Apply Scaling                           │
    │  fontSize = 16 × 0.907 = 14.51           │
    └────────┬─────────────────────────────────┘
             │
             ▼
┌──────────────────┐
│  Rendered Value  │  ▶ fontSize: 14.51 (proportionally scaled)
└──────────────────┘


Device Size Comparison:
─────────────────────

iPhone SE (375px):     scaleWidth = 0.872 ▶ 16 × 0.872 = 13.95
iPhone 14 (390px):     scaleWidth = 0.907 ▶ 16 × 0.907 = 14.51
iPhone 14 PM (430px):  scaleWidth = 1.000 ▶ 16 × 1.000 = 16.00 ✓ Reference
Galaxy S21 (360px):    scaleWidth = 0.837 ▶ 16 × 0.837 = 13.40
iPad (1024px):         scaleWidth = 2.381 ▶ 16 × 2.381 = 38.06
```

---

## Safe Area Handling

```
┌─────────────────────────────────────────────────────────────┐
│  Without Safe Area Awareness (❌ Bad)                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [  NOTCH  ]                                        │   │
│  │  Content might be hidden behind notch              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│  With Safe Area Awareness (✓ Good)                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [  NOTCH  ]                                         │   │
│  │ ┌────────────────────────────────────────────────┐  │   │
│  │ │  Content is safely positioned                 │  │   │
│  │ │  Uses clampWidth() and safe-x/safe-y         │  │   │
│  │ │  Respects both top and bottom safe areas      │  │   │
│  │ └────────────────────────────────────────────────┘  │   │
│  │                                                     │   │
│  │                         [  HOME INDICATOR  ]       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Usage Pattern

```javascript
// Step 1: Import the hook
import { useResponsive } from "../../utils/responsive";

// Step 2: Use in component
export default function MyComponent() {
  const { scaleWidth, scaleHeight, clampWidth } = useResponsive();
  
  return (
    <View style={{
      // Step 3: Apply scaling to all sized properties
      width: clampWidth(330, 24),        // Container width with margins
      height: scaleHeight(200),          // Height scales with device
      padding: scaleWidth(16),           // Padding scales with device width
      borderRadius: scaleWidth(16),      // Border radius scales
      marginLeft: scaleWidth(12),        // Margins scale
    }}>
      <Text style={{
        fontSize: scaleWidth(16),        // Font size scales
        lineHeight: scaleHeight(24),     // Line height scales
        marginBottom: scaleHeight(12),   // Bottom margin scales
      }}>
        Responsive Text
      </Text>
    </View>
  );
}
```

---

**Architecture Updated**: December 5, 2025  
**Status**: Production Ready ✅
