export async function pagination<T>(query: any, callback: (limit: number, offset: number, sortOrder: string) => Promise<{ doc: T[]; totalDoc: number }>) {
  const { page = 1, limit = 10, order = "DESC" } = query;
  const pageIndex = parseInt(page);
  const perPageLimit = parseInt(limit);
  const sortOrder = order.toUpperCase() === "ASC" ? "asc" : "desc";
  const offset = (pageIndex - 1) * perPageLimit;

  try {
    const { doc, totalDoc } = await callback(perPageLimit, offset, sortOrder);
    const pagination = {
      currentPage: pageIndex,
      currentPageLimit: perPageLimit,
      total: totalDoc,
      totalPage: Math.ceil(totalDoc / perPageLimit),
      prevPage: pageIndex > 1 ? pageIndex - 1 : null,
      prevPageLimit: perPageLimit,
      nextPage: offset + perPageLimit < totalDoc ? pageIndex + 1 : null,
      nextPageLimit: perPageLimit,
    };
    return { result: doc, pagination };
  } catch (error) {
    console.error("Pagination error:", error);
    throw error;
  }
}
