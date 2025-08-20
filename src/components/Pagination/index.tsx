import classNames from "classnames";
import ReactPaginate from "react-paginate";

const Pagination = ({
  pageCount,
  forcePage,
  handlePageChange
}: {
  pageCount: number;
  forcePage?: number;
  handlePageChange: (selectedItem: { selected: number }) => void;
}) => {
  return (
    <ReactPaginate
      pageCount={pageCount}
      marginPagesDisplayed={3}
      pageRangeDisplayed={2}
      nextLabel="Next"
      previousLabel=""
      onPageChange={handlePageChange}
      className="flex items-center justify-center mt-4 text-sm"
      pageClassName={classNames(
        "border border-transparent rounded-full flex-shrink-0 w-8 h-8 flex items-center justify-center",
        {
          hidden: pageCount === 1 || pageCount === 0
        }
      )}
      activeClassName="border !border-grayColor/20 rounded-full flex-shrink-0 w-8 h-8 flex items-center justify-center"
      nextClassName={classNames("ml-2", {
        hidden: pageCount === 1 || pageCount === 0
      })}
      forcePage={forcePage}
    />
  );
};

export default Pagination;
