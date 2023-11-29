// Calendar.tsx
import React, { useState, useEffect } from "react";
import "../Style/Calendar.css";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import ReadEvent from "../Database/ReadEvents";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";

interface Event {
  id?: number;
  title: string;
  notes: string;
  date: Date;
  priority: string;
}

const schema = z.object({
  title: z.string().nonempty("Title is required"),
  notes: z.string().nonempty("Notes is required"),
  priority: z.string(),
});

const CalendarComponent: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>(getInitialMonth());
  const [selectedYear, setSelectedYear] = useState<number>(getInitialYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [isPopupOpen, setPopupOpen] = useState<boolean>(false);
  const [isEditPopupOpen, setEditPopupOpen] = useState<boolean>(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [editedId, setEditedId] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDate, setEditedDate] = useState("");
  const [selectedEventDateDisplay, setSelectedEventDateDisplay] = useState("");
  const [editedNotes, setEditedNotes] = useState("");
  const [editedPriority, setEditedPriority] = useState("");
  const [isDeleteConfirmationPopupOpen, setDeleteConfirmationPopupOpen] =
    useState<boolean>(false);

  // generate an array of months
  const generateMonthsArray = () => {
    return [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
  };

  // generate an array of years from 2000 to the current year
  const generateYearsArray = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 2000;

    const years = [];
    for (let year = startYear; year <= currentYear; year++) {
      years.push(year);
    }

    return years;
  };

  // Use the functions to get the arrays of months and years
  const monthsArray = generateMonthsArray();
  const yearsArray = generateYearsArray();

  // get the initial month (current month)
  function getInitialMonth() {
    return new Date().toLocaleDateString("en-US", { month: "long" });
  }

  // get the initial year (current year)
  function getInitialYear() {
    return new Date().getFullYear();
  }

  // determine the first day of the selected month and year
  const getFirstDayOfMonth = () => {
    const firstDay = new Date(`${selectedMonth} 1, ${selectedYear}`);
    let dayOfWeek = firstDay.getDay(); // Returns the day of the week (0 = Sunday, 1 = Monday, etc.)

    // Adjust to make Monday as 0 (0 = Monday, 1 = Tuesday, etc.)
    dayOfWeek = (dayOfWeek + 6) % 7;

    return dayOfWeek;
  };

  // determine the last day of the selected month and year
  const getLastDayOfMonth = () => {
    return new Date(
      selectedYear,
      monthsArray.indexOf(selectedMonth) + 1,
      0
    ).getDate();
  };

  // Update default values if the current month or year changes
  useEffect(() => {
    setSelectedMonth(getInitialMonth());
    setSelectedYear(getInitialYear());
  }, []);

  // render the calendar grid
  const renderCalendarGrid = () => {
    const firstDayOfWeek = getFirstDayOfMonth();
    const lastDay = getLastDayOfMonth();

    // to return empty cell before first day
    const blanksBeforeFirstDay = Array.from(
      { length: firstDayOfWeek },
      (_, index) => (
        <div key={`blank-${index}`} className="CalendarCell empty"></div>
      )
    );

    // check if a cell is empty to remove noteIcon
    const isCellEmpty = (day: number) => {
      return day === undefined || isNaN(day);
    };

    // return date for each day. Month is -1 cause of 0 index
    const daysInMonth = Array.from({ length: lastDay }, (_, index) => {
      const day = index + 1;
      const date = new Date(
        selectedYear,
        monthsArray.indexOf(selectedMonth),
        day
      );

      // 0 is Sunday, 6 is Saturday
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      // filter event for each day
      let dayEvents = events.filter(
        (event) => new Date(event.date).toDateString() === date.toDateString()
      );

      // Define the type for priorityOrder
      const priorityOrder: { [key: string]: number } = {
        high: 1,
        medium: 2,
        low: 3,
      };

      // Sort dayEvents based on priority
      dayEvents = dayEvents.sort((a, b) => {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

      return (
        <div
          key={`day-${index}`}
          className={`CalendarCell ${isWeekend ? "weekend" : ""}`}
        >
          {day}
          {!isCellEmpty(day) && (
            <>
              <NoteAddIcon
                className="NoteIcon"
                style={{ fontSize: "40px" }}
                onClick={() => handleNoteIconClick(day)}
              />
              <div className="EventContainer">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`Event ${event.priority}`}
                    onClick={() => handleEventClick(event)}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      );
    });

    return [...blanksBeforeFirstDay, ...daysInMonth];
  };

  // when click on note icon
  const handleNoteIconClick = (day: number) => {
    setSelectedDate(day);
    setPopupOpen(true);
  };

  // to close add event popup
  const closePopup = () => {
    setPopupOpen(false);
  };

  // const handleInputChange = (
  //   e: React.ChangeEvent<
  //     HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  //   >
  // ) => {
  //   const { name, value } = e.target;
  //   setEventForm((prevForm) => ({
  //     ...prevForm,
  //     [name]: value,
  //   }));
  // };

  const { handleSubmit, register, formState, reset } = useForm<Event>({
    resolver: zodResolver(schema),
  });

  const { errors } = formState;

  // submit event
  const onSubmit: SubmitHandler<Event> = async (data) => {
    // Create the new event object
    const newEvent: Event = {
      title: data.title,
      notes: data.notes,
      date: new Date(
        selectedYear,
        monthsArray.indexOf(selectedMonth),
        selectedDate || 1 + 1
      ),
      priority: data.priority,
    };
    console.log(newEvent)

    try {
      // Send the new event data to the server
      await axios.post("http://localhost:3001/events", newEvent);

      // // Reload events from the server after adding a new event
      // const response = await axios.get<Event[]>("http://localhost:3001/events");
      // setEvents(response.data);

      setEvents((prevEvents) => [...prevEvents, newEvent]);

      // Reset the form fields using react-hook-form's reset function
      reset({
        title: "", // Reset the title field
        notes: "",
        priority: "high",
      });

      // Close the popup
      setPopupOpen(false);
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  // const handleAddEvent = async () => {
  //   // Validate the form data
  //   if (!eventForm.title || !eventForm.notes || !eventForm.priority) {
  //     alert("Please fill in all fields");
  //     return;
  //   }

  //   // Create the new event object
  //   const newEvent: Event = {
  //     title: eventForm.title,
  //     notes: eventForm.notes,
  //     date: new Date(
  //       selectedYear,
  //       monthsArray.indexOf(selectedMonth),
  //       (selectedDate || 1) + 1
  //     ),
  //     priority: eventForm.priority,
  //   };

  //   try {
  //     // Send the new event data to the server
  //     await axios.post("http://localhost:3001/events", newEvent);

  //     // Reload events from the server after adding a new event
  //     const response = await axios.get<Event[]>("http://localhost:3001/events");
  //     setEvents(response.data);

  //     // Close the popup
  //     setPopupOpen(false);

  //     // Reset the form fields
  //     setEventForm({
  //       title: "",
  //       notes: "",
  //       priority: "high", // Reset priority to the default value if needed
  //     });
  //   } catch (error) {
  //     console.error("Error adding event:", error);
  //     // Handle error (e.g., show an error message)
  //   }
  // };

  const handleTitleChange = (value: string) => {
    setEditedTitle(value);
  };

  const handleNotesChange = (value: string) => {
    setEditedNotes(value);
  };

  const handlePriorityChange = (value: string) => {
    setEditedPriority(value);
  };

  // when click on event
  const handleEventClick = (event: any) => {
    const SelectedEvent = event;

    // configure date to display
    const selectedEventDate = new Date(SelectedEvent.date);
    const day = selectedEventDate.getDate();
    const month = monthsArray[selectedEventDate.getMonth()];
    const year = selectedEventDate.getFullYear();

    setSelectedEventDateDisplay(`${day} ${month} ${year}`);

    setEditedId(SelectedEvent.id);
    setEditedDate(SelectedEvent.date);
    setEditedNotes(SelectedEvent.notes);
    setEditedPriority(SelectedEvent.priority);
    setEditedTitle(SelectedEvent.title);
    setEditPopupOpen(true);
  };

  // when click to update event
  const handleUpdateEvent = async () => {
    // Convert the string to a Date object
    var editedDateString = new Date(editedDate);

    // Add one day to the date
    editedDateString.setDate(editedDateString.getDate() + 1);

    // Create the new event object
    const newEvent: Event = {
      title: editedTitle,
      notes: editedNotes,
      date: new Date(editedDateString),
      priority: editedPriority,
    };

    try {
      // Send the new event data to the server
      await axios.put("http://localhost:3001/events/" + editedId, newEvent);

      console.log("event successfully updated");
      setEvents((prevEvents) => [...prevEvents, newEvent]);

      // Close the popup
      setEditPopupOpen(false);

      // Reset the form fields
      setEditedId("");
      setEditedDate("");
      setEditedNotes("");
      setEditedPriority("");
      setEditedTitle("");
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  // when click on delete button
  const handleDeleteEvent = () => {
    setDeleteConfirmationPopupOpen(true);
  };

  // confirm button to delete event
  const confirmDelete = async () => {
    try {
      await axios.delete("http://localhost:3001/events/" + editedId);
      console.log("Event successfully deleted");
      window.location.reload();
      setEditPopupOpen(false);
      setDeleteConfirmationPopupOpen(false);

      // Reset the form fields
      setEditedId("");
      setEditedDate("");
      setEditedNotes("");
      setEditedPriority("");
      setEditedTitle("");
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // cancel delete button
  const cancelDelete = () => {
    setDeleteConfirmationPopupOpen(false);
  };

  return (
    <div className="CalendarContainer">
      <ReadEvent onDataLoaded={(data) => setEvents(data)}></ReadEvent>
      {/* Dropdown for months */}
      <label className="CalendarSelector">Month:</label>
      <select
        className="CalendarDropdown"
        id="month"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      >
        {monthsArray.map((month, index) => (
          <option key={index} value={month}>
            {month}
          </option>
        ))}
      </select>

      {/* Dropdown for years */}
      <label className="CalendarSelector">Year:</label>
      <select
        className="CalendarDropdown"
        id="year"
        value={selectedYear}
        onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
      >
        {yearsArray.map((year, index) => (
          <option key={index} value={year}>
            {year}
          </option>
        ))}
      </select>

      {/* Render the calendar grid */}
      <div className="CalendarGrid">
        <div className="CalendarHeader">Monday</div>
        <div className="CalendarHeader">Tuesday</div>
        <div className="CalendarHeader">Wednesday</div>
        <div className="CalendarHeader">Thursday</div>
        <div className="CalendarHeader">Friday</div>
        <div className="CalendarHeader">Saturday</div>
        <div className="CalendarHeader">Sunday</div>
        {renderCalendarGrid()}
      </div>

      {/* Popup for adding event */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {isPopupOpen && (
          <div className="PopupOverlay">
            <div className="Popup">
              <div className="PopupHeader">
                <h3>Title : </h3>
                <div style={{ display: "flex" }}>
                  <h3>Date: </h3>
                  <p
                    style={{
                      border: "1px solid white",
                      padding: "3px",
                      marginLeft: "5px",
                      backgroundColor: "#00586F",
                    }}
                  >{`${selectedDate} ${selectedMonth} ${selectedYear}`}</p>
                </div>
              </div>
              <div className="PopupContent">
                <input
                  type="text"
                  className="TitleInput"
                  {...register("title")}
                />

                {errors.title && (
                  <p className="ErrorMessage">{errors.title.message}</p>
                )}

                <h3>Notes:</h3>
                <label>
                  <textarea className="NotesTextArea" {...register("notes")} />
                </label>
                {errors.notes && (
                  <p className="ErrorMessage">{errors.notes.message}</p>
                )}
                <label className="PriorityLabel">
                  <h3>Priority:</h3>
                  <select className="PrioritySelect" {...register("priority")}>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </label>
              </div>
              <div className="CalendarButtonContainer">
                <button type="submit" className="UpdateEventButton">
                  Add
                </button>
                <button
                  type="button"
                  className="CancelEventButton"
                  onClick={closePopup}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Popup for edit and delete event */}
      {isEditPopupOpen && (
        <div className="PopupOverlay">
          <div className="Popup">
            <div className="PopupHeader">
              <h3>Title : </h3>
              <div style={{ display: "flex" }}>
                <h3>Date: </h3>
                <p
                  style={{
                    border: "1px solid white",
                    padding: "3px",
                    marginLeft: "5px",
                    backgroundColor: "#00586F",
                  }}
                >
                  {selectedEventDateDisplay}
                </p>
              </div>
            </div>
            <div className="PopupContent">
              <input
                type="text"
                name="title"
                value={editedTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="TitleInput"
              />
              <h3>Notes:</h3>
              <label>
                <textarea
                  name="notes"
                  value={editedNotes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  className="NotesTextArea"
                />
              </label>
              <label className="PriorityLabel">
                <h3>Priority:</h3>
                <select
                  name="priority"
                  value={editedPriority}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  className="PrioritySelect"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </label>
            </div>
            <div className="CalendarButtonContainer">
              <button
                type="button"
                className="UpdateEventButton"
                onClick={handleUpdateEvent}
              >
                Update
              </button>
              <button
                type="button"
                className="CancelEventButton"
                onClick={handleDeleteEvent}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation popup */}
      {isDeleteConfirmationPopupOpen && (
        <div className="PopupOverlay">
          <div className="DeletePopup">
            <div className="DeletePopupHeader">
              <h3>Delete Event?</h3>
            </div>
            <div className="CalendarButtonContainer">
              <button
                type="button"
                className="UpdateEventButton"
                onClick={confirmDelete}
              >
                Confirm
              </button>
              <button
                type="button"
                className="CancelEventButton"
                onClick={cancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
