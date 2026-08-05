let data = [];

const q = document.getElementById("q");
const l = document.getElementById("list");
const c = document.getElementById("card");

// Immer aktuelle CSV laden (kein Browser-Cache)
Papa.parse("FilpperGuide.csv?ts=" + Date.now(), {
    download: true,
    header: true,
    skipEmptyLines: true,

    complete: function (results) {

        console.log("CSV geladen:", results.data.length + " Flipper");

        data = results.data
            .filter(x => x.Flipper && x.Flipper.trim() !== "")
            .sort((a, b) => a.Flipper.localeCompare(b.Flipper));

        fill("");
    },

    error: function (err) {
        console.error("CSV konnte nicht geladen werden:", err);
    }
});

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

    let html = "<h3>" + x.Flipper + "</h3>";

    Object.entries(x)
        .filter(([key, value]) =>
            key !== "Flipper" &&
            value !== "" &&
            value !== null &&
            value !== undefined
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

q.addEventListener("input", function () {
    fill(this.value);
});

l.addEventListener("change", show);

// Service Worker registrieren
if ("serviceWorker" in navigator) {

    navigator.serviceWorker
        .register("service-worker.js")
        .then(() => console.log("Service Worker registriert"))
        .catch(err => console.error(err));

}
