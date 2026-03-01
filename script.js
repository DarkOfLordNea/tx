let user = null; let mode = 'login';
const rotations = { 1:{x:0,y:0}, 2:{x:-90,y:0}, 3:{x:0,y:-90}, 4:{x:0,y:90}, 5:{x:90,y:0}, 6:{x:180,y:0} };

function toggleAuthModal() { document.getElementById('auth-modal').style.display = 'block'; }
function showAuth(m) { mode = m; }

document.getElementById('auth-form').onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const res = await fetch(`http://localhost:3000/${mode}`, {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({username, password})
    });
    const data = await res.json();
    if(res.ok) {
        user = data.user;
        updateUI();
        document.getElementById('auth-modal').style.display = 'none';
    } else alert(data.msg);
};

function updateUI() {
    document.getElementById('user-display').innerText = user.username;
    document.getElementById('balance-display').innerText = user.balance.toLocaleString() + 'đ';
}

async function placeBet(choice) {
    if(!user) return toggleAuthModal();
    const bet = parseInt(prompt("Nhập tiền cược:", "1000"));
    if(!bet || bet > user.balance) return alert("Tiền không hợp lệ");

    const res = await fetch('http://localhost:3000/play', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({username: user.username, bet, choice})
    });
    const data = await res.json();
    
    // Xoay xúc xắc
    data.d.forEach((v, i) => {
        const cube = document.getElementById(`cube${i+1}`);
        cube.style.transform = `rotateX(${rotations[v].x + 1440}deg) rotateY(${rotations[v].y + 1440}deg)`;
    });

    setTimeout(() => {
        user.balance = data.balance; updateUI();
        renderHistory(data.history);
        alert(`${data.win ? 'THẮNG' : 'THUA'}! Kết quả: ${data.total} - ${data.result}`);
    }, 1600);
}

function renderHistory(h) {
    const list = document.getElementById('history-list');
    list.innerHTML = h.map(v => `<div class="dot ${v.result.toLowerCase()}"></div>`).join('');
}

window.onload = async () => {
    const res = await fetch('http://localhost:3000/history');
    renderHistory(await res.json());
};
