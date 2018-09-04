import React from 'react';
import { render } from 'react-dom';
import Window from '../../src';
import './reset';
import '../../src/style';
import './style';


render((
  <Window>
    {[
      <div className="window" key="one">One</div>,
      [
        <div className="window" key="two">Two</div>,
        <div className="window" key="three">Three</div>,
        [
          <div className="window" key="four">Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four Four </div>,
          <div className="window" key="five">Five</div>,
          <div className="window" key="six">Six</div>,
        ]
      ]
    ]}
  </Window>
), document.getElementById('root'));
