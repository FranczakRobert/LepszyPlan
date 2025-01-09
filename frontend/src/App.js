import React, { useState } from "react";
import "./App.css";

function App() {
    const [viewType, setViewType] = useState("Dzienny");

    const handleSaveFilters = () => {
        alert("Filtry zapisane do ulubionych!");
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText("http://localhost:3000").then(() => {
            alert("Link zapisany do schowka!");
        });
    };

    return (
        <div className="App">
            <header className="header">Lepszy Plan</header>

            <div className="container">
                <Filters />
                <div className="buttons">
                    <button onClick={handleSaveFilters}>Zapisz filtry do ulubionych</button>
                    <button onClick={handleCopyToClipboard}>Zapisz link do schowka</button>
                </div>
                <PlanView viewType={viewType} setViewType={setViewType} />
                <Statistics />
            </div>

            <footer className="footer">Strona stworzona przez projekt-syzyfy</footer>
        </div>
    );
}

function Filters() {
    return (
        <div className="filters">
            {["Studenci", "Wykładowcy", "Grupy", "Kierunki", "Przedmioty"].map((label) => (
                <div className="filter-group" key={label}>
                    <label>{label}</label>
                    <select multiple>
                        <option>{label} 1</option>
                        <option>{label} 2</option>
                    </select>
                </div>
            ))}
            {["Typ studiów", "Rok studiów", "Wydziały", "Budynki", "Sale"].map((label) => (
                <div className="filter-group" key={label}>
                    <label>{label}</label>
                    <select>
                        <option>{label} 1</option>
                        <option>{label} 2</option>
                    </select>
                </div>
            ))}
        </div>
    );
}

function PlanView({ viewType, setViewType }) {
    const [startDate, setStartDate] = useState(""); // Przechowywanie daty początkowej
    const [endDate, setEndDate] = useState(""); // Przechowywanie daty końcowej
    const exampleSchedule = [
        {
            time: "08:00 - 09:30",
            subject: "Algorytmy i struktury danych",
            lecturer: "dr inż. Jan Kowalski",
            room: "Sala 101, Budynek A",
        },
        {
            time: "10:00 - 11:30",
            subject: "Programowanie obiektowe",
            lecturer: "mgr Anna Nowak",
            room: "Sala 202, Budynek B",
        },
        {
            time: "12:00 - 13:30",
            subject: "Bazy danych",
            lecturer: "prof. dr hab. Piotr Wiśniewski",
            room: "Sala 303, Budynek C",
        },
        {
            time: "14:00 - 15:30",
            subject: "Sieci komputerowe",
            lecturer: "dr inż. Marek Zieliński",
            room: "Sala 404, Budynek D",
        },
    ];

    return (
        <div className="plan-view">
            <header>
                <div>
                    <label htmlFor="view-type">Widok:</label>
                    <select
                        id="view-type"
                        value={viewType}
                        onChange={(e) => setViewType(e.target.value)}
                    >
                        <option value="Dzienny">Dzienny</option>
                        <option value="Tygodniowy">Tygodniowy</option>
                        <option value="Miesięczny">Miesięczny</option>
                        <option value="Zakres dat">Zakres dat</option>
                    </select>
                </div>
                {viewType === "Zakres dat" && (
                    <div id="date-range">
                        <label htmlFor="start-date">Od:</label>
                        <input
                            id="start-date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <label htmlFor="end-date">Do:</label>
                        <input
                            id="end-date"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                )}
            </header>
            <div id="schedule">
                {viewType === "Dzienny" && (
                    <div>
                        <h3>Plan zajęć</h3>
                        {exampleSchedule.map((entry, index) => (
                            <div key={index} className="plan">
                                <div className="time">{entry.time}</div>
                                <div className="details">
                                    <div>Przedmiot: {entry.subject}</div>
                                    <div>Wykładowca: {entry.lecturer}</div>
                                    <div>Sala: {entry.room}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {viewType === "Zakres dat" && (
                    <div>
                        <h3>
                            Wybrany zakres:{" "}
                            {startDate && endDate
                                ? `${startDate} - ${endDate}`
                                : "Proszę wybrać zakres dat"}
                        </h3>
                        <p>
                            W przyszłości można tu wyświetlać plan dla wybranego zakresu
                            dat.
                        </p>
                    </div>
                )}
                {viewType !== "Dzienny" && viewType !== "Zakres dat" && (
                    <div>Inne widoki ({viewType}) będą dostępne w przyszłości...</div>
                )}
            </div>
        </div>
    );
}


function Statistics() {
    return (
        <div className="statistics">
            <div>Całkowita liczba godzin: <span id="total-hours">0</span></div>
            <div>Średnia liczba godzin na dzień: <span id="avg-hours">0</span></div>
        </div>
    );
}

export default App;
