import {
  ShoppingCart,
  HandCoins,
  Ambulance,
  ReceiptText,
  Home,
  Gift,
  Banknote,
  Wallet,
  Wrench,
  HandHeart,
  CalendarFold,
  Landmark,
  Dumbbell,
  PlugZap,
  Laptop,
  Globe,
  Stethoscope,
  TriangleAlert,
  FireExtinguisher,
  CircleAlert,
  ScanIcon, // Default icon
} from 'lucide-vue-next'

import type { Component } from 'vue'

export const iconComponents: Record<string, Component> = {
  'shopping-cart': ShoppingCart,
  'money coins': HandCoins,
  'heath ambulance': Ambulance,
  'receipt-text': ReceiptText,
  home: Home,
  'fun gift': Gift,
  money: Banknote,
  wallet: Wallet,
  'wrench setting repair': Wrench,
  'heart love give': HandHeart,
  'calendar year': CalendarFold,
  bank: Landmark,
  gym: Dumbbell,
  electricity: PlugZap,
  computer: Laptop,
  internet: Globe,
  heath: Stethoscope,
  accident: TriangleAlert,
  fire: FireExtinguisher,
  empty: ScanIcon,
} as const

export function getIcon(name: string = ''): Component {
  return (iconComponents[name] as Component) || iconComponents['empty']
}
