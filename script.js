let history = {};
let participants = [];

function updateGroupCount() {
    document.getElementById("groupCountValue").textContent = document.getElementById("groupCount").value;
}

function addParticipant() {
    let nameInput = document.getElementById("nameInput");
    let name = nameInput.value.trim();
    if (name && !participants.includes(name)) {
        participants.push(name);
        updateParticipantList();
    }
    nameInput.value = "";
}

function updateParticipantList() {
    let list = document.getElementById("participantList");
    list.innerHTML = "";
    participants.forEach((name, index) => {
        let li = document.createElement("li");
        li.textContent = name;
        let removeBtn = document.createElement("button");
        removeBtn.textContent = "削除";
        removeBtn.onclick = () => {
            participants.splice(index, 1);
            updateParticipantList();
        };
        li.appendChild(removeBtn);
        list.appendChild(li);
    });
}

function groupPeople() {
    let groupCount = parseInt(document.getElementById("groupCount").value);
    if (participants.length < groupCount * 2) {
        alert("人数が少なすぎます。");
        return;
    }
    
    let shuffled = shuffleArray(participants);
    let groups = createGroups(shuffled, groupCount);
    updateHistory(groups);
    displayGroups(groups);
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function createGroups(names, groupCount) {
    let groups = Array.from({ length: groupCount }, () => []);
    for (let name of names) {
        let availableGroups = groups.filter(group => group.length < 4 && !hasHistoryConflict(group, name));
        if (availableGroups.length === 0) availableGroups = groups.filter(group => group.length < 4);
        availableGroups[0].push(name);
    }
    return groups;
}

function hasHistoryConflict(group, name) {
    return group.some(member => history[name]?.includes(member));
}

function updateHistory(groups) {
    for (let group of groups) {
        for (let member of group) {
            if (!history[member]) history[member] = [];
            history[member] = [...new Set([...history[member], ...group.filter(m => m !== member)])];
        }
    }
}

function displayGroups(groups) {
    let resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";
    groups.forEach((group, index) => {
        let groupText = `グループ${index + 1}: ${group.join(", ")}`;
        let p = document.createElement("p");
        p.textContent = groupText;
        resultDiv.appendChild(p);
    });
}