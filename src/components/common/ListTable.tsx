
import { ButtonGroup,  Col, Form, Row,  Table } from 'react-bootstrap';
import { capitalCase } from 'change-case';

// EmptyState, Switch,

import Link from './Link.tsx';
import { usePagination } from './PaginationControls';
import { useFilter, useUpdateSearchParams } from '../../hooks/param-hooks';

type Column = {
  field: string;
  label?: string;
  width?: number; // percentage
  filter?: boolean | ((entity: Function) => string);
  display?: (entity: any) => React.ReactNode;
  link?: (entity: any) => string | { to: string; [key: string]: any } | null;
  sort?: boolean | ((a: any, b: any) => number);
  ellipsis?: number; // number of characters to show before truncating with ellipsis
};

export const SortDir  : Record<string, string> = {
  ASC: 'ASC',
  DESC: 'DESC',
};

export class Sort {
  field: string;
  dir: string;
  constructor(field: string, dir: string) {
    this.field = field;
    if (![SortDir.ASC, SortDir.DESC].includes(dir)) {
      throw new Error(`Invalid Sort direction. Must be either ${SortDir.ASC} or ${SortDir.DESC}`);
    }
    this.dir = dir;
  }

  toString() {
    return `${this.field}:${this.dir}`;
  }

  static fromString(string: string) {
    const [field, dir] = string.split(':');
    return new Sort(field, dir);
  }
}

export const Arrows : Record<string, string> = {
  ASC: '\u21D3', // Down arrow
  DESC: '\u21D1', // Up arrow
  NONE: '\u21D5', // Double arrow
};

interface ListTableSwitchProps {
  label: string;
  urlParamKey: string;
  startOn?: boolean;
}

export const ListTableSwitch: React.FC<ListTableSwitchProps> = ({ label, urlParamKey, startOn = true }) => {
  const [searchParams, updateSearchParams] = useUpdateSearchParams();
  const onClickHandler = (newSwitchState: boolean) => {
    updateSearchParams({
      [urlParamKey]: newSwitchState,
      page: 1,
    });
  };
  const on = searchParams.has(urlParamKey) ? searchParams.get(urlParamKey) === 'true' : startOn;
  return (
      <Form.Switch onClick={() =>onClickHandler} variant="small" label={label} startOn={on} />
  );
};
ListTableSwitch.displayName = 'ListTableSwitch';

export const ListTableSwitches: React.FC<{ children: any}> = ({ children }) => <Col flex="inline">{children}</Col>;
ListTableSwitches.displayName = 'ListTableSwitches';

interface ListTablePrefixProps {
  entityName: string;
  entityPath: string;
  Switches?: React.ReactNode;
}

export const ListTablePrefix: React.FC<ListTablePrefixProps> = ({ entityName, entityPath, Switches }) => {
  const { filter, handleFilterChange } = useFilter();
  return (
    <Row className="rvt-m-bottom-sm">
      <Col>
      <Form.Group>
        <Form.Control
          type="text"
          name="filter"
          placeholder="Filter"
          value={filter}
          onChange={handleFilterChange}
          className="rvt-m-bottom-md"
        />
        </Form.Group>
      </Col>
      {!!Switches && Switches}
      <Col className="rvt-text-right">
        <fieldset>
          <ButtonGroup>
            <Link to={`${entityPath}/new`} className="rvt-button rvt-button--primary">
              <span className="rvt-hide-md-down">
                New {entityName}
              </span>
            </Link>
          </ButtonGroup>
        </fieldset>
      </Col>
    </Row>
  );
};
ListTablePrefix.displayName = 'ListTablePrefix';

export const ListTableEmptyState = () => (

      <p>There&apos;s nothing here yet.</p>
);
ListTableEmptyState.displayName = 'ListTableEmptyState';

interface ListTableHeaderProps {
  column: Column;
  sort: Sort;
  defaultWidth: number;
  updateSort: (fieldName: string) => void;
};

const ListTableHeader : React.FC<ListTableHeaderProps> = ({ column, sort, defaultWidth, updateSort})  => {
  const display = column.label ? column.label : capitalCase(column.field);
  const sortable = !('sort' in column) || column.sort !== false;
  let sortDir = null;
  if (sortable) {
    sortDir = Arrows.NONE;
    if (sort.field === column.field) {
      sortDir = sort.dir === SortDir.ASC ? Arrows.ASC : Arrows.DESC;
    }
  }
  return (
    <th
      key={column.field}
      style={{ width: `${column.width ? column.width : defaultWidth}%` }}
      className={sortable ? 'sortable' : ''}
      onClick={() => sortable && updateSort(column.field)}
    >
      {display} {sortDir}
    </th>
  );
};
ListTableHeader.displayName = 'ListTableHeader';



const ListTableRow : React.FC<{ columns: Column[]; entity: any }> = ({ columns, entity }) => (
  <tr>
    {columns.map((column) => {
      let display = entity[column.field];
      if (column.display) {
        display = column.display(entity);
      }
      let title = null;
      if (column.ellipsis) {
        title = display;
        display = display.substr(0, column.ellipsis) + '\u2026';
      }
      if (column.link) {
        const link = column.link(entity);
        if (link) {
          display = typeof link === 'object' ? <Link {...link}>{display}</Link> : <Link to={link}>{display}</Link>;
        }
      }

      return (
        <td key={`${entity.id}-${column.field}`} title={title}>
          {display}
        </td>
      );
    })}
  </tr>
);
ListTableRow.displayName = 'ListTableRow';

interface ListTableProps {
  id?: string;
  columns: Column[];
  data: any[];
  defaultSort: Sort;
}

const ListTable: React.FC<ListTableProps> = ({ id = 'list-table', columns, data, defaultSort }) => {
  const [searchParams, updateSearchParams] = useUpdateSearchParams();
  const { filter } = useFilter();
  const { paginationSlice, PaginationSummary, Pagination } = usePagination();
  // Determine widths of fields without explicit (percentage) widths
  const reservedWidths : Record<string, number> = columns.reduce(
    (acc, value) => (value.width ? { ...acc, [value.field]: value.width } : acc),
    {},
  );
  const defaultWidth =
    (100 - Object.values(reservedWidths).reduce((acc, value) => acc + value, 0)) /
    (columns.length - Object.keys(reservedWidths).length);
  // Make a copy of the data to modify and display
  let curatedData = [...data];
  // filtering
  if (filter) {
    const filterFields = columns.filter((column) => column.filter).map((column) => column.field);
    curatedData = curatedData.filter((entity) => {
      for (const field of filterFields) {
        let value = entity[field];
        const column = columns.find((col) => col.field === field);
        if (column && typeof column.filter === 'function') {
          value = column.filter(entity);
        }
        if (value.toUpperCase().includes(filter.toUpperCase())) {
          return true;
        }
      }
      return false;
    });
  }
  // sorting
  let sort = defaultSort;
  if (searchParams.has('sort')) {
    try {
      sort = Sort.fromString(searchParams.get('sort') || '');
    } catch {
      // Invalid search string. Ignore parameter
    }
  }
  const sortColumn = columns.find((column) => column.field === sort.field);
  if (sortColumn) {
    const compareFn = sortColumn.sort && typeof sortColumn.sort === 'function' ? sortColumn.sort : (a: any, b: any) => {
      //console.log({ a, b});
      return a[sortColumn.field].localeCompare(b[sortColumn.field])
    };
    curatedData.sort(compareFn);
    if (sort.dir === SortDir.DESC) {
      curatedData.reverse();
    }
  }

  const updateSort = (fieldName : string) => {
    let newSort;
    if (fieldName !== sort.field) {
      newSort = new Sort(fieldName, SortDir.ASC);
    } else {
      const sortDir = sort.dir === SortDir.ASC ? SortDir.DESC : SortDir.ASC;
      newSort = new Sort(fieldName, sortDir);
    }
    updateSearchParams({
      sort: newSort.toString(),
    });
  };
  // pagination
  const paginatedData = paginationSlice(curatedData);
  // render
  return (
    <div className="list-table-container">
      <PaginationSummary data={curatedData} />
      <Table id={id} striped bordered hover responsive style={{ width: '100%' }}>
        <thead>
          <tr>
            {columns.map((column) => (
              <ListTableHeader
                key={column.field}
                column={column}
                sort={sort}
                defaultWidth={defaultWidth}
                updateSort={updateSort}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((entity) => (
            <ListTableRow key={entity.id} columns={columns} entity={entity} />
          ))}
        </tbody>
      </Table>
      <Pagination data={curatedData} />
    </div>
  );
};
ListTable.displayName = 'ListTable';

export default ListTable;
