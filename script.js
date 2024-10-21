function handleFileUpload() {
  const fileInput = document.getElementById('icsFile');
  const icsInput = document.getElementById('icsInput');
  const fileNameSpan = document.getElementById('fileName');

  if (fileInput.files.length === 0) {
    alert('Please select a file');
    return;
  }

  const file = fileInput.files[0];
  fileNameSpan.textContent = file.name; // Update the displayed file name
  const reader = new FileReader();

  reader.onload = function (event) {
    icsInput.value = event.target.result;
  };

  reader.readAsText(file);
}

function convertToGoogleCalendar() {
  const icsContent = document.getElementById('icsInput').value.trim();

  if (!icsContent) {
    alert('Please paste or upload an .ics file content');
    return;
  }

  const eventDetails = parseICS(icsContent);

  if (eventDetails) {
    const { title, startTime, endTime, details, location } = eventDetails;
    const googleCalendarLink = generateGoogleCalendarLink(
      title,
      startTime,
      endTime,
      details,
      location
    );

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<a href="${googleCalendarLink}" target="_blank">Add to Google Calendar</a>`;
  } else {
    alert('Failed to parse .ics file content');
  }
}

function parseICS(icsContent) {
  const titleMatch = icsContent.match(/SUMMARY:(.*)/);
  const startMatch = icsContent.match(/DTSTART(?:;TZID=[^:]+)?:(.*)/);
  const endMatch = icsContent.match(/DTEND(?:;TZID=[^:]+)?:(.*)/);
  const detailsMatch = icsContent.match(/DESCRIPTION:(.*)/);
  const locationMatch = icsContent.match(/LOCATION:(.*)/);

  if (titleMatch && startMatch && endMatch) {
    return {
      title: titleMatch[1],
      startTime: startMatch[1],
      endTime: endMatch[1],
      details: detailsMatch ? detailsMatch[1] : '',
      location: locationMatch ? locationMatch[1] : '',
    };
  }

  return null;
}

function generateGoogleCalendarLink(
  title,
  startTime,
  endTime,
  details,
  location
) {
  const base = 'https://calendar.google.com/calendar/r/eventedit';
  const params = new URLSearchParams({
    text: title,
    dates: `${startTime}/${endTime}`,
    details: details,
    location: location,
  });

  return `${base}?${params.toString()}`;
}
