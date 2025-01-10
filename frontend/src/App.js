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
        sale: [],
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
                <button className="show-schedule" onClick={showPlan} className={activeFilters === filters ? "show-schedule active" : "show-schedule"}>
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
    const [newTeacher, setNewTeacher] = useState("");
    const [newDirection, setNewDirection] = useState("");
    const [newSubject, setNewSubject] = useState("");
    const [newRoom, setNewRoom] = useState("");

    // Uniwersalna funkcja dodawania
    const addItemToList = (key, value) => {
        if (value.trim() === "") {
            alert(`${key} nie może być puste.`);
            return;
        }
        setFilters((prevFilters) => ({
            ...prevFilters,
            [key]: [...prevFilters[key], value],
        }));
    };

    // Uniwersalna funkcja usuwania
    const removeItemFromList = (key, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [key]: prevFilters[key].filter((item) => item !== value),
        }));
    };

    // Specjalistyczne funkcje dla każdej grupy
    const addTeacher = () => addItemToList("wykladowcy", newTeacher);
    const removeTeacher = (teacher) => removeItemFromList("wykladowcy", teacher);

    const addDirection = () => addItemToList("kierunki", newDirection);
    const removeDirection = (direction) =>
        removeItemFromList("kierunki", direction);

    const addSubject = () => addItemToList("przedmioty", newSubject);
    const removeSubject = (subject) => removeItemFromList("przedmioty", subject);

    const addRoom = () => addItemToList("sale", newRoom);
    const removeRoom = (room) => removeItemFromList("sale", room);
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


            {/* Wykładowcy */}
            <div className="filter-group">
                <h2>Wykładowcy</h2>
                <input
                    type="text"
                    value={newTeacher}
                    placeholder="Wpisz nazwisko wykładowcy"
                    onChange={(e) => setNewTeacher(e.target.value)}
                />
                <button onClick={addTeacher}>Dodaj</button>
                <ul>
                    {filters.wykladowcy.map((teacher, index) => (
                        <li key={index}>
                            {teacher}{" "}
                            <button className="button-small" onClick={() => removeTeacher(teacher)}><i className="fas fa-trash"></i></button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Kierunki */}
            <div className="filter-group">
                <h2>Kierunki</h2>
                <input
                    type="text"
                    value={newDirection}
                    placeholder="Wpisz nazwę kierunku"
                    onChange={(e) => setNewDirection(e.target.value)}
                />
                <button onClick={addDirection}>Dodaj</button>
                <ul>
                    {filters.kierunki.map((direction, index) => (
                        <li key={index}>
                            {direction}{" "}
                            <button className="button-small" onClick={() => removeDirection(direction)}><i className="fas fa-trash"></i></button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Przedmioty */}
            <div className="filter-group">
                <h2>Przedmioty</h2>
                <input
                    type="text"
                    value={newSubject}
                    placeholder="Wpisz nazwę przedmiotu"
                    onChange={(e) => setNewSubject(e.target.value)}
                />
                <button onClick={addSubject}>Dodaj</button>
                <ul>
                    {filters.przedmioty.map((subject, index) => (
                        <li key={index}>
                            {subject}{" "}
                            <button className="button-small" onClick={() => removeSubject(subject)}><i className="fas fa-trash"></i></button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Sale */}
            <div className="filter-group">
                <h2>Sale</h2>
                <input
                    type="text"
                    value={newRoom}
                    placeholder="Wpisz numer sali"
                    onChange={(e) => setNewRoom(e.target.value)}
                />
                <button onClick={addRoom}>Dodaj</button>
                <ul>
                    {filters.sale.map((room, index) => (
                        <li key={index}>
                            {room}{" "}
                            <button className="button-small" onClick={() => removeRoom(room)}><i className="fas fa-trash"></i></button>
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

function PlanView({viewType, setViewType, activeFilters}) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Przykładowe dane
    const exampleSchedule = [
        {time: "08:00 - 09:30", day: "Poniedziałek", subject: "Algorytmy", lecturer: "dr Kowalski", room: "Sala 101"},
        {time: "10:00 - 11:30", day: "Wtorek", subject: "Bazy danych", lecturer: "prof. Nowak", room: "Sala 202"},
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
                    // <div className="month-grid">
                    //     {getMonthlySchedule().map((week, i) => (
                    //         <div key={i} className="week-row">
                    //             {week.map((day, j) => (
                    //                 <div
                    //                     key={j}
                    //                     className={classNames("day-cell", {empty: !day})}
                    //                 >
                    //                     {day ? <span>{day}</span> : ""}
                    //                 </div>
                    //             ))}
                    //         </div>
                    //     ))}
                    // </div>
                    <div className="month-grid">
                        {/* Nagłówek z dniami tygodnia */}
                        <div className="week-header">
                            {["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"].map((day, index) => (
                                <div key={index} className="day-header day-column">{day}</div>
                            ))}
                    </div>
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
