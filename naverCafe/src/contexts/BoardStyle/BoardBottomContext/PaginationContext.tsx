//게시판 별로 페이지네이션에 필요한 값을 전역적으로 관리하는 context입니다.

import {
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from "react";


interface PaginationState {
  [boardId: number]: {
    currentPage: number;
    indexOfFirstItem: number;
    indexOfLastItem: number;
    articleLength?: number;
    };
}

interface PaginationContextType {
  paginationState: PaginationState;
  updatePagination: (args: {
    boardId: number;
    currentPage: number;
    articleLength?: number;
  }) => void;
    itemsPerPage: number;
    setItemsPerPage: (arg: number) => void;
}

export const PaginationContext = createContext<PaginationContextType>({
  paginationState: {},
    updatePagination: () => { },
    itemsPerPage: 15,
    setItemsPerPage:()=>{}
});

export const PaginationProvider = ({ children }: { children: ReactNode }) => {
    const [paginationState, setPaginationState] = useState<PaginationState>({});
    const [itemsPerPage, setItemsPerPage] = useState(15);

  const updatePagination = ({
    boardId,
    currentPage,
    articleLength,
  }: {
    boardId: number;
    currentPage: number;
    articleLength?: number;
  }) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    setPaginationState((prevState) => ({
      ...prevState,
      [boardId]: {
        ...prevState[boardId],
        currentPage,
        indexOfFirstItem,
        indexOfLastItem,
        articleLength,
      },
    }));
  };

  return (
    <PaginationContext.Provider value={{ paginationState, updatePagination, itemsPerPage, setItemsPerPage }}>
      {children}
    </PaginationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePagination = (boardId: number) => {
  const { paginationState, updatePagination, itemsPerPage, setItemsPerPage } = useContext(PaginationContext);
  const paginationInfo = paginationState[boardId] || {};
  const { currentPage, articleLength } = paginationInfo;

  const setCurrentPage = (pageNumber: number) =>
    updatePagination({ boardId, currentPage: pageNumber });

  const setTotalLength = (totalLength: number) =>
    updatePagination({ boardId, articleLength: totalLength, currentPage: 1 });

  useEffect(() => {
    updatePagination({ boardId, currentPage, articleLength });
  }, [currentPage]);

  return { ...paginationInfo, setCurrentPage, setTotalLength, setItemsPerPage, itemsPerPage, updatePagination };
};