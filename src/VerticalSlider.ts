import { createElement, SFC } from "react";


type Props = {}

export const VerticalSlider: SFC<Props> = () => (
  createElement('div', {
    className: 'split-window-vertical-slider'
  },
    createElement('div', {
      className: 'split-window-vertical-slider-line',
    })
  )
);
