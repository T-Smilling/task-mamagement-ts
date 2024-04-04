"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paginationHelper = (objectPagination, query, countTasks) => {
    if (isNaN(query.page) === false) {
        objectPagination.currentPage = parseInt(query.page);
    }
    if (isNaN(query.limit) === false) {
        objectPagination.limitItems = parseInt(query.limit);
    }
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;
    const totalPage = Math.ceil(countTasks / objectPagination.limitItems);
    objectPagination.totalPage = totalPage;
    return objectPagination;
};
exports.default = paginationHelper;
