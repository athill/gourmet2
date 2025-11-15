import React, { type FC } from 'react';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import { useUpdateSearchParams } from '../../hooks/param-hooks.js';
import pluralize from 'pluralize';

export const validPageSizes = ['10', '25', '50', '100', 'all'];

export const paginateResults = (results: any[], page: number, pageSize: number | 'all') => {
  if (pageSize === 'all') {
    return results;
  } else {
    return results.slice((page - 1) * pageSize, page * pageSize);
  }
};

export const getPaginationSummary = (results: any[], page: number, pageSize: number | 'all') => {
  const total = results.length;
  let start, end;
  if (pageSize === 'all') {
    start = 1;
    end = total;
  } else {
    start = (page - 1) * pageSize + 1;
    end = Math.min(total, page * pageSize);
  }
  return {
    start,
    end,
    total,
  };
};

export const usePagination = () => {
  const [searchParams, updateSearchParams] = useUpdateSearchParams();
  // pagination
  const getResultsPerPage : () => number | 'all' = () : number | 'all' => {
    let resultsPerPage : number | 'all' = 10;
    if (searchParams.has('rpp')) {
      const rpp = searchParams.get('rpp');
      if (rpp && validPageSizes.includes(rpp)) {
        return rpp === 'all' ? 'all' : Number(rpp);
      }
    }
    return resultsPerPage;
  };
  const getPage = () => {
    let page = 1;
    if (searchParams.has('page')) {
      let tmpPage = searchParams.get('page');
      if (tmpPage && !isNaN(Number(tmpPage))) {
        page = Number(tmpPage);
      }
    }
    return page;
  };
  const onChangePage = (page: number) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    updateSearchParams({
      page,
    });
  };

  const onChangePageSize = (rpp: number | 'all') => {
    updateSearchParams({
      rpp,
    });
  };
  return {
    getPage,
    getResultsPerPage,
    onChangePage,
    onChangePageSize,
    paginationSlice: (data: any[]) => paginateResults(data, getPage(), getResultsPerPage()),
    /* eslint-disable */ // don't need prop types on this
    PaginationSummary: ({ data }: { data: any[] }) => {
      const { start, end, total } = getPaginationSummary(data, getPage(), getResultsPerPage());
      return (
        <span className="pagination-summary">
          Showing {pluralize('result', total)} {start}-{end} of {total}
        </span>
      );
    },
    Pagination: ({ data }: { data: any[] }) => {
      return (
        <PaginationControls
          onChangePage={onChangePage}
          page={getPage()}
          onChangePageSize={() => onChangePageSize}
          resultCount={data.length}
          pageSize={getResultsPerPage()}
        />
      );
    },
    /* es-lint-enable */
  };
};

interface PaginationControlsProps {
  onChangePage: (page: number) => (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onChangePageSize: (pageSize: string) => void;
  page: number;
  pageSize: number | 'all';
  resultCount: number;
}

export const PaginationControls : FC<PaginationControlsProps> = ({
  onChangePage = (_page: number) => {},
  onChangePageSize = (_pageSize: string) => {},
  page = 1,
  pageSize = '10',
  resultCount,
}) => {
  const pageCount = pageSize === 'all' ? 1 : Math.ceil(resultCount / (pageSize as number));
  const disablePrevious = page === 1;
  const disableNext = page === pageCount;
  const pageLinkCount = 5;
  const paginationLinkCount = Math.min(pageCount, pageLinkCount);
  let paginationStart: number = 1;
  if (page >= pageCount - Math.floor(pageLinkCount / 2)) {
    // If we are within half the number of page links from the max page count we will set the starting page number so the max page is last
    paginationStart = Math.max(pageCount - (pageLinkCount - 1), 1);
  } else {
    paginationStart = Math.max(page - Math.floor(pageLinkCount / 2), 1);
  }
  const paginationItems : number[] =
    paginationLinkCount ? Array.from(new Array(paginationLinkCount), (_x, i) => i + paginationStart) : [];
  return (
    <div className="pagination-controls rvt-m-top-xl rvt-inline-flex rvt-justify-end">
      {resultCount > 10 && (
        <>
          <Form.Select
            id="page-size"
            aria-label="Page Size"
            value={pageSize}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => onChangePageSize(event.target.value)}
            className="page-size-control"
          >
            <option value="10">10 results per page</option>
            {resultCount > 25 && <option value="25">25 results per page</option>}
            {resultCount > 50 && <option value="50">50 results per page</option>}
            {resultCount > 100 && <option value="100">100 results per page</option>}
            <option value="all">Show all results</option>
          </Form.Select>
        </>
      )}
      {pageCount > 1 && (
        <Pagination className="pagination">
          <Pagination.First disabled={disablePrevious} onClick={() => onChangePage(1)} />
          <Pagination.Prev disabled={disablePrevious} onClick={() => onChangePage(page - 1)} />
          {paginationItems.map((pageNumber: number) => (
            <Pagination.Item
              key={pageNumber}
              active={pageNumber === page}
              onClick={() => onChangePage(pageNumber)}
              title={`Page ${pageNumber}`}
              aria-label={`Page ${pageNumber}`}
            >
              {pageNumber}
            </Pagination.Item>
          ))}
          <Pagination.Next disabled={disableNext} onClick={() => onChangePage(page + 1)} />
          <Pagination.Last disabled={disableNext} onClick={() => onChangePage(pageCount)} />
        </Pagination>
      )}
    </div>
  );
};
PaginationControls.displayName = 'PaginationControls';


export default PaginationControls;
