document.getElementById("submit").addEventListener("click", async () => {
    const inputPromt = document.getElementById("eventDescription").value;
    const prompt = '# Einleitung \
                    \
                    Unten befinden sich Informationen zu einer Veranstaltung. Das Ziel\ ist es, diese Veranstaltung zu analysieren und die relevanten\ Informationen als JSON auszugeben. Es soll nur das JSON ausgegeben\ werden, kein Zusatztext.\
                    \
                    - Art: Die Art einer Veranstaltung: Private Veranstaltung,\ Wochenmarkt, Demonstration, etc.\
                    - Ort: Der Ort im Kanton Uri, sollte mindestens die Gemeinde\ beinhalten\
                    - Anzahl Teilnehmer: Zahl der Teilnehmer\
                    - Datum: Wenn bekannt das Datum in der Form dd.MM.yyyy\
                    - Zeit: Wenn bekannt die Uhrzeit in der Form HH:mm\
                    - Ausschank: Boolean-Wert (true, false) ob an der Veranstaltung\ Essen und Getränke verkauft werden\
                    \
                    Wichtig: Wenn eine Information nicht bekannt ist, bitte `null`\ zurückgeben. Bitte gib ein reines unformatiertes JSON zurück.\
                    \
                    # JSON Format\
                    \
                    {\
                        "Art": "<string>",\
                        "Ort": "<string>",\
                        "AnzahlTeilnehmer": <number>,\
                        "Datum": "<date>",\
                        "Zeit": "<time>",\
                        "Ausschank": <bool>\
                    }\
                    \
                    # Information zur Veranstaltung \\ '+ inputPromt;

    try  {
        const request = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body:  JSON.stringify({ prompt : prompt }),
        };

        const response = await fetch("http://localhost:3000/openAPI", request);

        const data = await response.json();
        if (response.ok) {
            document.getElementById("response").innerText = data.response;
        } else {
            document.getElementById("response").innerText = "Error: " + data.error;
        }

        console.log(data);
    } catch (error) {
        console.error(error);
        document.getElementById("response").innerText = "Failed to connect to the server.";
    }
});