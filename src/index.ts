import { Component, createElement, ReactNode } from "react";
import { throttle, intersperce, range, just } from "./utils";
import { VerticalSlider } from "./VerticalSlider";


// TODO
const shallowEquals = <T>(a: T, b: T) => a === b;


type Props = {
  children: ReactNode[]
}

type State = {

}


export default class SplitWindow extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    document.addEventListener('mousemove', this.mouseMove);
  }

  public componentWillUnmount() {
    document.removeEventListener('mousemove', this.mouseMove);
  }

  public shouldComponentUpdate(next: Props) {
    return !shallowEquals(this.props, next);
  }

  private mouseMove = throttle((e: DocumentEventMap["mousemove"]) => {
    console.log(e.clientX);
  })

  public render() {
    return createElement('div', {
      className: 'split-window',
      style: {
        gridTemplateColumns: intersperce('11px', range(0, this.props.children.length).map(just('1fr'))).join(' '),
        gridTemplateRows: '1',
      }
    }, ...this.props.children.reduce<ReactNode[]>((acc, child, idx, children) => {
      if (idx === children.length - 1) {
        acc.push(createElement('div', {}, child));
      } else {
        acc.push(
          createElement('div', {}, child),
          createElement(VerticalSlider)
        );
      }
      
      return acc;
    }, []));
  }
}
