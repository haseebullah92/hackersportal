/**
 * Copyright Schrodinger, LLC
 */

const { Cell } = require('fixed-data-table-2');
const React = require('react');
const ReactTooltip = require('react-tooltip');

class CollapseCell extends React.PureComponent {
  render() {
    const {
      data,
      rowIndex,
      columnKey,
      collapsedRows,
      callback,
      ...props
    } = this.props;
    return (
      <Cell {...props}>
        <a onClick={() => callback(rowIndex)}>
          {collapsedRows.has(rowIndex) ? '\u25BC' : '\u25BA'}
        </a>
      </Cell>
    );
  }
}
module.exports.CollapseCell = CollapseCell;

class ColoredTextCell extends React.PureComponent {
  constructor(props) {
    super(props);
    this.colorizeText = this.colorizeText.bind(this);
  }

  colorizeText = (str, index) => {
    let val;
    let n = 0;
    return str.split('').map((letter) => {
      val = index * (70 + (n += 1));
      const color = `hsl(${val}, 100%, 50%)`;
      return (
        <span style={{ color }} key={val}>
          {letter}
        </span>
      );
    });
  };

  render() {
    const {
      data, rowIndex, columnKey, ...props
    } = this.props;
    return (
      <Cell {...props}>
        {this.colorizeText(data.getObjectAt(rowIndex)[columnKey], rowIndex)}
      </Cell>
    );
  }
}
module.exports.ColoredTextCell = ColoredTextCell;

class DateCell extends React.PureComponent {
  render() {
    const {
      data, rowIndex, columnKey, ...props
    } = this.props;
    return (
      <Cell {...props}>
        {data.getObjectAt(rowIndex)[columnKey].toLocaleString()}
      </Cell>
    );
  }
}
module.exports.DateCell = DateCell;

class LinkCell extends React.PureComponent {
  render() {
    const {
      data, rowIndex, columnKey, ...props
    } = this.props;
    return (
      <Cell {...props}>
        <a href='#'>{data.getObjectAt(rowIndex)[columnKey]}</a>
      </Cell>
    );
  }
}
module.exports.LinkCell = LinkCell;

class PendingCell extends React.PureComponent {
  render() {
    const {
      data, rowIndex, columnKey, dataVersion, ...props
    } = this.props;
    const rowObject = data.getObjectAt(rowIndex);
    return (
      <Cell {...props}>{rowObject ? rowObject[columnKey] : 'pending'}</Cell>
    );
  }
}
const PagedCell = ({ data, ...props }) => {
  const dataVersion = data.getDataVersion();
  return <PendingCell data={data} dataVersion={dataVersion} {...props} />;
};
module.exports.PagedCell = PagedCell;

class RemovableHeaderCell extends React.PureComponent {
  render() {
    const {
      data,
      rowIndex,
      columnKey,
      callback,
      children,
      ...props
    } = this.props;
    return (
      <Cell {...props}>
        {children}
        <a style={{ float: 'right' }} onClick={() => callback(columnKey)}>
          {'\u274C'}
        </a>
      </Cell>
    );
  }
}
module.exports.RemovableHeaderCell = RemovableHeaderCell;

class TextCell extends React.PureComponent {
  render() {
    const {
      data, rowIndex, columnKey, ...props
    } = this.props;
    return <Cell {...props}>{data.getObjectAt(rowIndex)[columnKey]}</Cell>;
  }
}
module.exports.TextCell = TextCell;

class TooltipCell extends React.PureComponent {
  render() {
    const {
      data, rowIndex, columnKey, ...props
    } = this.props;
    const value = data.getObjectAt(rowIndex)[columnKey];
    return (
      <Cell
        {...props}
        onMouseEnter={() => {
          ReactTooltip.show();
        }}
        onMouseLeave={() => {
          ReactTooltip.hide();
        }}
      >
        <div ref='valueDiv' data-tip={value}>
          {value}
        </div>
      </Cell>
    );
  }
}
module.exports.TooltipCell = TooltipCell;
