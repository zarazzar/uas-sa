import { Map } from "./map.js";
import { heldKarp } from "./algorithms/heldKarpAlgorithm.js";
import { solveTSP } from "./algorithms/bruteForceAlgorithm.js";

const mapBoxAccessToken = "pk.eyJ1IjoiemFyYXp6YXJyIiwiYSI6ImNsd2F4NWozazA0NXgyaW1xbDd6NGlyOXcifQ.YM4YUsuFgHTFlp5ULDE4jQ";
//tokenku pk.eyJ1IjoiemFyYXp6YXJyIiwiYSI6ImNsd2F4NWozazA0NXgyaW1xbDd6NGlyOXcifQ.YM4YUsuFgHTFlp5ULDE4jQ
// public tokendefault pk.eyJ1IjoiemFyYXp6YXJyIiwiYSI6ImNsd2F3dm9oczBqc3cycXBxd3NlcWNsamQifQ.2NfXMWBMhLRQ3owU0uQQWQ
// public token free 'pk.eyJ1IjoibWFrdXNvbmlvc3UiLCJhIjoiY2xuZzV3aWFjMHU3NDJqdGN5cXg3bm1lNyJ9.6T8prpHQy2DJ1lP8uOgJlg'

let map = new Map(mapBoxAccessToken, onMarkerAdd, onMarkerDragEnd);

document.getElementById("build-route-btn").addEventListener("click", async function () {
  const distanceMatrix = await map.getDistanceMatrix();
  const selectorValue = document.getElementById("algorithm-selector").value;
  const waypoints = map.markers;

  let result;

  if (waypoints.length < 2) {
    alert("Please add at least two waypoints");
    return;
  }

  if (waypoints.length >= 9 && selectorValue === "bruteForceAlgorithm") {
    alert("Limit reached");
    return;
  }

  switch (selectorValue) {
    case "heldKarpAlgorithm":
      result = heldKarp(distanceMatrix);
      break;
    case "bruteForceAlgorithm":
      result = solveTSP(waypoints, distanceMatrix);
      break;
    case "antColonyAlgorithm":
      result = solveTSPACO(waypoints, distanceMatrix);
      break;
  }

  await map.drawRoute(result.path);

  const steps = map.steps;
  addSteps(steps);
});

function addSteps(steps) {
  const instructions = document.getElementById("instructions");
  let tripInstructions = "";
  for (let step of steps) {
    tripInstructions += `<li>${step.maneuver.instruction}</li>`;
  }
  instructions.innerHTML = `<p><strong>Durasi Perjalanan: ${Math.floor(map.duration / 60)} menit 🏍️ </strong></p><ol>${tripInstructions}</ol>`;
}

function updateUI() {
  const waypointsList = document.getElementById("waypoints");
  waypointsList.innerHTML = "";
  const markers = map.markers;

  markers.forEach((marker, index) => {
    const coordinates = marker.getLngLat();
    const li = document.createElement("li");
    li.textContent = `Titik ${String.fromCharCode(65 + index)} (${coordinates.lng.toFixed(3)}, ${coordinates.lat.toFixed(3)})`;
    waypointsList.appendChild(li);
  });
}

function onMarkerAdd(marker, index) {
  const coordinates = marker.getLngLat();
  const waypointsList = document.getElementById("waypoints");
  const li = document.createElement("li");
  li.setAttribute("data-marker-index", index);
  li.textContent = `Titik ${String.fromCharCode(65 + index)} (${coordinates.lng.toFixed(3)}, ${coordinates.lat.toFixed(3)})`;
  waypointsList.appendChild(li);
}

function onMarkerDragEnd(marker, index) {
  const coordinates = marker.getLngLat();
  const waypointsList = document.getElementById("waypoints");
  const listItem = waypointsList.querySelector(`[data-marker-index="${index}"]`);
  if (listItem) {
    listItem.textContent = `Titik ${String.fromCharCode(65 + index)} (${coordinates.lng.toFixed(3)}, ${coordinates.lat.toFixed(3)})`;
  }
}

document.getElementById("clear-coordinates-btn").addEventListener("click", function () {
  map.removeAll();
  const waypointsList = document.getElementById("waypoints");
  waypointsList.innerHTML = "";

  const instructions = document.getElementById("instructions");
  instructions.innerHTML = "";
});

document.getElementById("delete-lastmarker").addEventListener("click", function () {
  const markers = map.markers;
  const lastMarkerIndex = markers.length - 1;
  if (lastMarkerIndex >= 0) {
    map.remove(lastMarkerIndex);
    updateWaypointsList();
  }
});
