async function getUsers() {
     let url= "/users";
     let res = await fetch(url);
     let replay = await res.json();
    all_users= replay.data;
 }
async function getMeasures(){
    let url= "/measures";
    let res = await fetch(url);
    let replay = await res.json();
    all_measures= replay.data;
 }
async function BuildPage(){
    await getUsers();
    await getMeasures();
    document.getElementById("total-measure").innerHTML=all_measures.length;
    document.getElementById("total-patients").innerHTML=all_users.length;
}
BuildPage();






 document.addEventListener('DOMContentLoaded', function() {
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
    row.addEventListener('mouseenter', () => {
    row.style.transform = 'scale(1.01)';
});
    row.addEventListener('mouseleave', () => {
    row.style.transform = 'scale(1)';
});
});
    setInterval(() => {
    const heartRateValue = document.querySelector('.card:nth-child(3) .card-value');
    const currentValue = parseInt(heartRateValue.textContent);
    const newValue = currentValue + Math.floor(Math.random() * 3) - 1;
    heartRateValue.innerHTML = `${newValue} <span>bpm</span>`;
}, 3000);
});
