const calendar = document.querySelector(".calendar");
const currentMonthElement = document.querySelector(".currentMonth");
const daysElement = document.querySelector(".days-box");

const specialDates = [
  {
    date: "2024-05-9",
    info: " Victory Day over Fascism",
  },
  { date: "2024-02-14", info: " Valentine's Day" },
  { date: "2024-01-20", info: " Martyrs' Day" },
  { date: "2024-01-01", info: " New Year" },
  { date: "2024-02-07", info: " Prezidental Election" },
  { date: "2024-05-28", info: " Republic Day" },
  { date: "2024-03-21", info: " Novruz Holiday" },
  { date: "2024-03-08", info: " Women's Day" },
  { date: "2024-03-08", info: " Ramadan Start" },
  { date: "2024-04-10", info: " Ramadan Holiday" },
];

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

renderCalendar(currentMonth, currentYear);

function renderCalendar(month, year) {
  currentMonthElement.textContent = getMonthName(month) + " " + year;

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayHeaders = document.createElement("div");
  dayHeaders.classList.add("days");
  dayNames.forEach((day) => {
    const dayHeader = document.createElement("div");
    dayHeader.textContent = day;
    dayHeader.classList.add("day-header");
    dayHeaders.appendChild(dayHeader);
  });
  daysElement.innerHTML = "";
  daysElement.appendChild(dayHeaders);

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  const startingDay = firstDayOfMonth.getDay();
  const dayNumbers = document.createElement("div");
  dayNumbers.classList.add("days");

  for (let i = 0; i < startingDay; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.textContent = "";
    dayNumbers.appendChild(emptyDay);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement("div");
    day.classList.add("day");
    day.textContent = i;
    const dateStr =
      year +
      "-" +
      (month + 1 < 10 ? "0" : "") +
      (month + 1) +
      "-" +
      (i < 10 ? "0" : "") +
      i;
    const specialDate = specialDates.find(
      (dateInfo) => dateInfo.date === dateStr
    );
    if (specialDate) {
      day.classList.add("special-day");

      day.setAttribute("data-info", specialDate.info);
    }
    day.addEventListener("click", function () {
      const clickedDate = new Date(year, month, i + 1);
      const dayName = getDayName(clickedDate.getDay());
      day.classList.add("clicked-day");
      let message =
        "<div class='clicked-date'>" +
        "<p class='day-name'>" +
        dayName +
        "</p>" +
        "<p class='date'>" +
        getMonthName(month) +
        " " +
        i +
        "</p>" +
        "</div>";
      const specialDate = specialDates.find(
        (dateInfo) => dateInfo.date === clickedDate.toISOString().split("T")[0]
      );

      if (specialDate) {
        message += "<div class='date'>" + specialDate.info + "</div>";
      }
      message += "<div class='day-name'>Upcoming</div>";
      const upcomingSpecialDates = getUpcomingSpecialDatesAfterDay(
        year,
        month,
        i
      );
      if (upcomingSpecialDates.length > 0) {
        message += "<ul>";
        upcomingSpecialDates.forEach((dateInfo) => {
          const date = new Date(dateInfo.date);
          const formattedDate = date.toLocaleDateString("en-US", {
            weekday: "short",

            month: "long",
            day: "numeric",
          });
          message +=
            "<li class='special-date'>" +
            "<span class='bull'>" +
            `&bull;` +
            "</span>" +
            "<span class='date-info'>" +
            dateInfo.info +
            "<span class='date-date'>" +
            formattedDate +
            "</span> " +
            "</span> " +
            "</span> " +
            "</li>";
        });
        message += "</ul>";
      } else {
        message +=
          "<div class='no-upcoming'>Bu tarihten sonrasında yaklaşan özel gün bulunmamaktadır.</div>";
      }
      showUpcomingSpecialDatesModal(message);
    });

    dayNumbers.appendChild(day);
  }
  daysElement.appendChild(dayNumbers);
}

function getMonthName(month) {
  const months = [
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
  return months[month];
}

function getDayName(day) {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return dayNames[day];
}

function getUpcomingSpecialDatesAfterDay(year, month, day) {
  const startingDate = new Date(year, month, day + 1); // Tıklanan günün ertesi günü
  const lastDayOfMonth = new Date(year, month + 1, 0); // Ayın son günü

  const upcomingSpecialDatesAfterDay = specialDates.filter((dateInfo) => {
    const specialDate = new Date(dateInfo.date);
    return specialDate >= startingDate && specialDate <= lastDayOfMonth;
  });

  return upcomingSpecialDatesAfterDay;
}

function showUpcomingSpecialDatesModal(message) {
  const modalContent =
    "<div id='myModal' class='modal'><div class='modal-content'>" +
    "<span class='close'>&times;</span><div id='upcomingSpecialDates'>" +
    message +
    "</div></div></div>";
  document.body.insertAdjacentHTML("beforeend", modalContent);

  const modal = document.getElementById("myModal");
  modal.style.display = "block";

  const closeBtn = document.querySelector(".close");
  closeBtn.addEventListener("click", function () {
    const allDays = document.querySelectorAll(".day");
    allDays.forEach((day) => {
      if (day.classList.contains("clicked-day")) {
        day.classList.remove("clicked-day");
      }
    });

    modal.style.display = "none";
    document.body.removeChild(modal);
  });
}

calendar.addEventListener("click", function (event) {
  if (event.target.classList.contains("prev")) {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
  }
  if (event.target.classList.contains("next")) {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
  }
});
