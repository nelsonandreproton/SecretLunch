const STORAGE_KEY = 'team-selector-state';

let state = loadState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : { teams: [] };
}

function addTeam() {
  const name = document.getElementById('teamName').value.trim();
  if (!name) return;

  state.teams.push({
    id: crypto.randomUUID(),
    name,
    members: []
  });

  document.getElementById('teamName').value = '';
  saveState();
  renderTeams();
}

function addMember() {
  const team = getSelectedTeam();
  const name = document.getElementById('memberName').value.trim();
  if (!team || !name) return;

  team.members.push({
    id: crypto.randomUUID(),
    name,
    selectedCount: 0
  });

  document.getElementById('memberName').value = '';
  saveState();
  renderMembers();
}

function getSelectedTeam() {
  const id = document.getElementById('teamSelect').value;
  return state.teams.find(t => t.id === id);
}

function renderTeams() {
  const select = document.getElementById('teamSelect');
  select.innerHTML = '';
  state.teams.forEach(team => {
    const opt = document.createElement('option');
    opt.value = team.id;
    opt.textContent = team.name;
    select.appendChild(opt);
  });
  renderMembers();
}

function renderMembers() {
  const team = getSelectedTeam();
  const list = document.getElementById('memberList');
  list.innerHTML = '';
  if (!team) return;

  team.members.forEach(m => {
    const li = document.createElement('li');
    li.textContent = `${m.name} (selected ${m.selectedCount})`;
    list.appendChild(li);
  });
}

function selectMembers() {
  let output = '';

  state.teams.forEach(team => {
    if (team.members.length === 0) return;

    const minCount = Math.min(...team.members.map(m => m.selectedCount));
    const pool = team.members.filter(m => m.selectedCount === minCount);
    const selected = pool[Math.floor(Math.random() * pool.length)];

    selected.selectedCount++;
    output += `${team.name} → ${selected.name}\n`;
  });

  saveState();
  renderMembers();
  document.getElementById('results').textContent = output;
}

renderTeams();
