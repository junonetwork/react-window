import { Component, createElement, ReactNode, createRef, Ref, RefObject } from "react";
import { throttle, intersperce, range } from "./utils";
import { VerticalSlider } from "./VerticalSlider";


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
        // sum widths of panels + sliders to left of slider
        let previousAbsoluteWidth = this.containerRef.current!.getBoundingClientRect().left - 6;
        for (let i = 0; i < this.state.widths.length; i++) {
          previousAbsoluteWidth += this.state.widths[i] + 11;
          if (i === this.state.sliding) {
            break
          }
        }

        const delta = e.clientX - previousAbsoluteWidth;

        this.state.widths[this.state.sliding] = this.state.widths[this.state.sliding] + delta
        this.state.widths[this.state.sliding + 1] = this.state.widths[this.state.sliding + 1] - delta
        this.setState({ widths: this.state.widths });
      }
    }
  })

  private mouseUp = () => this.setState({ sliding: null })

  public render() {
    const windows = range(0, this.props.children.length);

    const gridTemplateColumns = intersperce(
      '11px',
      windows.map((index) => (
        this.state.widths === null ?
          '1fr' : // TODO - should last window always be 1fr?
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
