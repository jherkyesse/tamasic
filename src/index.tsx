import React, { useState } from 'react';
import { render } from 'react-dom';
import { Badge, Button, Divider, Input } from './components';
import './constants/styles/common.scss';

export interface Props {
  name?: string;
}

function App({ name }: Props) {
  const [user, setUser] = useState();
  return (
    <div>
      <Badge label="Start" />
      <Divider />
      <Button label="Submit" color="pink" />
      <Button label="Delete" color="red" />
      <Button label="Info" color="blue" />
      <Button label="Confirm" color="green" />
      <Button label="Warning" color="orange" />
      <Button outline label="Cancel" color="red" />
      <Button disabled label="Query" color="blue" />
      <Button disabled label="Export" color="green" />
      <Button disabled label="Open" color="yellow" />
      <Button disabled outline label="Create pipeline" color="red" />
      <Button elevated label="Learn more" />
      <Button elevated outline label="Learn more" />
      <Button.Group>
        <Button label="Option1" color="red" />
        <Button label="Option2" color="red" />
        <Button disabled label="Option3" color="red" />
      </Button.Group>
      <Input value={user} onChange={setUser} />
    </div>
  );
}

render(<App />, document.getElementById('root'));
