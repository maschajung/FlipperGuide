let data = [];

const q = document.getElementById("q");
const l = document.getElementById("list");
const c = document.getElementById("card");
const c = document.getElementById("version");

const csvFile = "filpperguide_v1.csv";

fetch("version.json?ts=" + Date.now(), {
    cache: "no-store"
})
.then(r => r.json())
.then(v => {
    version.innerHTML =
        `📅 Datenstand: ${v.version} &nbsp;&nbsp; 🎱 ${v.flipper} Flipper`;
})
.catch(() => {
    version.innerHTML = "";
});
// CSV laden
loadCSV();

function loadCSV() {

    fetch(csvFile + "?ts=" + Date.now(), {
        cache: "no-store"
    })
        .then(response => {

            if (!response.ok) {
                throw new Error("CSV nicht gefunden (" + response.status + ")");
            }

            console.log("CSV geladen:", response.url);

            return response.text();

        })
        .then(text => {

            Papa.parse(text, {

                header: true,
                skipEmptyLines: true,

                complete(results) {

                    if (results.errors.length > 0) {
                        console.warn("PapaParse:", results.errors);
                    }

                    console.log("Flipper:", results.data.length);
                    console.log("Spalten:", results.meta.fields);

                    data = results.data
                        .filter(x => x.Flipper && x.Flipper.trim() !== "")
                        .sort((a, b) => a.Flipper.localeCompare(b.Flipper));

                    fill("");

                }

            });

        })
        .catch(err => {

            console.error(err);

            c.innerHTML = `
                <h3>Fehler</h3>
                <p>${err.message}</p>
            `;

        });

}

function fill(filter) {

    l.innerHTML = "";

    const treffer = data.filter(x =>
        x.Flipper.toLowerCase().includes(filter.toLowerCase())
    );

    treffer.forEach(x => {

        const option = document.createElement("option");

        option.value = x.Flipper;
        option.textContent = x.Flipper;

        l.appendChild(option);

    });

    if (l.options.length > 0) {

        l.selectedIndex = 0;
        show();

    } else {

        c.innerHTML = "<p>Kein Flipper gefunden.</p>";

    }

}

function show() {

    const x = data.find(a => a.Flipper === l.value);

    if (!x) return;

    let html = `<h3>${x.Flipper}</h3>`;

    Object.entries(x)
        .filter(([key, value]) =>
            key !== "Flipper" &&
            value &&
            value.trim() !== ""
        )
        .forEach(([key, value]) => {

            html += `
                <div class="row">
                    <div class="k">${key}</div>
                    <div>${value}</div>
                </div>
            `;

        });

    c.innerHTML = html;

}

q.addEventListener("input", () => fill(q.value));
l.addEventListener("change", show);

// Service Worker
if ("serviceWorker" in navigator) {

    navigator.serviceWorker.register("service-worker.js")
        .then(() => console.log("Service Worker registriert"))
        .catch(err => console.error(err));

}
