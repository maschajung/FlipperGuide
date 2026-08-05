Papa.parse("FilpperGuide.csv?ts=" + new Date().getTime(), {
    download: true,
    header: true,
    skipEmptyLines: true,

    complete(results) {

        console.log("CSV geladen:", results.data.length);

        data = results.data.sort((a, b) =>
            a.Flipper.localeCompare(b.Flipper)
        );

        fill("");
    },

    error(err) {

        console.error(err);

    }

});
