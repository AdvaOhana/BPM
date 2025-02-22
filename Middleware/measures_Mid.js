async function AddMeasures(req, res,next) {
    let user_id    = req.body.user_id;
    let date= new Date().toISOString().split("T")[0];
    let sys_high= Number(req.body.sys_high);
    let dia_low= Number(req.body.dia_low);
    let pulse= Number(req.body.pulse);

    if (user_id === undefined)throw new Error('Id is not valid, please check again.');
    if (sys_high === undefined)throw new Error('Must enter a systolic value.');
    if (dia_low === undefined)throw new Error('Must enter a diastolic value.');
    if (pulse === undefined)throw new Error('Must enter a pulse value.');

    let Query="INSERT INTO `measures` ";
    Query += " ( `user_id`, `date`, `sys_high`, `dia_low`, `pulse`) ";
    Query += " VALUES ";
    Query += ` ('${user_id}','${date}','${sys_high}','${dia_low}','${pulse}') `;

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
module.exports={AddMeasures};