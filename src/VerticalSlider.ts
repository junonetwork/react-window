import { createElement, SFC } from "react";


type Props = {}

export const VerticalSlider: SFC<Props> = () => (
  createElement('div', {
    style: {
      className: 'split-window-vertical-slider',
      padding: '0 5px',
      backgroundColor: '#ddd',
    },
  }, createElement('div', {
    style: {
      className: 'split-window-vertical-slider-line',
      borderLeft: '1px solid #bbb',
      height: '100%',
    },
  }))
);
