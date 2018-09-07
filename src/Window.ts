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

  private mouseUp = () => this.setState({ sliding: null })

  private mouseMove = throttle((e: DocumentEventMap["mousemove"]) => {
    if (this.state.sliding === null) {
      return;
    }

    if (this.state.widths === null) {
      /*
      calculate width for all windows, essentially:
      map(pipe(
        this.getBoundingClientWidth,
        flip(subtract)(this.getSliderMargin)
      ))(windowRefs)
      */
      this.setState({
        widths: this.windowRefs.map((ref, idx, refs) => (
          (this.props.vertical ?
            ref.current!.getBoundingClientRect().height :
            ref.current!.getBoundingClientRect().width) -
          (idx === 0 || idx === refs.length -1 ? SLIDER_MARGIN : SLIDER_MARGIN * 2)
        ))
      });
    } else {
      /*
      sum widths of panels + sliders to left of slider, essentially:
      const cappedDelta = pipe(
        take(this.state.sliding),
        intersperce(SLIDER_WIDTH),
        reduce(sum),
        add(SLIDER_HALF_WIDTH, this.containerRef.current.getBoundingClientRect().left),
        subtract(e.clientX),
        if(
          capLeftWindowDelta,
          just(MIN_WIDTH - this.state.widths[this.state.sliding]),
          capRightWindowDelta
          just(this.state.widths[this.state.sliding + 1] - MIN_WIDTH),
          identity
        )
      )(this.state.widths)
      */
      let previousAbsoluteWidth = this.props.vertical ?
        this.containerRef.current!.getBoundingClientRect().top - SLIDER_HALF_WIDTH :
        this.containerRef.current!.getBoundingClientRect().left - SLIDER_HALF_WIDTH;

      for (let i = 0; i < this.state.widths.length; i++) {
        previousAbsoluteWidth += this.state.widths[i] + SLIDER_WIDTH;
        if (i === this.state.sliding) {
          break
        }
      }

      let delta = (this.props.vertical ? e.clientY : e.clientX) - previousAbsoluteWidth;

      if (this.state.widths[this.state.sliding] + delta < MIN_WIDTH) {
        delta = MIN_WIDTH - this.state.widths[this.state.sliding];
      } else if (this.state.widths[this.state.sliding + 1] - delta < MIN_WIDTH) {
        delta = this.state.widths[this.state.sliding + 1] - MIN_WIDTH;
      }

      this.state.widths[this.state.sliding] = this.state.widths[this.state.sliding] + delta;
      this.state.widths[this.state.sliding + 1] = this.state.widths[this.state.sliding + 1] - delta;

      this.setState({ widths: this.state.widths });
    }
  })

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

    const minWidth = intersperce(SLIDER_WIDTH, windows.map(just(MIN_WIDTH))).reduce(sum);

    return createElement('div', {
      className: 'react-window',
      ref: this.containerRef,
      style: this.props.vertical ? {
        gridTemplateRows: gridTemplate,
        gridTemplateColumns: '1fr',
        minHeight: minWidth,
      } : {
        gridTemplateColumns: gridTemplate,
        gridTemplateRows: '1fr',
        minWidth,
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

      /*
      use intersperceProject:
      pipe(map(createPane), intersperceProject(createSlider))(children);
      or transducer:
      this.createChildren = dropLast(1, transduce(
        addIndex(map)(juxt([createPane, createSlider])),
        concat, // or optimized: (result, components) => (result.push(...components), result),
        []
      ))
      or, if createSlider returns undefined on the last call, no need for dropLast
      */
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
