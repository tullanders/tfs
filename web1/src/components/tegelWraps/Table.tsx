'use client';

import { 
  TdsTable, 
  TdsTableHeader,
  TdsHeaderCell,
  TdsTableBody,
  TdsTableBodyRow,
  TdsBodyCell,
  TdsTableBodyInputWrapper
} from '@scania/tegel-react';
import { ReactNode } from 'react';

// Table wrapper
interface TableProps {
  children: ReactNode;
  verticalDividers?: boolean;
  compactDesign?: boolean;
  responsive?: boolean;
  noMinWidth?: boolean;
}

export function Table({
  children,
  verticalDividers = false,
  compactDesign = false,
  responsive = false,
  noMinWidth = false,
}: TableProps) {
  return (
    <TdsTable
      verticalDividers={verticalDividers}
      compactDesign={compactDesign}
      responsive={responsive}
      noMinWidth={noMinWidth}
    >
      {children}
    </TdsTable>
  );
}

// TableHeader wrapper
interface TableHeaderProps {
  children: ReactNode;
}

export function TableHeader({ children }: TableHeaderProps) {
  return <TdsTableHeader>{children}</TdsTableHeader>;
}

// HeaderCell wrapper
interface HeaderCellProps {
  children: ReactNode;
  cellKey?: string;
  cellValue?: string;
  sortable?: boolean;
  customWidth?: string;
}

export function HeaderCell({
  children,
  cellKey,
  cellValue,
  sortable = false,
  customWidth,
}: HeaderCellProps) {
  return (
    <TdsHeaderCell
      cellKey={cellKey}
      cellValue={cellValue}
      sortable={sortable}
      customWidth={customWidth}
    >
      {children}
    </TdsHeaderCell>
  );
}

// TableBody wrapper
interface TableBodyProps {
  children: ReactNode;
}

export function TableBody({ children }: TableBodyProps) {
  return <TdsTableBody>{children}</TdsTableBody>;
}

// TableBodyRow wrapper
interface TableBodyRowProps {
  children: ReactNode;
}

export function TableBodyRow({ children }: TableBodyRowProps) {
  return <TdsTableBodyRow>{children}</TdsTableBodyRow>;
}

// BodyCell wrapper
interface BodyCellProps {
  children: ReactNode;
  cellKey?: string;
  cellValue?: string;
  customWidth?: string;
}

export function BodyCell({
  children,
  cellKey,
  cellValue,
  customWidth,
}: BodyCellProps) {
  return (
    <TdsBodyCell
      cellKey={cellKey}
      cellValue={cellValue}
      style={customWidth ? { width: customWidth } : undefined}
    >
      {children}
    </TdsBodyCell>
  );
}

// TableBodyInputWrapper wrapper
interface TableBodyInputWrapperProps {
  children: ReactNode;
}

export function TableBodyInputWrapper({ children }: TableBodyInputWrapperProps) {
  return <TdsTableBodyInputWrapper>{children}</TdsTableBodyInputWrapper>;
}

// Default export for convenience
export default Table;
