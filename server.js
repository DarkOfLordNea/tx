const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const USER_FILE = './users.json';
const HIST_FILE = './history.json';

// Tự động tạo file dữ liệu nếu chưa có
const initFile = (file) => { if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify([])); };
initFile(USER_FILE); initFile(HIST_FILE);

const getData = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const saveData = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// Đăng ký & Tặng 50k
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    let users = getData(USER_FILE);
    if (users.find(u => u.username === username)) return res.status(400).json({ msg: "Tên đã tồn tại!" });
    const newUser = { username, password, balance: 50000 };
    users.push(newUser);
    saveData(USER_FILE, users);
    res.json({ msg: "Đăng ký thành công! Nhận 50k.", user: newUser });
});

// Đặt cược & Lắc xúc xắc
app.post('/play', (req, res) => {
    const { username, bet, choice } = req.body;
    let users = getData(USER_FILE);
    let user = users.find(u => u.username === username);
    if (!user || user.balance < bet) return res.status(400).json({ msg: "Không đủ tiền!" });

    const dice = [1, 2, 3].map(() => Math.floor(Math.random() * 6) + 1);
    const total = dice.reduce((a, b) => a + b, 0);
    const result = total >= 11 ? 'TAI' : 'XIU';
    const win = choice === result;

    user.balance += win ? bet : -bet;
    saveData(USER_FILE, users);

    let history = getData(HIST_FILE);
    history.push({ result, total, id: Date.now() });
    saveData(HIST_FILE, history.slice(-20));

    res.json({ dice, total, result, win, balance: user.balance, history: history.slice(-20) });
});

app.get('/history', (req, res) => res.json(getData(HIST_FILE).slice(-20)));

app.listen(3000, () => console.log("Server logic đang chạy tại port 3000"));
