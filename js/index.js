const repoOwner = "professor-y";
const repoName = "professor-y.github.io";
const branch = "main";

async function fetchGitHubData() {
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/git/trees/${branch}?recursive=1`;
  const res = await fetch(apiUrl);
  const data = await res.json();
  return data.tree;
}

function parseJournalPaths(tree) {
  const articleDirs = tree
    .filter(item => item.path.match(/^\d{4}\/\d{2}\/\d{2}\/index.html$/))
    .map(item => {
      const match = item.path.match(/^(\d{4})\/(\d{2})\/(\d{2})\/index.html$/);
      const date = `${match[1]}-${match[2]}-${match[3]}`;
      const basePath = `${match[1]}/${match[2]}/${match[3]}`;
      return { date, basePath };
    });

  // Sort descending by date
  return articleDirs.sort((a, b) => b.date.localeCompare(a.date));
}

async function fetchRawPreview(basePath) {
  const url = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/${basePath}/raw.txt`;
  try {
    const res = await fetch(url);
    const text = await res.text();
    const lines = text.split("\n");
    // const title = lines[0]?.trim().slice(0, 30) || "(No title)";
    const title = lines[0]?.trim().replace(/#/g, '') || "(No title)";
    const intro = lines.slice(1).join(" ").trim().slice(0, 40).replace(/#/g, '');
    return { title, intro };
  } catch (err) {
    return { title: "(Missing raw.txt)", intro: "" };
  }
}

async function buildIndex() {
  const tree = await fetchGitHubData();
  const articles = parseJournalPaths(tree);
  const container = document.getElementById("index");

  for (const { date, basePath } of articles) {
    const { title, intro } = await fetchRawPreview(basePath);
    const link = `/${basePath}`;

    const entry = document.createElement("div");
    entry.innerHTML = `
      <p class="title">🗓️  <a href="${link}">${date}</a></p>
      <p class="intro">${title}  ${intro}  ....</p>
    `;
    container.appendChild(entry);
  }
}

buildIndex();

