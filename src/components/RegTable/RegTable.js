/**
 * @author Donald Green <donald.green@medlmobile.com>
 */
import React, { Component } from 'react';
import {
  Badge,
  Card,
  CardHeader,
  CardBlock,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink
} from "reactstrap";

class RegTableCard extends Component {
  constructor() {
    super();
  }

  generateTableCell(dataKeys, cellData) {
    const tds = dataKeys.map((key, itr) => {
      if (key === 'status') {
        return (
          <td key={itr}>
            <Badge color="success">{cellData[key]}</Badge>
          </td>
        )
      }
      return (
        <td key={itr}>{cellData[key]}</td>
      );
    });

    return (
      <tr key={cellData.id}>
        {tds}
      </tr>
    );
  }

  /**
   * The props that are passed in as "data" should in the form of an Object Map where the key value
   * is the unqiue id of the object and the value is the object representation
   * @return {Array}
   */
  generateTableCells() {
    return Object.keys(this.props.data).map((id) => {
      const cellData = this.props.data[id];
      return this.generateTableCell(this.props.dataKeys, cellData);
    });
  }

  generateHeaderLabels() {
    return this.props.headerLabels.map((label) => {
      return <th key={label}>{ label }</th>;
    })
  }

  render() {
    return (
      <Table hover bordered striped responsive>
        <thead>
          <tr>
            { this.generateHeaderLabels() }
          </tr>
        </thead>
        <tbody>
          { this.generateTableCells() }
        </tbody>
      </Table>
    );
  }
}

export default RegTableCard;