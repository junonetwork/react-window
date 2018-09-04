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
        <div className="window">One</div>,
        <div className="window">Two</div>,
        [
          <div className="window" key="three">Three</div>,
          [
            <div className="window" key="three.1">Three Point One</div>,
            <div className="window" key="three.2">Three Point Two Three Point Two Three Point Two Three Point Two Three Point Two Three Point Two Three Point Two Three Point Two Three Point Two Three Point Two Three Point Two Three Point Two Three Point Two Three Point Two Three Point Two Three Point Two Three Point Two Three Point Two Three Point Two Three Point Two Three Point Two</div>,
          ]
        ]
      ],
      <div className="window" key="four">Four</div>,
    ]}
  </Window>
), document.getElementById('root'));
