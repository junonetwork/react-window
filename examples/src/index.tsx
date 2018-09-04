import React from 'react';
import { render } from 'react-dom';
import Window from '../../src';
import './reset';
import '../../src/style';
import './style';


render((
  <Window>
    {[
      [
        <h1 className="window" key="one">One</h1>,
        <h1 className="window" key="two">Two</h1>,
        [
          <h1 className="window" key="three">Three</h1>,
          [
            <h1 className="window" key="three.1">Three Point One</h1>,
            <h1 className="window" key="three.2">Three Point Two</h1>,
          ]
        ]
      ],
      <h1 className="window" key="four">Four</h1>,
    ]}
  </Window>
), document.getElementById('root'));
