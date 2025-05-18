// 2025-05, powered by gpt...
//
const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
const wChinese = 1.2 * rootFontSize; //1.2rem
//const charsPerColumn = 40; // H * 95vh - borderAndPadding...
const charsPerColumn = Math.floor((window.innerHeight * 0.98 - 44) / wChinese);
const columnsPerPage = Math.floor((window.innerWidth * 0.98 - 24) / (wChinese * 2 + 1));
//const totalColumns = Math.ceil(text.length / charsPerColumn);

let currentPage = 0;
let totalPages = 0;
let allColumns = [];

function buildColumns(text, charsPerColumn) {
  const columns = [];
  const lines = text.split(/\r?\n/); // Handles both \n and \r\n

  lines.forEach(line => {
    //if (line.startsWith('[[') && line.endsWith(']]')) {
    //const title = line.slice(2, -2); // Remove brackets [[]]
    if (line.startsWith('#')) {
      const title = line.slice(1).trim();
      const col = document.createElement('div');
      if (title.length === 0) {
        col.className = 'column';
        col.innerHTML = "&nbsp;";
      } else {
        col.className = 'column title';
        col.textContent = title;
      }
      columns.push(col);
    } else {
      // Break regular text into chunks
      for (let i = 0; i < line.length; i += charsPerColumn) {
        const chunk = line.slice(i, i + charsPerColumn);
        const col = document.createElement('div');
        col.className = 'column';
        col.textContent = chunk;
        columns.push(col);
      }
    }
  });
  return columns;
}

async function loadAndPrepareColumns(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const text = await response.text();

    allColumns = buildColumns(text, charsPerColumn);
    totalPages = Math.ceil(allColumns.length / columnsPerPage);

    renderPage(currentPage);
  } catch (e) {
    console.error("Failed to load or process text:", e);
  }
}

function renderPage(page) {
  const paper = document.getElementById("paper");
  paper.innerHTML = ""; //clear current columns
  const start = page * columnsPerPage;
  const end = start + columnsPerPage;
  allColumns.slice(start, end).forEach(col => paper.appendChild(col));
}

function nextPage() {
  if (currentPage < totalPages - 1) {
    currentPage++;
    renderPage(currentPage);
    const offset = 0;
    paper.style.transform = `translateX(${offset}px)`;
  }
}

function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    const offset = 0;
    paper.style.transform = `translateX(${offset}px)`;
    renderPage(currentPage);
  }
}

loadAndPrepareColumns("raw.txt");

window.addEventListener('resize', () => location.reload()); // refresh on resize for now

//---------------------------------------------
let touchStartX = 0;
let touchEndX = 0;

function handleGesture() {
  const threshold = 50; // min swipe distance
  if (touchEndX < touchStartX - threshold) {
    prevPage();
  }
  if (touchEndX > touchStartX + threshold) {
    nextPage();
  }
}

document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleGesture();
}, false);

document.querySelectorAll('.nav-button').forEach(btn => {
  btn.addEventListener('touchstart', () => {
    btn.classList.add('touched');
    setTimeout(() => {
      btn.classList.remove('touched');
    }, 400); // vanish after 400ms
  });
});

