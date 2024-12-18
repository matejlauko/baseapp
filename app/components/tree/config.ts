import {
  MeasuringStrategy,
  defaultDropAnimation,
  type DropAnimation,
  type PointerSensorOptions,
} from '@dnd-kit/core'
import type { AnimateLayoutChanges } from '@dnd-kit/sortable'

import { CSS } from '@dnd-kit/utilities'

export const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
}

export const dropAnimationConfig: DropAnimation = {
  keyframes({ transform }) {
    return [
      { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
      {
        opacity: 0,
        transform: CSS.Transform.toString({
          ...transform.final,
          x: transform.final.x + 5,
          y: transform.final.y + 5,
        }),
      },
    ]
  },
  easing: 'ease-out',
  sideEffects({ active }) {
    active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: defaultDropAnimation.duration,
      easing: defaultDropAnimation.easing,
    })
  },
}

export const animateLayoutChanges: AnimateLayoutChanges = ({ isSorting, wasDragging }) =>
  isSorting || wasDragging ? false : true

export const pointerSensorOptions: PointerSensorOptions = {
  activationConstraint: {
    distance: 10,
    // tolerance: 5,
    // delay: 100,
  },
}
