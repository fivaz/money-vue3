import { type Directive, type DirectiveBinding, type VNode } from 'vue'
import {
  computePosition,
  offset,
  flip,
  shift,
  arrow,
  type ComputePositionConfig,
} from '@floating-ui/dom'

// Tailwind color classes
const tailwindColor = {
  green: 'text-green-500 bg-green-50',
  red: 'text-red-500 bg-red-50',
  indigo: 'text-indigo-500 bg-indigo-50',
  yellow: 'text-yellow-500 bg-yellow-50',
} as const

// Type definitions
type Color = keyof typeof tailwindColor

interface TooltipOptions {
  text: string
  placement?: ComputePositionConfig['placement']
  color?: Color
}

type BindingValue = string | TooltipOptions

// Create and manage tooltip elements
function createTooltip(targetEl: HTMLElement, value: BindingValue) {
  const options = typeof value === 'string' ? { text: value, color: 'yellow' as Color } : value

  const tooltipEl = document.createElement('div')
  tooltipEl.role = 'tooltip'
  tooltipEl.innerHTML = options.text
  tooltipEl.className = `z-10 hidden w-max absolute top-0 left-0 text-sm rounded p-1.5 ${tailwindColor[options.color || 'yellow']}`

  const arrowEl = document.createElement('div')
  arrowEl.className = `absolute w-2 h-2 rotate-45 ${tailwindColor[options.color || 'yellow']}`

  tooltipEl.appendChild(arrowEl)
  targetEl.after(tooltipEl)

  return { tooltipEl, arrowEl, options }
}

async function updatePosition(
  targetEl: HTMLElement,
  tooltipEl: HTMLDivElement,
  arrowEl: HTMLDivElement,
  options: TooltipOptions,
) {
  const { x, y, placement, middlewareData } = await computePosition(targetEl, tooltipEl, {
    placement: options.placement || 'top',
    middleware: [offset(6), flip(), shift({ padding: 5 }), arrow({ element: arrowEl })],
  })

  Object.assign(tooltipEl.style, {
    left: `${x}px`,
    top: `${y}px`,
  })

  const { x: arrowX, y: arrowY } = middlewareData.arrow as { x: number; y: number }
  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[placement.split('-')[0]]

  Object.assign(arrowEl.style, {
    left: arrowX != null ? `${arrowX}px` : '',
    top: arrowY != null ? `${arrowY}px` : '',
    right: '',
    bottom: '',
    [staticSide || 'bottom']: '-4px',
  })
}

interface TooltipData {
  tooltipEl: HTMLDivElement
  showTooltip: () => void
  hideTooltip: () => void
}

// Directive definition
export const tooltipDirective: Directive = {
  mounted(el: HTMLElement & { __tooltip?: TooltipData }, binding: DirectiveBinding<BindingValue>) {
    const { tooltipEl, arrowEl, options } = createTooltip(el, binding.value)

    const showTooltip = () => {
      tooltipEl.style.display = 'block'
      void updatePosition(el, tooltipEl, arrowEl, options)
    }

    const hideTooltip = () => {
      tooltipEl.style.display = 'none'
    }

    // Store references and handlers on the element
    el.__tooltip = {
      tooltipEl,
      showTooltip,
      hideTooltip,
    }

    el.addEventListener('mouseenter', showTooltip)
    el.addEventListener('mouseleave', hideTooltip)
  },

  unmounted(el: HTMLElement & { __tooltip?: TooltipData }) {
    const tooltipData = el.__tooltip
    if (tooltipData) {
      el.removeEventListener('mouseenter', tooltipData.showTooltip)
      el.removeEventListener('mouseleave', tooltipData.hideTooltip)
      tooltipData.tooltipEl.remove()
      delete el.__tooltip
    }
  },
}
