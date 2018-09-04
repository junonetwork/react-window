import { Component, createElement, ReactNode, createRef, RefObject } from "react";
import { throttle, intersperce, range, just, sum } from "./utils";
import Slider from './Slider';
import { SLIDER_WIDTH, SLIDER_HALF_WIDTH, MIN_WIDTH, SLIDER_MARGIN } from './config';


export type Props = {
  children: Array<ReactNode | ReactNode[]>
  vertical?: boolean
}

type State = {
  sliding: number | null,
  widths: number[] | null
}


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

  private windowRefs: Array<RefObject<HTMLDivElement>> = []

  private mouseDown = (idx: number) => this.setState({ sliding: idx })

  private mouseMove = throttle((e: DocumentEventMap["mousemove"]) => {
    if (this.state.sliding === null) {
      return;
    }

    if (this.state.widths === null) {
      this.setState({
        widths: this.windowRefs.map((ref, idx, refs) => this.props.vertical ?
          ref.current!.getBoundingClientRect().height - (idx === 0 || idx === refs.length -1 ? SLIDER_MARGIN : SLIDER_MARGIN * 2):
          ref.current!.getBoundingClientRect().width - (idx === 0 || idx === refs.length -1 ? SLIDER_MARGIN : SLIDER_MARGIN * 2)
        )
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

    return createElement('div', {
      className: 'react-window',
      ref: this.containerRef,
      style: this.props.vertical ? {
        gridTemplateRows: gridTemplate,
        gridTemplateColumns: '1fr',
        minHeight: `${intersperce(SLIDER_WIDTH, windows.map(just(MIN_WIDTH))).reduce(sum)}px`,
      } : {
        gridTemplateColumns: gridTemplate,
        gridTemplateRows: '1fr',
        minWidth: `${intersperce(SLIDER_WIDTH, windows.map(just(MIN_WIDTH))).reduce(sum)}px`,
      }
    }, ...this.props.children.reduce<ReactNode[]>((acc, child, idx, children) => {
      this.windowRefs[idx] = createRef();

      acc.push(
        createElement('div', {
          className: 'react-window-pane',
          key: idx,
          style: this.props.vertical ? {
            marginBottom: idx !== children.length -1 ? -1 * SLIDER_MARGIN : undefined,
            marginTop: idx !== 0 ? -1 * SLIDER_MARGIN : undefined,
          } : {
            marginRight: idx !== children.length -1 ? -1 * SLIDER_MARGIN : undefined,
            marginLeft: idx !== 0 ? -1 * SLIDER_MARGIN : undefined,
          },
          ref: this.windowRefs[idx],
        },
          Array.isArray(child) ?
            createElement(Window, {
              vertical: !this.props.vertical,
              children: child
            }) :
            child
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
