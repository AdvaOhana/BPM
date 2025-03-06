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
        metricsForm.style.display = "block";
        metricsForm.classList.add("active");
    } else {
        metricsForm.style.display = "none";
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
    let date = document.getElementById("date").value;

    if (!systolic || !diastolic || !pulse || !date) {
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
                pulse: pulse,
                date:date
            }),
        });
        let data = await res.json();
        if (data.msg){
        alert("Measurement saved successfully!");
        }
}
async function CreateMeasuresTable(){
    let user_id= document.getElementById("selectPatients").value;
    let startDate= document.getElementById("startDate").value;
    let endDate= document.getElementById("endDate").value;
    let url = "/measuresByUId";
    let res = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            user_id: user_id,
            startDate: startDate,
            endDate: endDate
        }),
    });
    let replay = await res.json();
    let data = replay.data;
    let row = "";
    for (let idx in data) {
        let measure = data[idx];
        row += `<tr class="${measure.critical ? 'crit' : ''}">`;
        row += `<td>${Number(idx) + 1}</td>`;
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
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.id = 'modalOverlay';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content glossy';

    modalContent.innerHTML = `
        <div class="form-container">
            <h2>Update Measurement</h2>
            <div class="form-group">
                <label for="systolic">Systolic</label>
                <div class="input-field">
                    <input type="number" min="0" id="systolic" name="systolic" placeholder="Systolic">
                </div>
            </div>
            <div class="form-group">
                <label for="diastolic">Diastolic</label>
                <div class="input-field">
                    <input type="number" min="0" id="diastolic" name="diastolic" placeholder="Diastolic">
                </div>
            </div>
            <div class="form-group">
                <label for="pulse">Pulse</label>
                <div class="input-field">
                    <input type="number" min="0" id="pulse" name="pulse" placeholder="Pulse">
                </div>
            </div>
            <div class="form-group">
                <label for="date">Date</label>
                <div class="input-field">
                    <input type="date" id="date" name="date">
                </div>
            </div>
            <div class="modal-buttons">
                <button type="submit" onclick="UpdateMeasures(${idx})">Save Measurement</button>
                <button type="button" class="cancel-btn" onclick="closeModal()">Cancel</button>
            </div>
        </div>
    `;

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    modalOverlay.addEventListener('click', function(event) {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });

    setTimeout(() => {
        modalOverlay.classList.add('active');
    }, 10);
}
function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(modalOverlay);
        }, 300);
    }
}
async function UpdateMeasures(idx){
    let systolic = document.getElementById("systolic").value;
    let diastolic = document.getElementById("diastolic").value;
    let pulse = document.getElementById("pulse").value;
    let date = document.getElementById("date").value;


    if (!systolic || !diastolic || !pulse || !date) {
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
            pulse: pulse,
            date:date
        }),
    })
    let data = await res.json();
    closeModal();
    await CreateMeasuresTable()
    if (data.msg){
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
    let year= document.getElementById("year").value;
    if (!month|| !year){
        alert('Please fill in all the fields');
        return;
    }
    let url= "/measuresByMonth";
    let res= await fetch(url,{
        method:'POST',
        headers:{
            "Content-Type": 'application/json'
        },
        body:JSON.stringify({
            month:month,
            year:year
        })
    })
    if (!res.ok){
        alert("No measurement found in that dates.");
    }
    let replay= await res.json()
    let data= replay.data

    let row= ""
    for(let idx in data){
        let measure = data[idx];
        row += `<tr>`;
        row += `<td>${Number(idx)+1}</td>`;
        row += `<td>${measure.userName}</td>`;
        row += `<td>${measure.sysAvg}/ ${measure.sysCnt||0}</td>`;
        row += `<td>${measure.diaAvg}/ ${measure.diaCnt||0}</td>`;
        row += `<td>${measure.pulseAvg}/ ${measure.pulseCnt||0}</td>`;
        row += `<td>${measure.total}</td>`;
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




