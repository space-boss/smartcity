// Mapping objects for calculation factors
const basiswertMap = {
	"D--W+": 1.3,
	"D--Wo": 1.1,
	"D--W-": 0.9,
	"D-W+": 1.1,
	"D-Wo": 0.9,
	"D-W-": 0.8,
	"D+W+": 0.8,
	"D+Wo": 0.8,
	"D+W-": 0.7,
	"D++W+": 0.7,
	"D++Wo": 0.7,
	"D++W-": 0.6
};

const nahversorgungMap = {
	"<5": 0.8,
	"5-10": 0.9,
	"10-15": 0.95,
	">15": 1.05
};

const nutzungsartFactors = {
	0: 1.0,
	1: 0.95,
	2: 0.9,
	3: 0.85
};

const busFactorMap = {
	"<150_hoch": 0.8,
	"<150_niedrig": 0.85,
	"150-300_hoch": 0.85,
	"150-300_niedrig": 0.95,
	">300_any": 1.1
};

const railFactorMap = {
	"<300_hoch": 0.8,
	"<300_niedrig": 0.85,
	"300-600_hoch": 0.9,
	"300-600_niedrig": 0.95,
	">600_any": 1.0,
	"none": 1.0
};

const travelTimeMap = {
	"kurz": 0.75,
	"mittel": 0.85,
	"lang": 0.95
};

// Helper function for Nutzungsart factor
function getNutzungsartFaktor(selectedCategories) {
	const uniqueCount = selectedCategories.length;
	const count = Math.min(uniqueCount, 3); // cap effect at 3
	return nutzungsartFactors[count];
}

// Main calculation function
function calculateStellplatzSchluessel(params) {
	// Retrieve the basiswert from the combined Quartiertyp key
	const basiswert = basiswertMap[params.quartiertyp];
	if (!basiswert) {
		alert("Ungültiger Quartiertyp: " + params.quartiertyp);
		return { stellplatzSchluessel: 0, erwartetePkw: 0 };
	}

	const nahversorgungFaktor = nahversorgungMap[params.nahversorgungKategorie] || 1.0;
	const nutzungsartFaktor = getNutzungsartFaktor(params.nutzungsart);
	const busFaktor = busFactorMap[params.busCombined] || 1.0;
	const railFaktor = railFactorMap[params.railCombined] || 1.0;
	const travelTimeFaktor = travelTimeMap[params.travelTimeCategory] || 1.0;

	// Calculate Stellplatzschlüssel as the product of all factors
	const stellplatzSchluessel = basiswert
		* nahversorgungFaktor
		* nutzungsartFaktor
		* busFaktor
		* railFaktor
		* travelTimeFaktor;

	// Multiply by planned residential units to get total expected cars
	const erwartetePkw = stellplatzSchluessel * params.geplanteWohneinheiten;

	return { stellplatzSchluessel, erwartetePkw };
}

// Wait for the DOM to load before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("calculationForm");

	form.addEventListener("submit", (e) => {
		e.preventDefault();

		// Combine Quartiertyp from the two dropdowns: dichte + anteilWohnen
		const anteilWohnen = document.getElementById("anteilWohnen").value;
		const dichte = document.getElementById("dichte").value;
		const quartiertyp = dichte + anteilWohnen;

		// Nahversorgung
		const nahversorgungKategorie = document.getElementById("nahversorgungKategorie").value;

		// Nutzungsart: gather all checked checkboxes
		const nutzungsartElements = document.querySelectorAll('input[name="nutzungsart"]:checked');
		const nutzungsart = Array.from(nutzungsartElements).map(el => el.value);

		// Bus factor
		const busCombined = document.getElementById("busCombined").value;

		// Rail factor
		const railCombined = document.getElementById("railCombined").value;

		// ÖPNV-Reisezeit
		const travelTimeCategory = document.getElementById("travelTimeCategory").value;

		// Planned residential units
		const geplanteWohneinheiten = Number(document.getElementById("geplanteWohneinheiten").value);

		// Assemble all parameters
		const params = {
			quartiertyp, // e.g. "D--W+"
			nahversorgungKategorie, // e.g. "<5"
			nutzungsart,            // array of strings
			busCombined,            // e.g. "<150_hoch"
			railCombined,           // e.g. "<300_hoch"
			travelTimeCategory,     // e.g. "kurz"
			geplanteWohneinheiten   // number
		};

		// Calculate results
		const result = calculateStellplatzSchluessel(params);

		// Display results in your new fields
		// Replace the "--" with the actual calculation
		document.getElementById("stellplatzschluessel").innerText =
			result.stellplatzSchluessel.toFixed(2);

		document.getElementById("erwartetePkw").innerText =
			Math.round(result.erwartetePkw);
	});
});


// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
	// Get the modal elements
	const modal = document.getElementById("info-modal");
	const modalText = document.getElementById("modal-text");
	const closeButton = document.querySelector(".close-button");

	const infoContent = {
		"info-wohnheiten": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
		"info-maximal": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
	};

	// Add click event listener to each info icon
	document.querySelectorAll(".info-icon").forEach(icon => {
		icon.addEventListener("click", () => {
			const infoKey = icon.getAttribute("data-info");
			modalText.textContent = infoContent[infoKey] || "Weitere Informationen folgen.";
			modal.style.display = "block";
		});
	});

	// Close the modal when the close button is clicked
	closeButton.addEventListener("click", () => {
		modal.style.display = "none";
	});

	// Optionally, close modal when clicking outside the modal content
	window.addEventListener("click", (event) => {
		if (event.target === modal) {
			modal.style.display = "none";
		}
	});
});
