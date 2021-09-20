// Setup rainbow gradient
// More stops means more gradual
const hexColors = [ "#ff0000", "#ff0600", "#ff0b00", "#ff1100", "#ff1700", "#ff1c00", "#ff2200", "#ff2800", "#ff2e00", "#ff3300", "#ff3900", "#ff3f00", "#ff4400", "#ff4a00", "#ff5000", "#ff5500", "#ff5b00", "#ff6100", "#ff6600", "#ff6c00", "#ff7200", "#ff7700", "#ff7d00", "#ff8300", "#ff8900", "#ff8e00", "#ff9400", "#ff9a00", "#ff9f00", "#ffa500", "#ffa800", "#ffaa00", "#ffad00", "#ffb000", "#ffb200", "#ffb500", "#ffb800", "#ffba00", "#ffbd00", "#ffc000", "#ffc200", "#ffc500", "#ffc800", "#ffca00", "#ffcd00", "#ffcf00", "#ffd200", "#ffd500", "#ffd700", "#ffda00", "#ffdd00", "#ffdf00", "#ffe200", "#ffe500", "#ffe700", "#ffea00", "#ffed00", "#ffef00", "#fff200", "#f6ee00", "#edea00", "#e5e600", "#dce200", "#d3de00", "#cada00", "#c1d600", "#b9d300", "#b0cf00", "#a7cb00", "#9ec700", "#95c300", "#8dbf00", "#84bb00", "#7bb700", "#72b300", "#6aaf00", "#61ab00", "#58a700", "#4fa300", "#469f00", "#3e9c00", "#359800", "#2c9400", "#239000", "#1a8c00", "#128800", "#098400", "#008000", "#007b09", "#007712", "#00721b", "#006e24", "#00692e", "#006537", "#006040", "#005b49", "#005752", "#00525b", "#004e64", "#00496d", "#004576", "#004080", "#003b89", "#003792", "#00329b", "#002ea4", "#0029ad", "#0025b6", "#0020bf", "#001bc8", "#0017d1", "#0012db", "#000ee4", "#0009ed", "#0005f6", "#0000ff", "#0300fb", "#0500f6", "#0800f2", "#0b00ed", "#0d00e9", "#1000e4", "#1300e0", "#1500db", "#1800d7", "#1b00d2", "#1d00ce", "#2000c9", "#2300c5", "#2600c1", "#2800bc", "#2b00b8", "#2e00b3", "#3000af", "#3300aa", "#3600a6", "#3800a1", "#3b009d", "#3e0098", "#400094", "#43008f", "#46008b", "#480086", "#4b0082", "#510586", "#57098a", "#5c0e8e", "#621391", "#681795", "#6e1c99", "#74219d", "#7a25a1", "#7f2aa5", "#852ea9", "#8b33ac", "#9138b0", "#973cb4", "#9d41b8", "#a246bc", "#a84ac0", "#ae4fc4", "#b454c7", "#ba58cb", "#bf5dcf", "#c562d3", "#cb66d7", "#d16bdb", "#d76fdf", "#dd74e2", "#e279e6", "#e87dea", "#ee82ee", "#ef7de6", "#ef79dd", "#f074d5", "#f06fcc", "#f16bc4", "#f266bb", "#f262b3", "#f35daa", "#f358a2", "#f45499", "#f54f91", "#f54a88", "#f64680", "#f74177", "#f73c6f", "#f83866", "#f8335e", "#f92e55", "#fa2a4d", "#fa2544", "#fb203c", "#fb1c33", "#fc172b", "#fd1322", "#fd0e1a", "#fe0911", "#fe0509", "#ff0000", ];
const steps = hexColors.length
const maxMessageLength = 250;
const url = "https://www.reddit.com/r/all/comments.json?limit=100";

const comments = [];
let messageCount = 0;

function fetchComments(callback) {
  console.log("fetching comments...");
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const shortComments = data.data.children.filter(
        (comment) => comment.data.body.length < maxMessageLength
      );
      comments.push(...shortComments);
      console.log(`${comments.length} comments in queue`);
      if (callback) {
        callback();
      }
    });
}

const commentTemplate = document.createElement("template");
commentTemplate.innerHTML = `<div class="comment"></div>`;

function nozzle() {
  const app = document.querySelector("#app");
  const loading = app.querySelector(".loading");
  loading.style.display = "none";

  function renderNewComment() {
    let comment = comments.pop();

    const clone = commentTemplate.content.cloneNode(true);
    const commentEl = clone.querySelector("div");

    commentEl.innerText = comment.data.body;
    commentEl.style["backgroundColor"] = hexColors[messageCount];
    app.prepend(commentEl);

    messageCount += 1;
    if (messageCount >= steps) {
      messageCount = 0;
    }

    if (comments.length < 10) {
      fetchComments();
    }
  }

  for (let i = 0; i < 20; i++) {
    renderNewComment();
  }

  setInterval(renderNewComment, 1000);
}

// kick it off
fetchComments(nozzle);
