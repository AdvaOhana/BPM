async function getUsers() {
     let url= "/users";
     let res = await fetch(url);
     let replay = await res.json();
     let users= replay.data;
    let s = "";
    for (let user_id in users) {
        s += `<option value="${users[user_id].id}">${users[user_id].full_name}</option>`;
    }
    document.getElementById("selectPatients").innerHTML = s;
 }
async function getMeasures(){
    let url= "/measures";
    let res = await fetch(url);
    let replay = await res.json();
 }
async function AddMeasures() {
    let user_id= document.getElementById("selectPatients").value;
    let systolic = document.getElementById("systolic").value;
    let diastolic = document.getElementById("diastolic").value;
    let pulse = document.getElementById("pulse").value;

    if (!systolic || !diastolic || !pulse) {
        alert('Please fill in all measurement fields');
        return;
    }
         let url= "/measures";
         let res = await fetch(url,{
            method:'POST',
            headers:{
                "Content-Type": 'application/json'
            },
            body:JSON.stringify({
                user_id: user_id,
                sys_high: systolic,
                dia_low: diastolic,
                pulse: pulse
            }),
        });
        let data = await res.json();
        if (data.message){
            alert(data.message);
        } else {
        alert("Measurement saved successfully!");
        }
}
async function CreateMeasuresTable(){
    let user_id= document.getElementById("selectPatients").value;
    let startDate= document.getElementById("startDate").value;
    let endDate= document.getElementById("endDate").value;

    let url= "/measuresByUId";
    let res = await fetch(url,{
        method:'POST',
        headers:{
            "Content-Type": 'application/json'
        },
        body:JSON.stringify({
            user_id: user_id,
            startDate: startDate,
            endDate: endDate
        }),
    });
    let replay = await res.json();
    let data = replay.data;
    let row = "";

    for(let idx in data){
        let measure = data[idx];
        row += "<tr>";
        row += `<td>${Number(idx)+1}</td>`;
        row += `<td>${new Date(measure.date).toLocaleDateString('he-IL')}</td>`;
        row += `<td>${measure.sys_high}</td>`;
        row += `<td>${measure.dia_low}</td>`;
        row += `<td>${measure.pulse}</td>`;
        row += "</tr>";
    }
    document.getElementById("MeasuresTable").innerHTML = row;
}
async function BuildPage(){
   const measures= await getMeasures();
   const users= await getUsers();
    document.getElementById("total-measure").innerHTML=measures.length;
    document.getElementById("total-patients").innerHTML=users.length;
}




