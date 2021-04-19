import React, { useState } from 'react';
import { render } from 'react-dom';
import {
  Badge,
  Button,
  Col,
  Container,
  Divider,
  Grid,
  Input,
  Row,
  Table,
  Textarea,
} from './components';
import './constants/styles/common.scss';
import {
  headerList,
  headerKeyList,
  stickyHeaderList,
  stickyHeaderKeyList,
  gridHeaderList,
  gridHeaderKeyList,
  tableData,
} from './constants/mock';

export interface Props {
  name?: string;
}

function App({ name }: Props) {
  const [user, setUser] = useState();
  const [tData, setTData] = useState(
    tableData.map((data, order) => ({ ...data, order: order + 1 })),
  );
  return (
    <Container>
      <Badge label="Start" />
      <Divider />
      <Row>
        <Col>
          <Input value={user} onChange={setUser} placeholder="enter user..." />
          <Input
            value={user}
            onChange={setUser}
            placeholder="enter password..."
          />
        </Col>
        <Col>
          <Textarea
            rows={3}
            value={user}
            onChange={setUser}
            placeholder="enter user..."
          />
        </Col>
        <Col>
          <Button.Group>
            <Button elevated label="Option1" />
            <Button elevated label="Option2" />
            <Button elevated disabled label="Option3" />
          </Button.Group>
        </Col>
      </Row>
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
      <Divider />
      {/* <Table
        headerList={headerList}
        headerKeyList={headerKeyList}
        data={tData}
        onChange={setTData}
      /> */}
      <Grid
        data={tData}
        onChange={setTData}
        stickyHeaderList={stickyHeaderList}
        stickyHeaderKeyList={stickyHeaderKeyList}
        headerList={gridHeaderList}
        headerKeyList={gridHeaderKeyList}
      />
    </Container>
  );
}

render(<App />, document.getElementById('root'));
