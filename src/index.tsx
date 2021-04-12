import { render } from 'react-dom';
import React from 'react';

export interface Props {
  name?: string;
}

function App({ name }: Props) {
  return (
    <div className="hello">
      <div className="greeting">Hello {name}</div>
    </div>
  );
}

render(<App />, document.getElementById('root'));
