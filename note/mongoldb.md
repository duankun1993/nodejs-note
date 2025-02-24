# mongoldb

## 一、常用命令

1. 数据库操作

   ```c
   // 启动服务
   mongosh
   // 关闭服务
   db.shutdownServer()

   // 查看所有数据库
   show dbs

   // 创建/切换数据库（不存在则创建）
   use <数据库名>

   // 查看当前数据库
   db

   // 删除当前数据库
   db.dropDatabase()
   ```

2. 集合操作

   ```c
   // 创建集合（可选参数： capped、size、max等）
   db.createCollection("users",{capped: true, size: 5242880})

   // 删除集合
   db.users.drop()

   // 查看所有集合
   show collections
   ```

3. 文档操作 CRUD

   ```abc
   // 插入单条数据
   db.users.insert({name:"Alice", age:25, email:alice@gmail.com})

   // 插入多条数据
   db.user.insert([
     {name:"Bob",age:33},
     {name:"Charlie",age:27}
   ])

   // 更新数据
   db.users.update({name:"Alice"},{$set:{age:18}})

   // 将users集合中age为25的文档的name字段修改为changeName
   db.users.update({age:25},{$set:{name:'changeName'}},false,true);

   // 将users集合中name为'ailjx'的文档的age字段的值加5
   db.users.update({name:'ailjx'},{$inc:{age:5}},false,true);

   // 将users集合中name为'ailjx'的文档的age字段的值加5并将name字段修改为A
   db.users.update({name:'ailjx'},{$inc:{age:5},$set:{name:'A'}},false,true);

   // 分页查询
   db.users.find().skip(1).limit(10)

   // 删除一条数据
   db.users.deleteOne({name:"Alice"})
   // 删除users集合中age为132的文档
   db.users.remove({age:132});
   // 删除users集合中所有文档
   db.users.remove({});

   // 排序
   db.users.find().sort({age:-1})

   ### 查询
   // 查询所有数据
   db.users.find()

   // 条件查询（性别：男 & age > 29）
   db.users.find({$and:[{gender:"男"},{age:{$gt:29}}]})

   // 查询name=zhangsan，age=22的数据
   db.users.find({name:'zhangsan',age:22});

   # 查询name字段去重后的数据
   db.users.distinct("name")

   //查询并格式化输出
   db.users.find().pretty()

   // 分页查询
   db.users.find().skip(1).limit(10)

   // 排序
   db.users.find().sort({age:-1})

   // $eq    # 等于
   // $ne    # 不等于
   // $gt    # 大于
   // $gte   # 大于等于
   // $lt    # 小于
   // $lte   # 小于等于
   // $in    # 在数组中
   // $nin   # 不在数组中
   // $and   # 逻辑与
   // $or    # 逻辑或
   // $exists # 字段是否存在
   ```

## 二、mongoose
