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
        <h1 className="window" key="first">One</h1>,
        [
          <h1 className="window" key="second">Two</h1>,
          [
            <h1 className="window" key="second.5">Two Point Five</h1>,
            <h1 className="window" key="second.6">Two Point Six</h1>,
            [
              <h1 className="window" key="second.7.1">Two Point Seven One</h1>,
              <h1 className="window" key="second.7.2">Two Point Seven Two</h1>
            ]
          ]
        ]
      ],
      <h1 className="window" key="third">Three</h1>,
    ]}
  </Window>
), document.getElementById('root'));
