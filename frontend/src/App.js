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

    return fetch("http://localhost:8000/plan", {
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
    const [planData, setPlanData] = useState(null);

    const showPlan = () => {
        if (!dateRange.from || !dateRange.to) {
            alert("Proszę wybrać zakres dat.");
            return;
        }
        setActiveFilters(filters);

        sendRequestToAPI(filters, dateRange).then((data) => {
                setPlanData(data); // Set the plan data state
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    const setFiltersFromUrl = () => {
        const queryParams = new URLSearchParams(window.location.search);
        const newFilters = {};

        queryParams.forEach((value, key) => {
            if (newFilters[key]) {
                if (Array.isArray(newFilters[key])) {
                    newFilters[key].push(value);
                } else {
                    newFilters[key] = [newFilters[key], value];
                }
            } else {
                newFilters[key] = value;
            }
        });

        setFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
        }));
    };

    useEffect(() => {
        setFiltersFromUrl();
    }, []);

    return (
        <div className="App">
            <header className="header">Lepszy Plan</header>

            <div className="container">
                <Filters
                    filters={filters}
                    setFilters={setFilters}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                />
                <button
                    onClick={showPlan}
                    className={
                        activeFilters === filters ? "show-schedule active" : "show-schedule"
                    }
                >
                    Pokaż plan
                </button>
                <PlanView viewType={viewType} setViewType={setViewType} dateRange={dateRange} planData={planData}/>
                <Statistics />
            </div>

            <footer className="footer">Strona stworzona przez projekt-syzyfy</footer>
        </div>
    );
}



function Filters({filters, setFilters, dateRange, setDateRange }) {
    const [newTeacher, setNewTeacher] = useState("");
    const [newDirection, setNewDirection] = useState("");
    const [newSubject, setNewSubject] = useState("");
    const [newRoom, setNewRoom] = useState("");

    const handleDateChange = (key, value) => {
        setDateRange((prevRange) => ({
            ...prevRange,
            [key]: value,
        }));
    };

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
                            <button className="button-small" onClick={() => removeTeacher(teacher)}><i
                                className="fas fa-trash"></i></button>
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
                            <button className="button-small" onClick={() => removeDirection(direction)}><i
                                className="fas fa-trash"></i></button>
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
                            <button className="button-small" onClick={() => removeSubject(subject)}><i
                                className="fas fa-trash"></i></button>
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
                            <button className="button-small" onClick={() => removeRoom(room)}><i
                                className="fas fa-trash"></i></button>
                        </li>
                    ))}
                </ul>
            </div>


            <div className="buttons">
                <button onClick={handleSaveFilters}>Zapisz filtry do ulubionych</button>
                <button onClick={handleCopyToClipboard}>Kopiuj do schowka</button>
            </div>

            {/* Data od */}
            <div className="filter-group">
                <label htmlFor="dateFrom">Data od:</label>
                <input
                    type="date"
                    id="dateFrom"
                    value={dateRange.from}
                    onChange={(e) => handleDateChange("from", e.target.value)}
                />
            </div>

            {/* Data do */}
            <div className="filter-group">
                <label htmlFor="dateTo">Data do:</label>
                <input
                    type="date"
                    id="dateTo"
                    value={dateRange.to}
                    onChange={(e) => handleDateChange("to", e.target.value)}
                />
            </div>

        </div>
    );

}

function PlanView({ viewType, setViewType, dateRange, planData }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        // Reset date range when viewType changes
        if (viewType === "Dzienny") {
            setCurrentDate(new Date());
        } else if (viewType === "Tygodniowy") {
            const startOfWeek = getStartOfWeek(new Date());
            setCurrentDate(startOfWeek);
        } else if (viewType === "Miesięczny") {
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            setCurrentDate(startOfMonth);
        }
    }, [viewType]);

    const getStartOfWeek = (date) => {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        return new Date(date.setDate(diff));
    };

    const getWeeklySchedule = () => {
        const startOfWeek = getStartOfWeek(currentDate);
        const weekDays = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return date;
        });

        return weekDays.map((day) => ({
            day: day.toLocaleDateString('pl-PL', { weekday: 'long' }),
            schedule: (planData || []).filter(
                (entry) => new Date(entry.date).toDateString() === day.toDateString()
            ),
        }));
    };

    const getMonthlySchedule = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const totalDays = lastDayOfMonth.getDate();
        const firstWeekday = (firstDayOfMonth.getDay() + 6) % 7; // Convert Sunday (0) to the end of the week

        const weeks = [];
        let days = []//Array(firstWeekday).fill(null); // Fill empty days for the first week at the beginning

        for (let day = 0; day <= firstWeekday; day++) {
            days.unshift(null);
        }

        for (let day = 1; day <= totalDays; day++) {
            days.push(day);
            if (days.length === 7) {
                weeks.push(days);
                console.log(days);
                days = [];
            }
        }

        // Add remaining days to the last week, filling the week to 7 days
        if (days.length > 0) {
            while (days.length < 7) {
                days.push(null); // Fill empty days at the end of the last week
            }
            weeks.push(days);
        }

        return weeks;
    };

    const handlePrevious = () => {
        if (viewType === "Dzienny") {
            setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
        } else if (viewType === "Tygodniowy") {
            setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
        } else if (viewType === "Miesięczny") {
            setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
        }
    };

    const handleNext = () => {
        if (viewType === "Dzienny") {
            setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
        } else if (viewType === "Tygodniowy") {
            setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));
        } else if (viewType === "Miesięczny") {
            setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
        }
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
                <div className="navigation">
                    <button onClick={handlePrevious}>◀</button>
                    <span>{
                        viewType === "Dzienny" ? currentDate.toLocaleDateString() :
                            viewType === "Tygodniowy" ? `Tydzień ${currentDate.toLocaleDateString()}` :
                                `Miesiąc ${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`
                    }</span>
                    <button onClick={handleNext}>▶</button>
                </div>
            </header>

            <div id="schedule">
                {viewType === "Dzienny" && (
                    <div>
                        <h3>Plan dzienny</h3>
                        {(planData || []).filter(entry => new Date(entry.date).toDateString() === currentDate.toDateString()).map((entry, index) => (
                            <div key={index} className="plan">
                                <div className="time">{entry.time}</div>
                                <div className="details">
                                    <div>Przedmiot: {entry.subject}</div>
                                    <div>Wykładowca: {entry.lecturer}</div>
                                    <div>Sala: {entry.room}</div>
                                </div>
                            </div>
                        ))}
                        {(!planData || planData.length === 0) && <p>Brak danych do wyświetlenia.</p>}
                    </div>
                )}

                {viewType === "Tygodniowy" && (
                    <div className="week-grid">
                        {["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"].map((dayName, index) => {
                            const dayData = getWeeklySchedule().find(day => day.day === dayName) || { day: dayName, schedule: [] };
                            return (
                                <div key={index} className="day-column">
                                    <h4>{dayData.day}</h4>
                                    {dayData.schedule.map((entry, i) => (
                                        <div key={i} className="plan">
                                            <div className="time">{entry.time}</div>
                                            <div className="details">
                                                <div>Przedmiot: {entry.subject}</div>
                                                <div>Wykładowca: {entry.lecturer}</div>
                                                <div>Sala: {entry.room}</div>
                                            </div>
                                        </div>
                                    ))}
                                    {dayData.schedule.length === 0 && <p>Brak danych do wyświetlenia.</p>}
                                </div>
                            );
                        })}
                    </div>
                )}

                {viewType === "Miesięczny" && (
                    <div className="month-grid">
                        <div className="week-header">
                            {"Poniedziałek, Wtorek, Środa, Czwartek, Piątek, Sobota, Niedziela".split(", ").map((day, index) => (
                                <div key={index} className="day-header day-column">{day}</div>
                            ))}
                        </div>
                        {getMonthlySchedule().map((week, i) => (
                            <div key={i} className="week-row">
                                {week.map((day, j) => (
                                    <div key={j} className={classNames("day-cell", { empty: !day })}>
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
