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
		"info-quartiertyp": "Nutzungsmischung und Bevölkerungsdichte bestimmen den Quartierstyp. Betrachtet werden sollte ein städtebaulich zusammenhängendes Quartier oder ein Umkreis von 800-1.000 Metern. Die Einschätzung zur Dichte kann nach örtlicher Einschätzung erfolgen. Der Basisfaktor des Quartierstyps ist am ausschlaggebendsten in der Stellplatzberechnung. Je höher die Dichte, desto geringer die Wahrscheinlichkeit einen Pkw zu besitzen.",
		"info-nahversorgung": "Die Distanz zur Nahversorgung wird durch die Gehminuten zum nächsten gut sortierten Supermarkt beschrieben. Über vier Klassen von Entfernungsintervallen in Fünf-Minuten-Schritten, wird der Faktor für die Nachversorgung ermittelt. Mit diesem Faktor wird der Basisfaktor multipliziert. Je näher der nächste Supermarkt, desto geringer die Wahrscheinlichkeit einen Pkw zu besitzen.",
		"info-nutzungsmischung": "Die hier relevanten Nichtwohnnutzungen sind: Gewerbe, Bildung, Soziales, Kultur, Gesundheit und Freizeit. Es ist nur wichtig, ob eine Nutzung innerhalb eines Radius von 800-1.000 m vorliegt, nicht wie häufig. Je mehr verschiedene Nutzungen fußläufig erreichbar sind, desto geringer die Wahrscheinlichkeit einen Pkw zu besitzen. Mit dem sich ergebenden Wert wird multipliziert.",
		"info-bus": "Die zu betrachtenden Gegebenheiten für den Faktor der Busanbinding sind die Distanz zur nächsten Bushaltestelle und die Anzahl der täglichen Abfahrten an dieser. Erst ab unter 300 Metern zur nächsten Haltestelle sinkt der Pkw-Besitz, eine weitere Schwelle sind 150 Meter. Ein hoher Takt wird durch mehr als 300 Abfahrten täglich definiert, alles darunter als geringer Takt. Erst ab 300 Abfahrten täglich sinkt der Pkw-Besitz. Die Werte sind statistisch belegte Richtwerte, eine ortsübliche Einschätzung ist ggf. notwendig. Mit dem sich ergebenden Wert wird multipliziert.",
		"info-schiene": "Der Faktor zur Schienenanbindung wird ähnlich zur Busanbindung definiert. Erst ab unter 600 Metern zur nächsten Haltestelle sinkt der Pkw-Besitz, eine weitere Schwelle sind 300 Meter. Ein hoher Takt wird durch mehr als 400 Abfahrten täglich definiert, alles darunter als geringer Takt. Erst ab 400 Abfahrten täglich sinkt der Pkw-Besitz. Die Werte sind statistisch belegte Richtwerte, eine ortsübliche Einschätzung ist ggf. notwendig. Mit dem sich ergebenden Wert wird multipliziert.",
		"info-reisezeit": "Zusätzlich zur Distanz zu Haltestellen und Stationen ist auch die Reisezeit mit dem öffentlichen Personennahverkehr ins Zentrum relevant. Dieser wird nicht durch spezifische Reisezeiten definiert, sondern in kurze, mittlere und lange Reisezeiten unterteilt, die im jeweils ortsüblichen Kontext zu sehen sind. Die Reisezeit selbst inkludiert den (Fuß-) Weg zur genutzten ÖPNV-Station und etwaige Umstiege mit Wartezeiten. Mit dem sich ergebenden Wert wird multipliziert.",
	};

	// Add click event listener to each info icon
	document.querySelectorAll(".info-icon").forEach(icon => {
		icon.addEventListener("click", () => {
			const infoKey = icon.getAttribute("data-info");
			modalText.innerHTML = infoContent[infoKey] || "Weitere Informationen folgen.";
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
