import React, { useState, useEffect } from "react";
import axios from "axios";
import classNames from "classnames";
import "./App.css";

function sendRequestToAPI(filters, dateRange) {
    const requestBody = {
        students: filters.studenci.length > 0 ? filters.studenci : null,
        teachers: filters.wykladowcy.length > 0 ? filters.wykladowcy : null,
        subjects: filters.przedmioty.length > 0 ? filters.przedmioty : null,
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
        students: [],
        teachers: [],
        kierunki: [],
        subjects: [],
        rooms: [],
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

    const setFiltersFromUrl = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const newFilters = {};
        let newDateRange = {from: "", to: ""};

        queryParams.forEach((value, key) => {
            if (key === "from" || key === "to") {
                newDateRange[key] = value || "";
            } else if (key.endsWith("[]")) {
                const cleanKey = key.slice(0, -2);
                if (!newFilters[cleanKey]) {
                    newFilters[cleanKey] = [];
                }
                newFilters[cleanKey].push(value);
            } else {
                newFilters[key] = value || null;
            }
        });

        setFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
        }));

        setDateRange(newDateRange);
        if (queryParams.toString()) {
            const apiUrl = `http://localhost:8000/generate-plan-url?${queryParams}`;

            try {
                const response = await axios.get(apiUrl);
                setPlanData(response.data);
            } catch (error) {
                console.error("Błąd podczas pobierania danych:", error);
            }
        } else {
            console.log("Brak filtrów w URL.");
        }

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
                <PlanView viewType={viewType} setViewType={setViewType} planData={planData}/>
                <Statistics />
            </div>

            <footer className="footer">Strona stworzona przez projekt-syzyfy</footer>
        </div>
    );
}



function Filters({filters, setFilters, dateRange, setDateRange }) {
    const [newStudent, setNewStudent] = useState("");
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

    const addStudent = () => addItemToList("students", newStudent);
    const removeStudent = (student) => removeItemFromList("students", student);
    const addTeacher = () => addItemToList("teachers", newTeacher);
    const removeTeacher = (teacher) => removeItemFromList("teachers", teacher);

    const addDirection = () => addItemToList("kierunki", newDirection);
    const removeDirection = (direction) =>
        removeItemFromList("kierunki", direction);

    const addSubject = () => addItemToList("subjects", newSubject);
    const removeSubject = (subject) => removeItemFromList("subjects", subject);

    const addRoom = () => addItemToList("rooms", newRoom);
    const removeRoom = (room) => removeItemFromList("rooms", room);
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
        const queryString = [
            // Przetwarzanie `filters`
            ...Object.entries(filters).flatMap(([key, value]) => {
                if (Array.isArray(value)) {
                    return value.map(v => `${encodeURIComponent(key)}[]=${encodeURIComponent(v)}`);
                }
                return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
            }),
            // Dodanie `dateRange.from` i `dateRange.to` (jeśli są ustawione)
            dateRange.from ? `from=${encodeURIComponent(dateRange.from)}` : null,
            dateRange.to ? `to=${encodeURIComponent(dateRange.to)}` : null,
        ]
            .filter(Boolean) // Usunięcie `null` lub pustych wartości
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

            {/* Studenci - nr albumu */}
            <div className="filter-group">
                <h2>Nr albumu</h2>
                <input
                    type="text"
                    value={newStudent}
                    placeholder="Wpisz nr albumu"
                    onChange={(e) => setNewStudent(e.target.value)}
                />
                <button onClick={addStudent}>Dodaj</button>
                <ul>
                    {filters.students.map((student, index) => (
                        <li key={index}>
                            {student}{" "}
                            <button className="button-small" onClick={() => removeStudent(student)}><i
                                className="fas fa-trash"></i></button>
                        </li>
                    ))}
                </ul>
            </div>

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
                    {filters.teachers.map((teacher, index) => (
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
                    {filters.subjects.map((subject, index) => (
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
                    {filters.rooms.map((room, index) => (
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

            {/* Data do */}
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

function PlanView({ viewType, setViewType, planData }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false); // Stan dla widoczności modala
    const [selectedDayData, setSelectedDayData] = useState([]); // Stan dla danych wybranego dnia


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
        setShowModal(false);
    }, [viewType]);

    const getStartOfWeek = (date) => {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        return new Date(date.setDate(diff));
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

        for (let day = 0; day < firstWeekday; day++) {
                days.unshift(null);
        }

        for (let day = 1; day <= totalDays; day++) {
            days.push(day);
            if (days.length === 7) {
                weeks.push(days);
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


    function openDayDetails(dayData) {
        if (dayData.length===0){
            setShowModal(false);
        }
        else {
            setSelectedDayData(dayData);
            setShowModal(true);
        }
    }

    function closeModal() {
        setShowModal(false);
        setSelectedDayData([]);
    }

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
                                `Miesiąc ${currentDate.toLocaleString('default', {month: 'long'})} ${currentDate.getFullYear()}`
                    }</span>
                    <button onClick={handleNext}>▶</button>
                </div>
            </header>

            <div id="schedule">
                {viewType === "Dzienny" && (
                    <div>
                        <h3>Plan dzienny</h3>
                        {
                            (planData || [])
                            .filter(entry => new Date(entry.from).toDateString() === currentDate.toDateString())
                            .map((entry, index) => (
                                <div key={index} className="plan">
                                    <div className="time">
                                        {new Date(entry.from).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })} -
                                        {new Date(entry.to).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                    <div className="details">
                                        <div>Przedmiot: {entry.subjectName}</div>
                                        <div>Wykładowca: {entry.teacher}</div>
                                        <div>Sala: {entry.roomName}</div>
                                    </div>
                                </div>
                            ))}
                        {(planData || []).filter(entry => new Date(entry.from).toDateString() === currentDate.toDateString()).length === 0 && (
                            <p>Brak zajęć na ten dzień.</p>
                        )}
                    </div>
                )}


                {viewType === "Tygodniowy" && (
                    <div className="week-grid">
                        {(() => {
                            // Znajdź początek i koniec tygodnia
                            const startOfWeek = new Date(currentDate);
                            const endOfWeek = new Date(currentDate);
                            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Poniedziałek
                            endOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 7);  // Niedziela

                            // Filtrowanie zajęć w zakresie tygodnia
                            const weeklyData = (planData || []).filter(entry => {
                                const entryDate = new Date(entry.from);
                                return entryDate >= startOfWeek && entryDate <= endOfWeek;
                            });

                            // Grupowanie zajęć według dni tygodnia
                            const daysOfWeek = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];
                            const groupedData = daysOfWeek.map((day, index) => {
                                const dayStart = new Date(startOfWeek);
                                dayStart.setDate(startOfWeek.getDate() + index);
                                return {
                                    dayName: day,
                                    date: dayStart,
                                    entries: weeklyData.filter(entry =>
                                        new Date(entry.from).toDateString() === dayStart.toDateString()
                                    ),
                                };
                            });

                            // Renderowanie grupowanych danych
                            return groupedData.map((group, index) => (
                                <div key={index} className="day-column">
                                    <h4>{group.dayName} ({group.date.toLocaleDateString()})</h4>
                                    {group.entries.length > 0 ? (
                                        group.entries.map((entry, i) => (
                                            <div key={i} className="plan">
                                                <div className="time">
                                                    {new Date(entry.from).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })} -
                                                    {new Date(entry.to).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                                <div className="details">
                                                    <div>Przedmiot: {entry.subjectName}</div>
                                                    <div>Wykładowca: {entry.teacher}</div>
                                                    <div>Sala: {entry.roomName}</div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p></p>
                                    )}
                                </div>
                            ));
                        })()}
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
                                {week.map((day, j) => {
                                    const dayDate = day ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day) : null;
                                    const dayData = dayDate ? (planData || []).filter(entry =>
                                        new Date(entry.from).toDateString() === dayDate.toDateString()
                                    ) : [];

                                    return (
                                        <div
                                            key={j}
                                            className={classNames("day-cell", { empty: !day })}
                                            onClick={() => {
                                                if (day) {
                                                    openDayDetails(dayData.length > 0 ? dayData : []);
                                                }
                                            }}
                                        >
                                            {day && (
                                                <>
                                                    <span className="day-number">{day}</span>
                                                    {dayData.length > 0 && (
                                                        <span className="event-count">{dayData.length} zajęć</span>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {(showModal && viewType === "Miesięczny") && (
                <div className="modal">
                    <div className="modal-content">
                        <button onClick={closeModal} className="close-button">×</button>
                        <h4>Zajęcia w dniu {new Date(selectedDayData[0]?.from).toLocaleDateString('pl-PL', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}</h4>

                        {selectedDayData.length > 0 ? (
                            selectedDayData.map((entry, index) => (
                                <div key={index} className="plan">
                                    <div className="time">
                                        {new Date(entry.from).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })} -
                                        {new Date(entry.to).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                    <div className="details">
                                        <div>Przedmiot: {entry.subjectName}</div>
                                        <div>Wykładowca: {entry.teacher}</div>
                                        <div>Sala: {entry.roomName}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Brak zajęć w tym dniu.</p>
                        )}
                    </div>
                </div>
            )}
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
