import { Component, createElement, ReactNode, createRef, RefObject } from "react";
import { throttle, intersperce, range, just, sum } from "./utils";
import { VerticalSlider } from './VerticalSlider';
import { SLIDER_WIDTH, SLIDER_HALF_WIDTH, MIN_WIDTH } from './config';


export type Props = {
  children: ReactNode[]
}

type State = {
  sliding: number | null,
  widths: number[] | null
}

type RefMap = Array<RefObject<HTMLDivElement>>


export default class SplitWindow extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    document.addEventListener('mousemove', this.mouseMove);
    document.addEventListener('mouseup', this.mouseUp);
  }

  public componentWillUnmount() {
    document.removeEventListener('mousemove', this.mouseMove);
    document.removeEventListener('mouseup', this.mouseUp);
  }

  public state: State = { sliding: null, widths: null }

  private containerRef: RefObject<HTMLDivElement> = createRef()

  private windowRefMap: RefMap = []

  private mouseDown = (idx: number) => this.setState({ sliding: idx })

  private mouseMove = throttle((e: DocumentEventMap["mousemove"]) => {
    if (this.state.sliding !== null) {
      if (this.state.widths === null) {
        this.setState({
          widths: this.windowRefMap.map((ref) => {
            return ref.current!.getBoundingClientRect().width;
          })
        });
      } else {
        /*
        // sum widths of panels + sliders to left of slider, essentially:
        pipe(
          take(this.state.sliding),
          intersperce(SLIDER_WIDTH),
          reduce(sum),
          add(SLIDER_HALF_WIDTH)
          add(this.containerRef.current!.getBoundingClientRect().left)
        )(this.state.widths)
        */
        let previousAbsoluteWidth = this.containerRef.current!.getBoundingClientRect().left - SLIDER_WIDTH;
        for (let i = 0; i < this.state.widths.length; i++) {
          previousAbsoluteWidth += this.state.widths[i] + SLIDER_WIDTH;
          if (i === this.state.sliding) {
            break
          }
        }

        const delta = e.clientX - previousAbsoluteWidth - SLIDER_HALF_WIDTH;

        if (this.state.widths[this.state.sliding] + delta < MIN_WIDTH) {
          const cappedDelta = MIN_WIDTH - this.state.widths[this.state.sliding];
          this.state.widths[this.state.sliding] = this.state.widths[this.state.sliding] + cappedDelta;
          this.state.widths[this.state.sliding + 1] = this.state.widths[this.state.sliding + 1] - cappedDelta;
          this.setState({ widths: this.state.widths });
        } else if (this.state.widths[this.state.sliding + 1] - delta < MIN_WIDTH) {
          const cappedDelta = this.state.widths[this.state.sliding + 1] - MIN_WIDTH;
          this.state.widths[this.state.sliding] = this.state.widths[this.state.sliding] + cappedDelta;
          this.state.widths[this.state.sliding + 1] = this.state.widths[this.state.sliding + 1] - cappedDelta;
          this.setState({ widths: this.state.widths });
        } else {
          this.state.widths[this.state.sliding] = this.state.widths[this.state.sliding] + delta;
          this.state.widths[this.state.sliding + 1] = this.state.widths[this.state.sliding + 1] - delta;
          this.setState({ widths: this.state.widths });
        }
      }
    }
  })

  private mouseUp = () => this.setState({ sliding: null })

  public render() {
    const windows = range(0, this.props.children.length);

    const gridTemplateColumns = intersperce(
      `${SLIDER_WIDTH}px`,
      windows.map((index) => (
        this.state.widths === null ?
          '1fr' :
          `${this.state.widths[index]}px`
        ))
    ).join(' ');

    windows.forEach((index) => {
      if (!this.windowRefMap[index]) {
        this.windowRefMap[index] = createRef()
      }
    });

    return createElement('div', {
      className: 'split-window',
      ref: this.containerRef,
      style: {
        gridTemplateColumns,
        gridTemplateRows: '1',
        minWidth: `${intersperce(SLIDER_WIDTH, windows.map(just(MIN_WIDTH))).reduce(sum)}px`,
      }
    }, ...this.props.children.reduce<ReactNode[]>((acc, child, idx, children) => {
      if (idx === children.length - 1) {
        acc.push(createElement('div', {
          className: 'split-window-pane',
          ref: this.windowRefMap[idx],
        }, child));
      } else {
        acc.push(
          createElement('div', {
            className: 'split-window-pane',
            ref: this.windowRefMap[idx],
          }, child),
          createElement(VerticalSlider, {
            idx,
            onMouseDown: this.mouseDown
          })
        );
      }
      
      return acc;
    }, []));
  }
}
