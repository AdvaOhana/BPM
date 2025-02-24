const {isBefore, isSameDay}= require('date-fns');

async function AddMeasures(req, res,next) {
    let user_id    = parseInt(req.body.user_id);
    let date=  new Date().toISOString().split("T")[0];
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
async function GetMeasures(req,res,next){
    let Query = `SELECT * FROM measures `;
    const promisePool = db_pool.promise();
    let rows=[];
    try {
        [rows] = await promisePool.query(Query);
        if (!rows.length) throw new Error('No rows found.');
        req.success=true;
        req.all_measures=rows;
    } catch (err) {
        req.success=false;
        console.log(err);
    }
    next();
}
async function UpdateMeasures(req,res,next){
    let idx             = parseInt(req.body.idx);
    let date= new Date().toISOString().split("T")[0];
    let sys_high= Number(req.body.sys_high);
    let dia_low= Number(req.body.dia_low);
    let pulse= Number(req.body.pulse);

    if (idx === undefined)throw new Error('Id is not valid, please check again.');
    if (sys_high === undefined)throw new Error('Must enter a systolic value.');
    if (dia_low === undefined)throw new Error('Must enter a diastolic value.');
    if (pulse === undefined)throw new Error('Must enter a pulse value.');

    let Query = `UPDATE measures SET `;
    Query += ` date = '${date}' , `;
    Query += ` sys_high = '${sys_high}' , `;
    Query += ` dia_low = '${dia_low}' , `;
    Query += ` pulse = '${pulse}' `;
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
async function DeleteMeasures(req,res,next){
    let idx  = parseInt(req.body.idx);
    let Query = `DELETE FROM measures  `;
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
async function GetMeasuresByUId(req,res,next){
    let user_id= parseInt(req.body.user_id);
    let dates= req.body;

    if (user_id === undefined)throw new Error('Id is not valid, please check again.');

    let Query = `SELECT * FROM measures `;
    Query += ` WHERE user_id = ${user_id} `;

    if (dates.startDate && dates.endDate){
        if (isBefore(dates.startDate,dates.endDate) || isSameDay(dates.endDate,dates.startDate)){
            Query += ` AND date BETWEEN '${dates.startDate}' AND '${dates.endDate}'  `;
        }
    }
    const promisePool = db_pool.promise();
    let rows=[];
    try {
        [rows] = await promisePool.query(Query);
        if (!rows.length) throw new Error('No rows found.');
        req.success=true;
        req.measuresByUId=rows;
    } catch (err) {
        req.success=false;
        console.log(err);
    }
    next();
}
async function GetMeasuresAvg(req,res,next){
    let user_id= parseInt(req.body.user_id);
    let dates= req.body;

    if (user_id === undefined)throw new Error('Id is not valid, please check again.');

    let Query = `SELECT avg(sys_high) AS sysAvg, avg(dia_low) AS diaAvg,avg(pulse) AS pulseAvg FROM measures `;
    Query += ` WHERE user_id = ${user_id} `;

    if (dates.startDate && dates.endDate){
        if (isBefore(dates.startDate,dates.endDate) || isSameDay(dates.endDate,dates.startDate)){
            Query += ` AND date BETWEEN '${dates.startDate}' AND '${dates.endDate}'  `;
        }
    }
    Query += ` GROUP BY user_id `;

    const promisePool = db_pool.promise();
    let rows=[];
    try {
        [rows] = await promisePool.query(Query);
        req.success=true;
        req.measuresAvg=rows;
    } catch (err) {
        req.success=false;
        console.log(err);
    }
    next();
}
async function CriticalMeasures(req,res,next){
   try {
       let measuresAvg = req.measuresAvg;
       let measuresByUId = req.measuresByUId;

       measuresByUId.forEach((measure) => {
           measure.critical = false;
           if (measure.sys_high > measuresAvg[0].sysAvg * 1.2||measure.dia_low > measuresAvg[0].diaAvg * 1.2||measure.pulse > measuresAvg[0].pulseAvg * 1.2) {
               measure.critical = true;
           }
       })
       req.criticalData = measuresByUId;
   } catch (err) {
    req.success=false;
    console.log(err);
    }
    next();
}
async function AvgMeasuresByMonth(req,res,next){
    let month=Number(req.body.month);
    let allUsers= req.all_users;

    if (month>12 || month<1 || month === undefined)throw new Error('Month is not valid, please check again.');

    let Query = `SELECT user_id,avg(sys_high) AS sysAvg, avg(dia_low) AS diaAvg,avg(pulse) AS pulseAvg FROM measures `;
    Query += ` WHERE MONTH(date)= ${month} `;
    Query += ` GROUP BY user_id `;

    let Query2= `select * from measures where MONTH(date)= ${month} `;

    const promisePool = db_pool.promise();
    let rows=[];
    let rows2=[];
    try {
        [rows] = await promisePool.query(Query);
        [rows2] = await promisePool.query(Query2);

        if (!rows.length || !rows2.length) throw new Error('No rows found.');

        rows.forEach(avg =>{
            rows2.forEach(measure =>{
                if (avg.user_id === measure.user_id){
                    if (measure.sys_high > avg.sysAvg * 1.2) {
                        avg.sysCnt = avg.sysCnt ? avg.sysCnt++ : 1;
                    }
                    if (measure.dia_low > avg.diaAvg * 1.2) {
                        avg.diaCnt = avg.diaCnt ? avg.diaCnt++ : 1;
                    }
                    if (measure.pulse > avg.pulseAvg * 1.2) {
                        avg.pulseCnt = avg.pulseCnt ? avg.pulseCnt++ : 1;
                    }
                }
            })
            allUsers.forEach(user=>{
                if (avg.user_id === user.id){
                    avg.userName= user.full_name;
                }
            })
        })
        req.success=true;
        req.AvgMeasuresByMonth=rows;
    } catch (err) {
        req.success=false;
        console.log(err);
    }
    next();
}
module.exports={
    AddMeasures,
    GetMeasures,
    UpdateMeasures,
    DeleteMeasures,
    GetMeasuresByUId,
    GetMeasuresAvg,
    CriticalMeasures,
    AvgMeasuresByMonth
};