import React from 'react';
import { render } from 'react-dom';
import SplitWindow from '../../src';
import './reset';
import '../../src/style';
import './style';


render((
  <SplitWindow>
    {[
      <h1 className="window" key="first">One</h1>,
      <h1 className="window" key="second">Two</h1>,
      <h1 className="window" key="third">Three</h1>,
      <h1 className="window" key="fourth">Four</h1>,
    ]}
  </SplitWindow>
), document.getElementById('root'));
