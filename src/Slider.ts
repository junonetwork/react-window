import { createElement, MouseEvent, PureComponent } from "react";
import { SLIDER_MARGIN, SLIDER_LINE } from "./config";


type Props = {
  vertical?: boolean
  idx: number
  onMouseDown(idx: number): void
}

export default class Slider extends PureComponent<Props> {
  private onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onMouseDown(this.props.idx);
  }

  public render() {
    return (
      createElement('div', {
        className: 'react-window-slider',
        style: {
          padding: this.props.vertical ? `${SLIDER_MARGIN}px 0` : `0 ${SLIDER_MARGIN}px`,
          cursor: this.props.vertical ? 'row-resize' : 'col-resize',
        },
        onMouseDown: this.onMouseDown,
      },
        createElement('div', {
          className: 'react-window-slider-line',
          style: {
            [this.props.vertical ? 'borderTopWidth' : 'borderLeftWidth']: `${SLIDER_LINE}px`
          }
        })
      )
    );
  }
}
