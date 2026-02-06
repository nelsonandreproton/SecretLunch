// State Management
const STORAGE_KEY = 'teamSelectorState';

let state = {
    teams: []
};

let activeTeamId = null;

// DOM Elements
const els = {
    newTeamName: document.getElementById('newTeamName'),
    addTeamBtn: document.getElementById('addTeamBtn'),
    teamsContainer: document.getElementById('teamsContainer'),
    activeTeamArea: document.getElementById('activeTeamArea'),
    activeTeamTitle: document.getElementById('activeTeamTitle'),
    newMemberName: document.getElementById('newMemberName'),
    addMemberBtn: document.getElementById('addMemberBtn'),
    membersList: document.getElementById('membersList'),
    selectMembersBtn: document.getElementById('selectMembersBtn'),
    resultsContainer: document.getElementById('resultsContainer')
};

// Initialization
function init() {
    loadState();
    renderTeams();
    setupEventListeners();
}

function loadState() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        state = JSON.parse(stored);
    }
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setupEventListeners() {
    els.addTeamBtn.addEventListener('click', addTeam);
    els.addMemberBtn.addEventListener('click', addMember);
    els.selectMembersBtn.addEventListener('click', selectMembers);
}

// Core Logic
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function addTeam() {
    const name = els.newTeamName.value.trim();
    if (!name) return;

    const newTeam = {
        id: generateId(),
        name: name,
        members: []
    };

    state.teams.push(newTeam);
    saveState();
    renderTeams();
    els.newTeamName.value = '';
    
    // Auto-select the new team
    setActiveTeam(newTeam.id);
}

function setActiveTeam(teamId) {
    activeTeamId = teamId;
    renderTeams(); // To update active styling
    renderMembers();
}

function addMember() {
    if (!activeTeamId) return;
    
    const name = els.newMemberName.value.trim();
    if (!name) return;

    const team = state.teams.find(t => t.id === activeTeamId);
    if (team) {
        team.members.push({
            id: generateId(),
            name: name,
            selectedCount: 0
        });
        saveState();
        renderMembers();
        renderTeams(); // Update member count in team list
        els.newMemberName.value = '';
    }
}

function selectMembers() {
    els.resultsContainer.innerHTML = '';
    
    state.teams.forEach(team => {
        if (team.members.length === 0) return;

        // 1. Determine minimum selectedCount
        const minCount = Math.min(...team.members.map(m => m.selectedCount));

        // 2. Build pool of candidates
        const pool = team.members.filter(m => m.selectedCount === minCount);

        // 3. Randomly select one
        const winnerIndex = Math.floor(Math.random() * pool.length);
        const winner = pool[winnerIndex];

        // 4. Increment count (in the original array reference)
        const originalMember = team.members.find(m => m.id === winner.id);
        originalMember.selectedCount++;

        // Render Result
        const resultCard = document.createElement('div');
        resultCard.className = 'result-card';
        resultCard.innerHTML = `
            <strong>${team.name}</strong>
            <span>${winner.name}</span>
        `;
        els.resultsContainer.appendChild(resultCard);
    });

    // 5. Persist
    saveState();
}

// Rendering
function renderTeams() {
    els.teamsContainer.innerHTML = '';
    
    state.teams.forEach(team => {
        const div = document.createElement('div');
        div.className = `team-item ${team.id === activeTeamId ? 'active' : ''}`;
        div.innerHTML = `
            <span>${team.name}</span>
            <small>${team.members.length} members</small>
        `;
        div.onclick = () => setActiveTeam(team.id);
        els.teamsContainer.appendChild(div);
    });
}

function renderMembers() {
    if (!activeTeamId) {
        els.activeTeamArea.classList.add('hidden');
        return;
    }

    const team = state.teams.find(t => t.id === activeTeamId);
    if (!team) return;

    els.activeTeamArea.classList.remove('hidden');
    els.activeTeamTitle.textContent = `Members of ${team.name}`;
    els.membersList.innerHTML = '';

    if (team.members.length === 0) {
        els.membersList.innerHTML = '<p style="color:#666; font-style:italic;">No members yet.</p>';
        return;
    }

    team.members.forEach(member => {
        const li = document.createElement('li');
        li.style.padding = '8px';
        li.style.borderBottom = '1px solid #eee';
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.innerHTML = `
            <span>${member.name}</span>
            <span style="font-size:0.8em; color:#999;">Selected: ${member.selectedCount}</span>
        `;
        els.membersList.appendChild(li);
    });
}

// Run
init();