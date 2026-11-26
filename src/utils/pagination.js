export const buildPaginationMeta = (totalRecords, page, limit) => {
  const totalPages = Math.ceil(totalRecords / limit);

  return {
    totalRecords,
    totalPages,
    currentPage: page,
    limit,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};
