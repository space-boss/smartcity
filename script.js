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
	// Count distinct selections (they're already unique via checkboxes)
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
	const stellplatzSchluessel = basiswert * nahversorgungFaktor * nutzungsartFaktor * busFaktor * railFaktor * travelTimeFaktor;

	// Multiply by planned residential units to get the total expected cars
	const erwartetePkw = stellplatzSchluessel * params.geplanteWohneinheiten;

	return { stellplatzSchluessel, erwartetePkw };
}

// DOMContentLoaded: Wait for the page to fully load
document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("calculationForm");

	form.addEventListener("submit", (e) => {
		e.preventDefault(); // Prevent the page from reloading

		// Combine Quartiertyp from the two dropdowns: dichte + anteilWohnen
		const anteilWohnen = document.getElementById("anteilWohnen").value;
		const dichte = document.getElementById("dichte").value;
		const quartiertyp = dichte + anteilWohnen;

		// Get Nahversorgung category
		const nahversorgungKategorie = document.getElementById("nahversorgungKategorie").value;

		// Get Nutzungsart: gather all checked checkboxes
		const nutzungsartElements = document.querySelectorAll('input[name="nutzungsart"]:checked');
		const nutzungsart = Array.from(nutzungsartElements).map(el => el.value);

		// Get Bus factor from the combined dropdown
		const busCombined = document.getElementById("busCombined").value;

		// Get Rail factor from the combined dropdown
		const railCombined = document.getElementById("railCombined").value;

		// Get ÖPNV-Reisezeit category
		const travelTimeCategory = document.getElementById("travelTimeCategory").value;

		// Get planned residential units
		const geplanteWohneinheiten = Number(document.getElementById("geplanteWohneinheiten").value);

		// Assemble all parameters into an object
		const params = {
			quartiertyp, // e.g., "D--W+"
			nahversorgungKategorie, // e.g., "<5"
			nutzungsart, // array of strings
			busCombined, // e.g., "<150_hoch"
			railCombined, // e.g., "<300_hoch"
			travelTimeCategory, // e.g., "kurz"
			geplanteWohneinheiten // number
		};

		// Calculate results
		const result = calculateStellplatzSchluessel(params);

		// Display results in the designated output element (with rounding)
		document.getElementById("result").innerText =
			"Stellplatzschlüssel: " + result.stellplatzSchluessel.toFixed(2) +
			"\nErwartete Pkw: " + Math.round(result.erwartetePkw);
	});
});

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
	// Get the modal elements
	const modal = document.getElementById("info-modal");
	const modalText = document.getElementById("modal-text");
	const closeButton = document.querySelector(".close-button");

	// Example information for each info icon (you can extend this or load dynamically)
	const infoContent = {
		"info-wohnheiten": "Hier steht die ausführliche Information zu Wohnheiten.",
		"info-maximal": "Hier steht die Information zum maximalen Stellplatzbedarf.",
	};

	// Add click event listener to each info icon
	document.querySelectorAll(".info-icon").forEach(icon => {
		icon.addEventListener("click", () => {
			// Get the data-info attribute value
			const infoKey = icon.getAttribute("data-info");
			// Load the corresponding content or default text
			modalText.textContent = infoContent[infoKey] || "Weitere Informationen folgen.";
			// Show the modal
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
