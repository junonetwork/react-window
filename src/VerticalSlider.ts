import { createElement, MouseEvent, PureComponent } from "react";
import { SLIDER_MARGIN, SLIDER_LINE } from "./config";


type Props = {
  idx: number
  onMouseDown(idx: number): void
}

export class VerticalSlider extends PureComponent<Props> {
  private onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onMouseDown(this.props.idx);
  }

  public render() {
    return (
      createElement('div', {
        className: 'split-window-vertical-slider',
        style: {
          padding: `0 ${SLIDER_MARGIN}px`,
        },
        onMouseDown: this.onMouseDown,
      },
        createElement('div', {
          className: 'split-window-vertical-slider-line',
          style: {
            borderLeftWidth: `${SLIDER_LINE}px`
          }
        })
      )
    );
  }
}
