import { createElement, MouseEvent, PureComponent } from "react";


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
        onMouseDown: this.onMouseDown,
      },
        createElement('div', {
          className: 'split-window-vertical-slider-line',
        })
      )
    );
  }
}
