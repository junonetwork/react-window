import { Component, createElement, ReactNode, createRef, RefObject } from "react";
import { throttle, intersperce, range, just, sum } from "./utils";
import Slider from './Slider';
import { SLIDER_WIDTH, SLIDER_HALF_WIDTH, MIN_WIDTH } from './config';


export type Props = {
  children: Array<ReactNode | ReactNode[]>
  vertical?: boolean
}

type State = {
  sliding: number | null,
  widths: number[] | null
}

type RefMap = Array<RefObject<HTMLDivElement>>


export default class Window extends Component<Props, State> {
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
    if (this.state.sliding === null) {
      return;
    }

    if (this.state.widths === null) {
      this.setState({
        widths: this.windowRefMap.map((ref) => {
          return this.props.vertical ?
            ref.current!.getBoundingClientRect().height :
            ref.current!.getBoundingClientRect().width;
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
      let previousAbsoluteWidth = this.props.vertical ?
        this.containerRef.current!.getBoundingClientRect().top - SLIDER_WIDTH :
        this.containerRef.current!.getBoundingClientRect().left - SLIDER_WIDTH;

      for (let i = 0; i < this.state.widths.length; i++) {
        previousAbsoluteWidth += this.state.widths[i] + SLIDER_WIDTH;
        if (i === this.state.sliding) {
          break
        }
      }

      const delta = (this.props.vertical ? e.clientY : e.clientX) - previousAbsoluteWidth - SLIDER_HALF_WIDTH;

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
  })

  private mouseUp = () => this.setState({ sliding: null })

  public render() {
    const windows = range(0, this.props.children.length);

    const gridTemplate = intersperce(
      `${SLIDER_WIDTH}px`,
      windows.map((index, idx) => (
        this.state.widths === null ?
          '1fr' :
        idx === this.state.widths.length - 1 ?
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
      className: 'react-window',
      ref: this.containerRef,
      style: {
        [this.props.vertical ? 'gridTemplateRows' : 'gridTemplateColumns']: gridTemplate,
        [this.props.vertical ? 'gridTemplateColumns' : 'gridTemplateRows']: '1',
        [this.props.vertical ? 'minHeight' : 'minWidth']: `${intersperce(SLIDER_WIDTH, windows.map(just(MIN_WIDTH))).reduce(sum)}px`,
      }
    }, ...this.props.children.reduce<ReactNode[]>((acc, child, idx, children) => {
      acc.push(
        createElement('div', {
          className: 'react-window-pane',
          ref: this.windowRefMap[idx],
        },
          Array.isArray(child) ?
            createElement(Window, {
              vertical: !this.props.vertical,
              children: child
            }) :
            createElement('div', {
              className: 'react-window-pane',
              ref: this.windowRefMap[idx],
            }, child)
        )
      );

      // TODO - use intersperceProject: pipe(map(createPane), intersperceProject(createSlider))(children);
      if (idx !== children.length - 1) {
        acc.push(
          createElement(Slider, {
            idx,
            vertical: this.props.vertical,
            onMouseDown: this.mouseDown
          })
        );
      }
      
      return acc;
    }, []));
  }
}