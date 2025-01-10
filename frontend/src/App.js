import React, { useState, useEffect } from "react";
import classNames from "classnames";
import "./App.css";

function sendRequestToAPI(filters, dateRange) {
    const requestBody = {
        students: filters.studenci.length > 0 ? filters.studenci : null,
        teachers: filters.wykladowcy.length > 0 ? filters.wykladowcy : null,
        subjects: filters.przedmioty.length > 0 ? filters.przedmioty : null,
        groups: filters.grupy.length > 0 ? filters.grupy : null,
        rooms: filters.sale.length > 0 ? filters.sale : null,
        from: dateRange.from || null,
        to: dateRange.to || null,
    };
    fetch("http://localhost:8000/plan", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("Otrzymane dane z API:", data);
            alert("Dane zostały pomyślnie pobrane!");
        })
        .catch((error) => {
            console.error("Błąd podczas wysyłania żądania do API:", error);
            alert("Wystąpił błąd podczas komunikacji z API.");
        });
}


function App() {
    const [activeFilters, setActiveFilters] = useState({});
    const [viewType, setViewType] = useState("Dzienny");
    const [filters, setFilters] = useState({
        studenci: [],
        wykladowcy: [],
        grupy: [],
        kierunki: [],
        przedmioty: [],
        typStudiow: "",
        rokStudiow: "",
        wydzialy: "",
        budynki: "",
        sale: "",
    });
    const [dateRange, setDateRange] = useState({
        from: "",
        to: "",
    });

    const showPlan = () => {
        setActiveFilters(filters); // Ustawia aktywne filtry na te aktualnie wybrane
        sendRequestToAPI(filters, dateRange); // Wysyła żądanie do API
    };


    const setFiltersFromUrl = () => {
        const queryParams = new URLSearchParams(window.location.search);
        const newFilters = {};

        queryParams.forEach((value, key) => {
            if (newFilters[key]) {
                // Jeśli filtr jest tablicą, dodaj wartość do istniejącej tablicy
                if (Array.isArray(newFilters[key])) {
                    newFilters[key].push(value);
                } else {
                    // Przekształć w tablicę
                    newFilters[key] = [newFilters[key], value];
                }
            } else {
                // Ustaw wartość bezpośrednio
                newFilters[key] = value;
            }
        });

        // Ustaw odczytane filtry w stanie
        setFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
        }));
        console.log("UWAGA: ",filters);
    };

    useEffect(() => {
        setFiltersFromUrl();
    }, []);

    return (
        <div className="App">
            <header className="header">Lepszy Plan</header>

            <div className="container">
                <Filters filters={filters} setFilters={setFilters}/>
                <button onClick={showPlan} className={activeFilters === filters ? "active" : ""}>
                    Pokaż plan
                </button>
                <PlanView viewType={viewType} setViewType={setViewType} activeFilters={activeFilters}/>
                <Statistics/>
            </div>

            <footer className="footer">Strona stworzona przez projekt-syzyfy</footer>
        </div>
    );
}

function Filters({filters, setFilters }) {
    const [newAlbumNumber, setNewAlbumNumber] = useState("");

    // Dodawanie numeru albumu do listy
    const addAlbumNumber = () => {
        if (newAlbumNumber.trim() === "") {
            alert("Numer albumu nie może być pusty.");
            return;
        }
        setFilters((prevFilters) => ({
            ...prevFilters,
            studenci: [...prevFilters.studenci, newAlbumNumber],
        }));
        setNewAlbumNumber(""); // Wyczyść pole tekstowe
    };

    // Usuwanie numeru albumu z listy
    const removeAlbumNumber = (albumNumber) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            studenci: prevFilters.studenci.filter((num) => num !== albumNumber),
        }));
    };
    const handleFilterChange = (filterName, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterName]: value,
        }));
    };
    const handleSaveFilters = () => {
        try {
            console.log("Filtry przed serializacją:", filters); // Dodaj logowanie
            localStorage.setItem("ulubioneFiltry", JSON.stringify(filters));
            alert("Filtry zapisane do ulubionych!");
        } catch (error) {
            console.error("Błąd podczas zapisywania filtrów:", error);
            alert("Wystąpił błąd podczas zapisywania filtrów.");
        }
    };

    const handleCopyToClipboard = () => {
        // Tworzenie query stringa z filtrów
        const queryString = Object.entries(filters)
            .map(([key, value]) => {
                // Sprawdzamy, czy wartość jest tablicą i odpowiednio ją przetwarzamy
                if (Array.isArray(value)) {
                    return value.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join('&');
                }
                return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
            })
            .join('&');

        // Stworzenie pełnego URL z query stringiem
        const baseUrl = "http://localhost:3000"; // Zmień na rzeczywisty URL, jeśli jest inny
        const fullUrl = `${baseUrl}?${queryString}`;

        // Kopiowanie linku do schowka
        navigator.clipboard.writeText(fullUrl).then(() => {
            alert("Link skopiowany do schowka!"); // Informacja o skopiowanym linku
        }).catch((error) => {
            console.error("Błąd podczas zapisywania do schowka:", error);
            alert("Wystąpił błąd podczas zapisywania do schowka.");
        });
    };

    return (
        <div className="filters">
            {["wykladowcy", "grupy", "kierunki", "przedmioty"].map((filter) => (
                <div className="filter-group" key={filter}>
                    <label>{filter}</label>
                    <select
                        multiple
                        value={filters[filter]}
                        onChange={(e) =>
                            handleFilterChange(
                                filter,
                                Array.from(e.target.selectedOptions, (option) => option.value)
                            )
                        }
                    >
                        <option value={`${filter} 1`}>{`${filter} 1`}</option>
                        <option value={`${filter} 2`}>{`${filter} 2`}</option>
                    </select>
                </div>
            ))}
            {["typStudiow", "rokStudiow", "wydzialy", "budynki", "sale"].map((filter) => (
                <div className="filter-group" key={filter}>
                    <label>{filter}</label>
                    <select
                        value={filters[filter]}
                        onChange={(e) => handleFilterChange(filter, e.target.value)}
                    >
                        <option value="">{`Wybierz ${filter}`}</option>
                        <option value={`${filter} 1`}>{`${filter} 1`}</option>
                        <option value={`${filter} 2`}>{`${filter} 2`}</option>
                    </select>
                </div>
            ))}
            {/* Specjalna sekcja dla studentów */}
            <div className="filter-group">
                <label>Studenci (Numery albumów)</label>
                <div className="student-albums">
                    <input
                        type="text"
                        value={newAlbumNumber}
                        placeholder="Wpisz numer albumu"
                        onChange={(e) => setNewAlbumNumber(e.target.value)}
                    />
                    <button onClick={addAlbumNumber}>Dodaj</button>
                </div>
                <ul>
                    {filters.studenci.map((albumNumber, index) => (
                        <li key={index}>
                            {albumNumber}{" "}
                            <button className="small" onClick={() => removeAlbumNumber(albumNumber)}>
                                <i className="fas fa-trash icon"></i>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="buttons">
                <button onClick={handleSaveFilters}>Zapisz filtry do ulubionych</button>
                <button onClick={handleCopyToClipboard}>Kopiuj do schowka</button>
            </div>
        </div>
    );

}

function PlanView({ viewType, setViewType, activeFilters }) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Przykładowe dane
    const exampleSchedule = [
        { time: "08:00 - 09:30", day: "Poniedziałek", subject: "Algorytmy", lecturer: "dr Kowalski", room: "Sala 101" },
        { time: "10:00 - 11:30", day: "Wtorek", subject: "Bazy danych", lecturer: "prof. Nowak", room: "Sala 202" },
        // więcej danych...
    ];

    const getWeeklySchedule = () => {
        const days = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"];
        return days.map((day) => ({
            day,
            schedule: exampleSchedule.filter((entry) => entry.day === day),
        }));
    };

    const getMonthlySchedule = () => {
        const totalDays = 30; // lub dynamicznie obliczaj dni w miesiącu
        const weeks = [];
        for (let i = 0; i < 5; i++) {
            weeks.push(Array.from({ length: 7 }, (_, j) => i * 7 + j + 1 > totalDays ? null : i * 7 + j + 1));
        }
        return weeks;
    };

    return (
        <div className="plan-view">
            <header>
                <div>
                    <label htmlFor="view-type">Widok:</label>
                    <select id="view-type" value={viewType} onChange={(e) => setViewType(e.target.value)}>
                        <option value="Dzienny">Dzienny</option>
                        <option value="Tygodniowy">Tygodniowy</option>
                        <option value="Miesięczny">Miesięczny</option>
                    </select>
                </div>
            </header>
            <div id="schedule">
                {viewType === "Dzienny" && (
                    <div>
                        <h3>Plan dzienny</h3>
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
                {viewType === "Tygodniowy" && (
                    <div className="week-grid">
                        {getWeeklySchedule().map((day, index) => (
                            <div key={index} className="day-column">
                                <h4>{day.day}</h4>
                                {day.schedule.map((entry, i) => (
                                    <div key={i} className="plan">
                                        <div className="time">{entry.time}</div>
                                        <div>{entry.subject}</div>
                                        <div>{entry.room}</div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
                {viewType === "Miesięczny" && (
                    <div className="month-grid">
                        {getMonthlySchedule().map((week, i) => (
                            <div key={i} className="week-row">
                                {week.map((day, j) => (
                                    <div
                                        key={j}
                                        className={classNames("day-cell", {empty: !day})}
                                    >
                                        {day ? <span>{day}</span> : ""}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

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
