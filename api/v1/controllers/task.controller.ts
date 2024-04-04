import Task from "../models/task.model";
import { Request,Response } from "express";
import paginationHelper from "../../../helper/pagination.helper";


//[GET] api/v1/tasks/
export const index= async (req:Request,res:Response) =>{
  interface Find{
    deleted:boolean,
    status?:string,
    title?:RegExp
  }
  const find:Find={
    deleted:false
  }
  //Filter Status
  if(req.query.status){
    find.status=req.query.status.toString();
  }
  //End Filter Status

  //Sort
  const sort={};
  if(req.query.sortKey && req.query.sortValue){
    const sortKey=req.query.sortKey.toLocaleString();
    sort[sortKey]=req.query.sortValue;
  }   
  //End Sort

  //Pagination
  let initPagination={
    currentPage:1,
    limitItems:2,
  }
  const countTasks= await Task.countDocuments(find);
  let objectPagination=paginationHelper(
    initPagination,
    req.query,
    countTasks
  );
  //End Pagination

  //Search
  if(req.query.keyword){
    const keyword:string|any=req.query.keyword;
    const regex:RegExp=new RegExp(keyword,"i");
    find.title=regex;
  }
  //End Search
  const tasks= await Task.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);
  res.json(tasks);
};

//[GET] api/v1/tasks/detail/:id
export const detail=async(req:Request,res:Response)=>{
  const taskId:String=req.params.id;
  const task=await Task.findOne({
    _id:taskId,
    deleted:false
  })
  res.json(task);
}
//[PATCH] api/v1/tasks/change-status/:id
export const changeStatus=async(req:Request,res:Response)=>{
  try {
    const taskId:String=req.params.id;
    const status:String=req.body.status;
    await Task.updateOne({
      _id:taskId,
    },{
      status:status
    })
    res.json({
      code:200,
      massage:"Cập nhật trạng thái thành công!"
    });
  } catch (error) {
    console.log(error);
    res.json({
      code:400,
      massage:"Cập nhật trạng thái thất bại!"
    });
  }
}
  
//[PATCH] api/v1/tasks/change-multi
export const changeMulti=async(req:Request,res:Response)=>{
  try {
    enum Key{
      STATUS="status",
      DELETE="delete"
    }
    const ids:string[]=req.body.ids;
    const key:string=req.body.key;
    const value:string=req.body.value;
    switch (key) {
      case Key.STATUS:
        await Task.updateMany({
          _id:{$in:ids}
        },{
          status:value
        });
        res.json({
          code:200,
          massage:"Cập nhật trạng thái thành công!"
        });
        break;
      case Key.DELETE:
        await Task.updateMany({
          _id:{$in:ids}
        },{
          deleted:true,
          deleteAt:new Date()
        });
        res.json({
          code:200,
          massage:"Cập nhật trạng thái thành công!"
        });
        break;
      default:
        res.json({
          code:400,
          massage:"Cập nhật trạng thái thất bại!"
        });
        break;
    }
  } catch (error) {
    res.json({
      code:400,
      massage:"Cập nhật trạng thái thất bại!"
    });
  }
}

//[DELETE] api/v1/tasks/delete/:id
export const deleted=async(req:Request,res:Response)=>{
  try {
    const taskId:string=req.params.id;
    await Task.updateOne({
      _id:taskId,
    },{
      deleted:true,
      deleteAt:new Date()
    })
    res.json({
      code:200,
      massage:"Cập nhật trạng thái thành công!"
    });
  } catch (error) {
    res.json({
      code:400,
      massage:"Cập nhật trạng thái thất bại!"
    });
  }
}

//[POST] api/v1/tasks/create/
export const create=async(req:Request,res:Response)=>{
  try {
    req.body.createdBy=res.locals.user.id;
    const task=new Task(req.body);
    const data= await task.save();
    res.json({
      code:200,
      message:"Tạo mới thành công!",
      data:data
    });
  } catch (error) {
    res.json({
      code:400,
      message:"Tạo mới thất bại!",
    });
  }
}

//[PATCH] api/v1/tasks/edit/:id
export const edit=async(req:Request,res:Response)=>{
  try {
    const taskId:string=req.params.id;
    await Task.updateOne( {_id:taskId} ,req.body )
    res.json({
      code:200,
      massage:"Cập nhật thành công!"
    });
  } catch (error) {
    res.json({
      code:400,
      massage:"Cập nhật thất bại!"
    });
  }
}