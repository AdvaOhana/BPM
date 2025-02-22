async function AddUsers(req, res,next) {
    let name    = req.body.name;

    let Query="INSERT INTO `users` ";
    Query += " ( `full_name`) ";
    Query += " VALUES ";
    Query += ` ('${name}') `;

    const promisePool = db_pool.promise();
    let rows=[];
    try {
        [rows] = await promisePool.query(Query);
        req.insertId=rows.insertId;
        req.success=true;
    } catch (err) {
        req.success=false;
        console.log(err);
    }
    next();
}
async function GetUsers(req,res,next){
    const Query = `SELECT * FROM users `;
    const promisePool = db_pool.promise();
    let rows=[];
    try {
        [rows] = await promisePool.query(Query);
        req.success=true;
        req.all_users=rows;
    } catch (err) {
        req.success=false;
        console.log(err);
    }
    next();
}
async function UpdateUsers(req,res,next){
    let idx             = req.body.idx;
    let user_name     = req.body.user_name;

    let Query = `UPDATE users SET `;
    Query += ` full_name = '${user_name}' `;
    Query += ` WHERE id = ${idx} `;
    const promisePool = db_pool.promise();
    let rows=[];
    try {
        [rows] = await promisePool.query(Query);
        req.success=true;
    } catch (err) {
        req.success=false;
        console.log(err);
    }
    next();
}

module.exports = {AddUsers,GetUsers,UpdateUsers}