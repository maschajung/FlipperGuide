let data = [];

const q = document.getElementById("q"),
      l = document.getElementById("list"),
      c = document.getElementById("card");

Papa.parse("FilpperGuide.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
        data = results.data.sort((a, b) =>
            a.Flipper.localeCompare(b.Flipper)
        );
        fill("");
    }
});

function fill(f) {
    l.innerHTML = "";

    let treffer = data.filter(x =>
        x.Flipper.toLowerCase().includes(f.toLowerCase())
    );

    treffer.forEach(x => {
        let o = document.createElement("option");
        o.value = x.Flipper;
        o.textContent = x.Flipper;
        l.appendChild(o);
    });

    if (l.options.length > 0) {
        l.selectedIndex = 0;
    }

    show();
}

function show() {
    let x = data.find(a => a.Flipper === l.value) || data[0];
    if (!x) return;

    c.innerHTML =
        "<h3>" + x.Flipper + "</h3>" +
        Object.entries(x)
            .filter(e => e[0] !== "Flipper")
            .map(e =>
                "<div class='row'><div class='k'>" +
                e[0] +
                "</div><div>" +
                e[1] +
                "</div></div>"
            )
            .join("");
}

q.oninput = () => fill(q.value);
l.onchange = show;

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
}
