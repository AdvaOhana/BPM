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
async function BuildPage(){
    await getUsers();
    await getMeasures();
    document.getElementById("total-measure").innerHTML=all_measures.length;
    document.getElementById("total-patients").innerHTML=all_users.length;
}


