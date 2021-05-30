import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { useLocalStorage } from 'react-use';
import {
  // Badge,
  Button,
  Col,
  Container,
  Divider,
  Dropdown,
  Grid,
  Input,
  // Padding,
  Row,
  Table,
  Textarea,
} from './components';
import './constants/styles/common.scss';
import { transformGridData, mapIndex } from './utils/helpers';
import {
  headerList,
  headerKeyList,
  stickyHeaderList,
  stickyHeaderKeyList,
  gridHeaderList,
  gridHeaderKeyList,
  tableData,
  gridData,
  prevGridData,
} from './constants/mock';
import { dropdownOptions } from './constants/dropdown.mock';

export interface Props {
  name?: string;
}

function App() {
  const [theme, setTheme] = useLocalStorage('theme', 'light', {
    raw: true,
  });
  const [user, setUser] = useState();
  const [option, setOption] = useState();
  const [tData, setTData] = useState(mapIndex(transformGridData(prevGridData)));
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);
  return (
    <Container>
      <Row>
        <Col>
          {/* <Badge label="Start" /> */}
          <Button onClick={toggleTheme} label={theme} />
        </Col>
      </Row>
      <Row>
        <Col>
          {/* <Badge label="Start" /> */}
          <Button onClick={toggleTheme} label={theme} />
        </Col>
      </Row>
      <Row>
        <Col>
          {/* <Badge label="Start" /> */}
          <Button onClick={toggleTheme} label={theme} />
        </Col>
      </Row>
      <Row>
        <Col>
          {/* <Badge label="Start" /> */}
          <Button onClick={toggleTheme} label={theme} />
        </Col>
      </Row>
      <Row>
        <Col>
          {/* <Badge label="Start" /> */}
          <Button onClick={toggleTheme} label={theme} />
        </Col>
      </Row>
      <Row>
        <Col>
          {/* <Badge label="Start" /> */}
          <Button onClick={toggleTheme} label={theme} />
        </Col>
      </Row>
      <Row>
        <Col>
          {/* <Badge label="Start" /> */}
          <Button onClick={toggleTheme} label={theme} />
        </Col>
      </Row>
      <Row>
        <Col>
          {/* <Badge label="Start" /> */}
          <Button onClick={toggleTheme} label={theme} />
        </Col>
      </Row>
      <Row>
        <Col>
          {/* <Badge label="Start" /> */}
          <Button onClick={toggleTheme} label={theme} />
        </Col>
      </Row>
      <Row>
        <Col>
          {/* <Badge label="Start" /> */}
          <Button onClick={toggleTheme} label={theme} />
        </Col>
      </Row>
      <Divider />
      {/* <Row> */}
        {/* <Col>
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
          {option}
          <Dropdown
            options={dropdownOptions}
            value={option}
            onChange={setOption}
            placeholder="Select a vtuber..."
          />
        </Col>
      </Row>
      <Divider />
      <Padding>
        <>
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
        </>
      </Padding>
      <Divider /> */}
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
      <Row>
        <Col>
          {/* <Badge label="Start" /> */}
          <Button onClick={toggleTheme} label={theme} />
        </Col>
      </Row>
      <Row>
        <Col>
          {/* <Badge label="Start" /> */}
          <Button onClick={toggleTheme} label={theme} />
        </Col>
      </Row>
      <Row>
        <Col>
          {/* <Badge label="Start" /> */}
          <Button onClick={toggleTheme} label={theme} />
        </Col>
      </Row>
      <Row>
        <Col>
          {/* <Badge label="Start" /> */}
          <Button onClick={toggleTheme} label={theme} />
        </Col>
      </Row>
      <Row>
        <Col>
          {/* <Badge label="Start" /> */}
          <Button onClick={toggleTheme} label={theme} />
        </Col>
      </Row>
      <Row>
        <Col>
          {/* <Badge label="Start" /> */}
          <Button onClick={toggleTheme} label={theme} />
        </Col>
      </Row>
      {/* <Badge label="moe moe q" />
      <Divider />
      <Badge label="moe moe q" />
      <Divider />
      <Badge label="moe moe q" />
      <Divider />
      <Padding>
        <Badge label="Ahoy! Ahoy! Ahoy! hoy! hoy! hoy!" />
      </Padding>
      <Divider />
      <Badge label="moe moe q" />
      <Badge label="moe moe q" />
      <Dropdown
        options={dropdownOptions}
        value={option}
        onChange={setOption}
        placeholder="Select a vtuber..."
      /> */}
    </Container>
  );
}

render(<App />, document.getElementById('root'));
