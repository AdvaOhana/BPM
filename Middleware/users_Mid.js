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

module.exports = {AddUsers}