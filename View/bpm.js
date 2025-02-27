async function getUsers() {
     let url= "/users";
     let res = await fetch(url);
     let replay = await res.json();
     let users= replay.data;
     const select= document.getElementById("selectPatients")
    if (select){
    let s = '<option value="">Select a patient</option>';
    for (let user_id in users) {
        s += `<option value="${users[user_id].id}" >${users[user_id].full_name}</option>`;
    }
    select.innerHTML = s;

    }
    return users
}
function showMetricsForm() {
    const metricsForm = document.getElementById("metricsForm");
    if (document.getElementById("selectPatients").value) {
        metricsForm.style.display = "block"; // הצגת הטופס
        metricsForm.classList.add("active");
    } else {
        metricsForm.style.display = "none"; // הסתרת הטופס
        metricsForm.classList.remove("active");
    }
}
async function getMeasures(){
    let url= "/measures";
    let res = await fetch(url);
    let replay = await res.json();
    let data=replay.data;
    return data;
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
            row += `<tr class="${measure.critical?'crit':''}">`;
            row += `<td>${Number(idx)+1}</td>`;
            row += `<td>${new Date(measure.date).toLocaleDateString('he-IL')}</td>`;
            row += `<td>${measure.sys_high}</td>`;
            row += `<td>${measure.dia_low}</td>`;
            row += `<td>${measure.pulse}</td>`;
            row += `<td><button onclick="UpdateMeasuresForm(${measure.id})">Edit</button></td>`;
            row += `<td><button onclick="DeleteMeasures(${measure.id})">Delete</button></td>`;
            row += "</tr>";
        }
    document.getElementById("MeasuresTable").innerHTML = row;
}
function UpdateMeasuresForm(idx){
const updateForm = `<div>
        <div class="form-group">
            <label for="systolic">Systolic</label>
            <div class="input-field">
                <input type="number" id="systolic" name="systolic" placeholder="Systolic">
            </div>
        </div>
        <div class="form-group">
            <label for="diastolic">Diastolic</label>
            <div class="input-field">
                <input type="number" id="diastolic" name="diastolic" placeholder="Diastolic">
            </div>
        </div>
        <div class="form-group">
            <label for="pulse">Pulse</label>
            <div class="input-field">
                <input type="number" id="pulse" name="pulse" placeholder="Pulse">
            </div>
        </div>
        <div class="form-group">
            <label for="date">Date</label>
            <div class="input-field">
                <input type="date" id="date" name="date">
            </div>
        </div>
    <button type="submit" onclick="UpdateMeasures(${idx})">
        <i></i> Save Measurement
    </button>
</div>`
    document.getElementById("updateForm").innerHTML = updateForm;
}
async function UpdateMeasures(idx){
    let systolic = document.getElementById("systolic").value;
    let diastolic = document.getElementById("diastolic").value;
    let pulse = document.getElementById("pulse").value;

    if (!systolic || !diastolic || !pulse) {
        alert('Please fill in all measurement fields');
        return;
    }

    let url= `/measures`;
    let res = await fetch(url,{
        method:'PUT',
        headers:{
            "Content-Type": 'application/json'
        },
        body:JSON.stringify({
            idx: idx,
            sys_high: systolic,
            dia_low: diastolic,
            pulse: pulse
        }),
    })
    let data = await res.json();
    await CreateMeasuresTable()
    if (data.message){
        setTimeout(()=>{alert(data.message);},500)
    } else {
        setTimeout(()=>{alert("Measurement updated successfully!");},500)
    }
}
async function DeleteMeasures(idx){
    let url= "/measures";
    let res= await fetch(url,{
        method:'DELETE',
        headers:{
            "Content-Type": 'application/json'
        },
        body:JSON.stringify({idx:idx})
    })
    let data = await res.json();
    await CreateMeasuresTable();
    if (data.message){
        setTimeout(()=>{alert(data.message);},500)
    } else {
        setTimeout(()=>{alert("Measurement deleted successfully!");},500)
    }
}

async function AvgMeasuresByMonth(){
    let month= document.getElementById("month").value;

    let url= "/measuresByMonth";
    let res= await fetch(url,{
        method:'POST',
        headers:{
            "Content-Type": 'application/json'
        },
        body:JSON.stringify({month:month})
    })
    let replay= await res.json()
    let data= replay.data

    let row= ""
    for(let idx in data){
        let measure = data[idx];
        row += `<tr>`;
        row += `<td>${Number(idx)+1}</td>`;
        row += `<td>${measure.userName}</td>`;
        row += `<td>${measure.sysAvg}/ ${measure.sysCnt}</td>`;
        row += `<td>${measure.diaAvg}/ ${measure.diaCnt}</td>`;
        row += `<td>${measure.pulseAvg}/ ${measure.pulseCnt}</td>`;
        row += `<td>${measure.pulseCnt+measure.diaCnt+measure.sysCnt}</td>`;
        row += "</tr>";
    }
    document.getElementById("avgMeasures").innerHTML = row;

}

async function BuildPage(){
   const users= await getUsers();
   const measures= await getMeasures();
    document.getElementById("total-measure").innerHTML=measures.length;
    document.getElementById("total-patients").innerHTML=users.length;
}




