interface ObjectPagination{
  currentPage:number,
  limitItems:number,
  skip?:number,
  totalPage?:number
}
const paginationHelper = (objectPagination:ObjectPagination,query:Record<string,any>,countTasks:number):ObjectPagination => {
  if(isNaN(query.page) === false){
    objectPagination.currentPage=parseInt(query.page);
  }
  if(isNaN(query.limit) === false){
    objectPagination.limitItems=parseInt(query.limit);
  }
  objectPagination.skip=(objectPagination.currentPage-1)*objectPagination.limitItems;

  const totalPage=Math.ceil(countTasks/objectPagination.limitItems);
  objectPagination.totalPage=totalPage;
  return objectPagination;
}

export default paginationHelper;