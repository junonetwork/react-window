# React Window

Draggable window management for react.


### Examples
```ts
import React from 'react';
import { render } from 'react-dom';
import Window from 'react-window';


render((
  <Window>
    {[
      <div className="window" key="one">One</div>,
      [
        <div className="window" key="two">Two</div>,
        <div className="window" key="three">Three</div>,
        [
          <div className="window" key="four">Four</div>,
          <div className="window" key="five">Five</div>,
          <div className="window" key="six">Six</div>,
        ]
      ]
    ]}
  </Window>
), document.getElementById('root'));
```

### Installation
```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run validate && npm run build
```
