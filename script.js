// Tọa độ chuẩn để hiển thị mặt số mong muốn
const rotations = {
    1: { x: 0, y: 0 },
    2: { x: -90, y: 0 },
    3: { x: 0, y: -90 },
    4: { x: 0, y: 90 },
    5: { x: 90, y: 0 },
    6: { x: 180, y: 0 }
};

let isRolling = false;

function rollDice() {
    if (isRolling) return;
    isRolling = true;

    const cubes = [
        document.getElementById('cube1'),
        document.getElementById('cube2'),
        document.getElementById('cube3')
    ];
    
    let results = [];
    
    // Reset kết quả hiển thị
    document.getElementById('result-score').innerText = "?";
    document.getElementById('result-text').innerText = "Đang lắc...";

    cubes.forEach((cube, index) => {
        const result = Math.floor(Math.random() * 6) + 1;
        results.push(result);
        
        // Thêm ít nhất 3-5 vòng quay ngẫu nhiên để đẹp mắt
        const randomRotate = 360 * (3 + Math.floor(Math.random() * 2)); 
        const posX = rotations[result].x + randomRotate;
        const posY = rotations[result].y + randomRotate;
        
        cube.style.transform = `rotateX(${posX}deg) rotateY(${posY}deg)`;
    });

    // Chờ 1.5s (bằng thời gian transition CSS)
    setTimeout(() => {
        const total = results.reduce((a, b) => a + b, 0);
        const type = total >= 11 ? 'TAI' : 'XIU';
        
        document.getElementById('result-score').innerText = total;
        document.getElementById('result-text').innerText = type;
        
        saveHistory(type);
        isRolling = false;
    }, 1500);
}

function saveHistory(type) {
    const list = document.getElementById('history-list');
    const dot = document.createElement('div');
    dot.className = `dot ${type.toLowerCase()}`;
    
    if(list.children.length >= 14) {
        list.removeChild(list.firstChild);
    }
    list.appendChild(dot);
} 
