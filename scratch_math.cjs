// Let's test the math for Building 2 placement:
const b2Min = [ -1.27165, -1, -2.22503 ];
const b2Max = [ 3.13493, 9.05032, 1.02690 ];
const scale = 3.68; // To match height of 37 units

// Building 2 local height after scale:
const scaledHeight = (b2Max[1] - b2Min[1]) * scale; // 10.05 * 3.68 = ~37
console.log('Scaled height:', scaledHeight);

// If bottom of building is at Y = 28 - 37 = -9 (or Y = 0 to Y = 37)
// When camera is at [0, 40, 56], looking down at angle ~35 degrees:
// Roof of building at Y ~ 38, bottom at Y ~ 1
// Signboard placed at top of building: [0, 38.5, 10] or similar.
