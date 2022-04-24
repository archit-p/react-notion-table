import React, { useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components'
import clsx from 'clsx';
import {
  useTable,
  useBlockLayout,
  useResizeColumns,
  useSortBy,
} from 'react-table';
import Cell from './Cell';
import Header from './Header';
import PlusIcon from './img/Plus';
import { ActionTypes } from './utils';
import { FixedSizeList } from 'react-window';
import scrollbarWidth from './scrollbarWidth';

const defaultColumn = {
  minWidth: 50,
  width: 150,
  maxWidth: 400,
  Cell: Cell,
  Header: Header,
  sortType: 'alphanumericFalsyLast',
};

const StyledTd = styled.div`
overflow: hidden;
color: #424242;
align-items: stretch;
padding: 0;
display: flex;
flex-direction: column;

white-space: nowrap;
margin: 0;
border-bottom: 1px solid #e0e0e0;
border-right: 1px solid #e0e0e0;
position: relative;
`

export default function Table({
  columns,
  data,
  dispatch: dataDispatch,
  skipReset,
}) {
  const sortTypes = useMemo(
    () => ({
      alphanumericFalsyLast(rowA, rowB, columnId, desc) {
        if (!rowA.values[columnId] && !rowB.values[columnId]) {
          return 0;
        }

        if (!rowA.values[columnId]) {
          return desc ? -1 : 1;
        }

        if (!rowB.values[columnId]) {
          return desc ? 1 : -1;
        }

        return isNaN(rowA.values[columnId])
          ? rowA.values[columnId].localeCompare(rowB.values[columnId])
          : rowA.values[columnId] - rowB.values[columnId];
      },
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    totalColumnsWidth,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      dataDispatch,
      autoResetSortBy: !skipReset,
      autoResetFilters: !skipReset,
      autoResetRowState: !skipReset,
      sortTypes,
    },
    useBlockLayout,
    useResizeColumns,
    useSortBy
  );

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <div {...row.getRowProps({ style })} className="tr">
          {row.cells.map(cell => (
            <StyledTd {...cell.getCellProps()} className="td">
              {cell.render('Cell')}
            </StyledTd>
          ))}
        </div>
      );
    },
    [prepareRow, rows]
  );

  function isTableResizing() {
    for (let headerGroup of headerGroups) {
      for (let column of headerGroup.headers) {
        if ((column as any).isResizing) {
          return true;
        }
      }
    }

    return false;
  }

  return (
    <>
      <div
        {...getTableProps()}
        className={clsx('table', isTableResizing() && 'noselect')}
      >
        <div>
          {headerGroups.map(headerGroup => (
            <div {...headerGroup.getHeaderGroupProps()} className="tr">
              {headerGroup.headers.map(column => column.render('Header'))}
            </div>
          ))}
        </div>
        <div {...getTableBodyProps()}>
          <FixedSizeList
            height={window.innerHeight - 100}
            itemCount={rows.length}
            itemSize={40}
            width={totalColumnsWidth + scrollbarWidth()}
          >
            {RenderRow}
          </FixedSizeList>
          <div
            className="tr add-row"
            onClick={() => dataDispatch({ type: ActionTypes.ADD_ROW })}
          >
            <span className="svg-icon svg-gray icon-margin">
              <PlusIcon />
            </span>
            New
          </div>
        </div>
      </div>
    </>
  );
}

export const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
html {
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

* {
  margin: 0px;
  padding: 0px;
  font-family: 'Inter', sans-serif;
}

#root {
  margin: 0px;
  padding: 0px;
}
`

export const StyledTable = styled(Table)`

.transition-fade-enter {
  opacity: 0;
}

.transition-fade-enter-active {
  opacity: 1;
  transition: opacity 300ms;
}

.transition-fade-exit {
  opacity: 1;
}

.transition-fade-exit-active {
  opacity: 0;
  transition: opacity 300ms;
}

.svg-icon svg {
  position: relative;
  height: 1.5em;
  width: 1.5em;
}

.svg-text svg {
  stroke: #424242;
}

.svg-180 svg {
  transform: rotate(180deg);
}

.form-input {
  padding: 0.375rem;
  background-color: #eeeeee;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #424242;
}

.form-input:focus {
  outline: none;
  box-shadow: 0 0 1px 2px #8ecae6;
}

.is-fullwidth {
  width: 100%;
}

.bg-white {
  background-color: white;
}

.data-input {
  white-space: pre-wrap;
  border: none;
  padding: 0.5rem;
  color: #424242;
  font-size: 1rem;
  border-radius: 4px;
  resize: none;
  background-color: white;
  box-sizing: border-box;
  flex: 1 1 auto;
}

.data-input:focus {
  outline: none;
}

.shadow-5 {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.12),
    0 4px 6px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.12),
    0 16px 32px rgba(0, 0, 0, 0.12);
}

.svg-icon-sm svg {
  position: relative;
  height: 1.25em;
  width: 1.25em;
}

.svg-gray svg {
  stroke: #9e9e9e;
}

.option-input {
  width: 100%;
  font-size: 1rem;
  border: none;
  background-color: transparent;
}

.option-input:focus {
  outline: none;
}

.noselect {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 2;
  overflow: hidden;
}

.sort-button {
  padding: 0.25rem 0.75rem;
  width: 100%;
  background-color: transparent;
  border: 0;
  font-size: 0.875rem;
  color: #757575;
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
}

.sort-button:hover {
  background-color: #eeeeee;
}

.tr:last-child .td {
  border-bottom: 0;
}

.add-row {
  color: #9e9e9e;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  cursor: pointer;
  height: 50px;
}

.add-row:hover {
  background-color: #f5f5f5;
}

.td {
  overflow: hidden;
  color: #424242;
  align-items: stretch;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.td-content {
  display: block;
}

.table {
  display: inline-block;
  border-spacing: 0;
}

.th:last-child {
  border-right: 0;
}

.td:last-child {
  border-right: 0;
}

.resizer {
  display: inline-block;
  background: transparent;
  width: 8px;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  transform: translateX(50%);
  z-index: 1;
  cursor: col-resize;
  touch-action: none;
}

.resizer:hover {
  background-color: #8ecae6;
}

.th,
.td {
  white-space: nowrap;
  margin: 0;
  border-bottom: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
  position: relative;
}

.text-align-right {
  text-align: right;
}

.cell-padding {
  padding: 0.5rem;
}

.d-flex {
  display: flex;
}

.d-inline-block {
  display: inline-block;
}

.cursor-default {
  cursor: default;
}

.align-items-center {
  align-items: center;
}

.flex-wrap-wrap {
  flex-wrap: wrap;
}

.border-radius-md {
  border-radius: 5px;
}

.cursor-pointer {
  cursor: pointer;
}

.icon-margin {
  margin-right: 4px;
}

.font-weight-600 {
  font-weight: 600;
}

.font-weight-400 {
  font-weight: 400;
}

.font-size-75 {
  font-size: 0.75rem;
}

.flex-1 {
  flex: 1;
}

.mt-5 {
  margin-top: 0.5rem;
}

.mr-auto {
  margin-right: auto;
}

.ml-auto {
  margin-left: auto;
}

.mr-5 {
  margin-right: 0.5rem;
}

.justify-content-center {
  justify-content: center;
}

.flex-column {
  flex-direction: column;
}

.overflow-auto {
  overflow: auto;
}

.overflow-y-hidden {
  overflow-y: hidden;
}

.list-padding {
  padding: 4px 0px;
}

.bg-grey-200 {
  background-color: #eeeeee;
}

.color-grey-800 {
  color: #424242;
}

.color-grey-600 {
  color: #757575;
}

.color-grey-500 {
  color: #9e9e9e;
}

.border-radius-sm {
  border-radius: 4px;
}

.text-transform-uppercase {
  text-transform: uppercase;
}

.text-transform-capitalize {
  text-transform: capitalize;
}

`