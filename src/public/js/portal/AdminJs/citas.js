
$(document).ready(function () {
  loadPacientes();
  loadDoctores();
  loadCitaTable();
});

$(window).on("load", function () {
  if ($("#preloader").length) {
    $("#preloader")
      .delay(100)
      .fadeOut("slow", function () {
        $(this).remove();
      });
  }
});

var sidebarOpen = false;
var sidebar = document.getElementById("sidebar");
var sidebarCloseIcon = document.getElementById("sidebarIcon");
var dataPacienteIn;

function toggleSidebar() {
  if (!sidebarOpen) {
    sidebar.classList.add("sidebar_responsive");
    sidebarOpen = true;
  }
}

function closeSidebar() {
  if (sidebarOpen) {
    sidebar.classList.remove("sidebar_responsive");
    sidebarOpen = false;
  }
}

function loadDoctores() {
  $.ajax({
    url: "/all-doctors",
    method: "get",
    success: function (response) {
      var opctionP =
        '<option value"" disabled selected>Seleccione un paciente...</option>';
      $.each(response, function (i, pt) {
        opctionP +=
          '<option value="' + pt._id + '">' + pt.docNombre + "</option>";
      });
      $("#doctorIdAdmin").html(opctionP);
    },
    error: function (response) {
      alert("server error");
    },
  });
}

var pacienteEmail;

function loadPacientes() {
  $.ajax({
    url: "/all-data",
    method: "get",
    success: function (response) {
      var opctionP =
        '<option value"" disabled selected>Seleccione un paciente...</option>';
      $.each(response, function (i, pt) {
        opctionP += '<option value="' + pt._id + '">' + pt.name + "</option>";
      });
      $("#pacienteIdAdmin").html(opctionP);
      $("#pacienteIdAdmin2").html(opctionP);
    },
    error: function (response) {
      Swal.fire({
        icon: "error",
        title: "server error",
      });
    },
  });
}

function loadCitaTable() {
  $.ajax({
    url: "/getAllCitas",
    method: "get",
    success: function (response) {
      table = $("#citasTable").DataTable({
        data: response,
        columns: [
          { data: "paciente" },
          { data: "date" },
          { data: "time" },
          { data: "zoomLink" },
        ],
        bLengthChange: false,
        pageLength: 5,
        bInfo: false,
        bAutoWidth: false,
        order: [[2, "desc"]],
        columnDefs: [
          { width: '15%', targets: 0 },
          { width: '20%', targets: 1 }
      ],
      });
    },
    error: function (response) {
      Swal.fire({
        icon: "error",
        title: "server error",
      });
    },
  });
}

const form1 = document.getElementById("citasForm1");
form1.addEventListener("submit", citas1);

async function citas1(event) {
  const pasieId = document.getElementById("pacienteIdAdmin2").value;
  const pacienteT = document.getElementById("pacienteIdAdmin2");
  const paciente = pacienteT.options[pacienteT.selectedIndex].text;
  const date = document.getElementById("dateAdmin").value;
  const time = document.getElementById("timeAdmin").value;
  const zoomLink = document.getElementById("ligaZoom").value;

  event.preventDefault();

  const result1 = await fetch("/addLinkForm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pasieId,
      paciente,
      date,
      time,
      zoomLink,
    }),
  }).then((res) => res.json());

  if (result1.status == 202) {
    Swal.fire({ icon: "success", title: result1.msg }).then(function () {
      location.reload();
    });
  } else {
    Swal.fire({
      icon: "error",
      text: result1.msg,
    });
  }
}

const form = document.getElementById("citasForm");
form.addEventListener("submit", citas);

async function citas(event) {
  const docId = document.getElementById("doctorIdAdmin").value;
  const pasieId = document.getElementById("pacienteIdAdmin").value;
  console.log(docId);
  event.preventDefault();

  const result = await fetch("/addDoctorsForm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      docId,
      pasieId,
    }),
  }).then((res) => res.json());

  console.log(result);
  if (result.status == 202) {
    Swal.fire({ icon: "success", title: result.msg }).then(function () {
      location.reload();
    });
  } else {
    Swal.fire({
      icon: "error",
      text: result.msg,
    });
  }
}


document.addEventListener("DOMContentLoaded", function () {
  var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
    locale: 'es',
    eventClick: function(info) {
      var eventObj = info.event;  
        Swal.fire({
          icon: "success",
          text: eventObj.title,
        });
    },
    initialView: "dayGridMonth",
    events: function (fetchInfo, successCallback, failureCallback) {
      jQuery.ajax({
        url: "/getAllCitas",
        type: "GET",
        success: function (res) {
          var events = []
          res.forEach(function (evt) {
            events.push({
              title: evt.paciente,
              start: evt.date,
              end: evt.date,
              // url: evt.zoomLink
            });
          });
          successCallback(events);
        },
        
      });
    },
  });
  calendar.render();
});
