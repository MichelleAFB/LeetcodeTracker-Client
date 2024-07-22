import React from "react";

import { Row, Col, Card, CardBody } from "reactstrap";

import "bootstrap/dist/css/bootstrap.min.css";

import { generateQuoteMap } from "./mockData";

import Board from "./Board";

export default function Drag() {
  const data = {
    medium: generateQuoteMap(100),
    large: generateQuoteMap(500)
  };

  return (
    <>
      <Row className="justify-content-center text-center">
        <Col xs={12}>
          <Card>
            <CardBody>
              <h2>React DnD Testing</h2>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Board initial={data.medium} withScrollableColumns />
    </>
  );
}
