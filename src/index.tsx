import React, { useState } from 'react';
import { render } from 'react-dom';
import { Badge, Divider, Input } from './components';
import './constants/styles/common.scss';

export interface Props {
  name?: string;
}

function App({ name }: Props) {
  const [user, setUser]  =useState();
  return (
    <div>
      <Badge label="Start" />
      <Divider />
      <Input value={user} onChange={setUser} />
    </div>
  );
}

render(<App />, document.getElementById('root'));
