# ParkCalc: Stellplatzschlüssel Berechnung

**ParkCalc** is a web-based tool designed to calculate flexible parking space keys (Stellplatzschlüssel) based on various urban and transport parameters. The website is deployed on GitHub Pages and can be viewed at:
[https://space-boss.github.io/smartcity/](https://space-boss.github.io/smartcity/)

> **IMPORTANT NOTICE:**
> This website is optimized for desktop use only. For the best experience, please open ParkCalc on a desktop or laptop. Mobile optimization is not yet available.

---

## Features

- **Modular Calculation:** Computes the Stellplatzschlüssel by multiplying factors for:
  - **Quartiertyp:** Based on residential share and density.
  - **Nahversorgung:** Proximity (in minutes) to shopping areas.
  - **Nutzungsart:** Non-residential usage categories (e.g., Gewerbe, Bildung, Soziales, Kultur, Gesundheit, Freizeit).
  - **ÖPNV Accessibility:** Bus and rail connection parameters.
  - **Reisezeit:** Travel time to the city center.
  - **Planned Residential Units:** Multiplies the key by the number of units.
- **Interactive Interface:** Users select parameters via dropdowns and checkboxes.
- **Information Popups:** Clickable info icons provide detailed explanations of each parameter.
- **Result Display:** The tool outputs the calculated Stellplatzschlüssel and the estimated number of cars.

---

## Methodology

The calculation is based on multiplying various factors that represent different urban and transport characteristics. This modular approach is described by:

**Tahedl, J. (2021). _Pkw-Besitz im Wohnungsbau: Eine Handreichung zur Ermittlung flexibler Stellplatzschlüssel._**

---

## How It Works

1. **Input Parameters:**
   Users choose values for parameters such as residential density, shopping proximity, usage mix, and public transport accessibility.
2. **Calculation:**
   Each parameter contributes a factor. These factors are multiplied together to form the Stellplatzschlüssel, which is then multiplied by the number of planned residential units.
3. **Output:**
   The results are displayed in two fields:
   - **Stellplatzschlüssel:** The calculated key per residential unit.
   - **Erwartete Pkw:** The total estimated number of cars.

