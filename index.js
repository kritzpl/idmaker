// Elements Initialization
const image = document.getElementById("draggableImage");
const signature = document.getElementById("draggableImageSignature");
const imageToolbar = document.getElementById("toolbar");
const textToolbar = document.getElementById("text-toolbar");
const upload = document.getElementById("uploadNewImageBtn");
const cropBtn = document.getElementById("cropBtn");
const positionBtn = document.getElementById("positionBtn");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const saveBtn = document.getElementById("saveBtn");
const printContainer = document.getElementById("printContainer");
const output = document.getElementById("output");
let cropper = null;

// Text toolbar buttons
const boldBtn = document.getElementById("bold-button");
const italicBtn = document.getElementById("italic-button");
const underlineBtn = document.getElementById("underline-button");
const alignLeftBtn = document.getElementById("align-left");
const alignCenterBtn = document.getElementById("align-center");
const alignRightBtn = document.getElementById("align-right");
const fontSelector = document.getElementById("font-selector");
const fontSizeInput = document.getElementById("font-size");
const increaseFontBtn = document.getElementById("increase-font");
const decreaseFontBtn = document.getElementById("decrease-font");
const textColorPicker = document.getElementById("text-color-picker");

// Font Search Input
const fontSearchInput = document.getElementById("font-search");

// List of fonts for font selector
const fonts = ["Arial", "Arial Black", "Arial Narrow", "Asap", "Bree Serif", "Cabin", "Cantarell", "Cardo", "Cedarville Cursive", "Courier New", "Droid Sans", "Droid Serif", "EB Garamond", "Exo 2", "Frank Ruhl Libre", "Fira Sans", "Lora", "Merriweather", "Montserrat", "Open Sans", "Poppins", "Quicksand", "Raleway", "Roboto", "Roboto Condensed", "Roboto Slab", "Slabo 27px", "Source Sans Pro", "Tisa", "Ubuntu", "Varela Round", "Vollkorn"];

// Dragging Variables
let isDragging = false;
let initialX = 0,
	initialY = 0,
	offsetX = 0,
	offsetY = 0;
let currentElement = null;

// Enable Dragging
function enableDragging(element) {
	element.addEventListener("mousedown", (e) => {
		isDragging = true;
		currentElement = element;
		initialX = e.clientX - (element.offsetLeft || 0);
		initialY = e.clientY - (element.offsetTop || 0);
		document.addEventListener("mousemove", dragElement);
		document.addEventListener("mouseup", stopDragging);
	});
}

function dragElement(e) {
	if (!isDragging || !currentElement) return;
	offsetX = e.clientX - initialX;
	offsetY = e.clientY - initialY;
	currentElement.style.position = "absolute";
	currentElement.style.left = `${offsetX}px`;
	currentElement.style.top = `${offsetY}px`;
}

function stopDragging() {
	isDragging = false;
	currentElement = null;
	document.removeEventListener("mousemove", dragElement);
	document.removeEventListener("mouseup", stopDragging);
}

// Initialize Draggable Elements
if (image) enableDragging(image);
if (signature) enableDragging(signature);
if (imageToolbar) enableDragging(imageToolbar);
if (textToolbar) enableDragging(textToolbar);

// Hide both toolbars initially
imageToolbar.style.display = "none";
textToolbar.style.display = "none";

// Font Selector Functionality
function populateFontSelector() {
	fonts.forEach((font) => {
		const option = document.createElement("option");
		option.value = font;
		option.textContent = font;
		option.style.fontFamily = font;
		fontSelector.appendChild(option);

		const link = document.createElement("link");
		link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, "+")}&display=swap`;
		link.rel = "stylesheet";
		document.head.appendChild(link);
	});
}

function filterFonts() {
	const searchQuery = fontSearchInput.value.toLowerCase();
	const options = fontSelector.options;
	for (let i = 0; i < options.length; i++) {
		const option = options[i];
		const fontName = option.textContent.toLowerCase();
		if (fontName.includes(searchQuery)) {
			option.classList.add("visible");
		} else {
			option.classList.remove("visible");
		}
	}
}

// Apply selected font to editable text
fontSelector.addEventListener("change", () => {
	const selectedFont = fontSelector.value;
	document.querySelector(".editable").style.fontFamily = selectedFont;
});

// Search for fonts
if (fontSearchInput) {
	fontSearchInput.addEventListener("input", filterFonts);
}

// Initialize font selector
populateFontSelector();

// Text Manipulation Buttons
if (boldBtn) boldBtn.addEventListener("click", () => document.execCommand("bold"));
if (italicBtn) italicBtn.addEventListener("click", () => document.execCommand("italic"));
if (underlineBtn) underlineBtn.addEventListener("click", () => document.execCommand("underline"));
if (alignLeftBtn) alignLeftBtn.addEventListener("click", () => document.execCommand("justifyLeft"));
if (alignCenterBtn) alignCenterBtn.addEventListener("click", () => document.execCommand("justifyCenter"));
if (alignRightBtn) alignRightBtn.addEventListener("click", () => document.execCommand("justifyRight"));

// Font Size
if (increaseFontBtn) {
	increaseFontBtn.addEventListener("click", () => {
		let fontSize = parseInt(fontSizeInput.value) || 12;
		fontSizeInput.value = fontSize + 1;
		document.execCommand("fontSize", false, fontSize + 1);
	});
}

if (decreaseFontBtn) {
	decreaseFontBtn.addEventListener("click", () => {
		let fontSize = parseInt(fontSizeInput.value) || 12;
		fontSizeInput.value = fontSize - 1;
		document.execCommand("fontSize", false, fontSize - 1);
	});
}

// Text Color Picker
if (textColorPicker) {
	textColorPicker.addEventListener("input", (e) => {
		document.execCommand("foreColor", false, e.target.value);
	});
}

// Show toolbars and handle image selection
function selectImage(element) {
	image.classList.remove("selected-image");
	signature.classList.remove("selected-image");
	element.classList.add("selected-image");

	imageToolbar.style.display = "flex";
	textToolbar.style.display = "none";
}

// Image Toolbar Actions
if (image) {
	image.addEventListener("click", () => selectImage(image));
}

if (signature) {
	signature.addEventListener("click", () => selectImage(signature));
}

// Text Toolbar Actions
document.querySelectorAll(".editable").forEach((el) => {
	el.addEventListener("click", () => {
		textToolbar.style.display = "block";
		imageToolbar.style.display = "none";
	});
});

// Close text toolbar when clicking outside
document.addEventListener("click", (event) => {
	if (!event.target.closest(".editable") && !event.target.closest("#text-toolbar")) {
		textToolbar.style.display = "none";
	}
});

// Close image toolbar when clicking outside
document.addEventListener("click", (event) => {
	if (!event.target.closest("#toolbar") && !event.target.closest("#draggableImage") && !event.target.closest("#draggableImageSignature")) {
		imageToolbar.style.display = "none";
		image.classList.remove("selected-image");
		signature.classList.remove("selected-image");
	}
});

// Crop Image Functionality
if (upload) {
	upload.addEventListener("change", (e) => {
		const file = e.target.files[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (event) => {
			const newImage = new Image();
			newImage.src = event.target.result;
			document.body.appendChild(newImage);

			if (cropper) cropper.destroy();
			cropper = new Cropper(newImage, { aspectRatio: NaN, viewMode: 1 });
		};
		reader.readAsDataURL(file);
	});
}

if (cropBtn) {
	cropBtn.addEventListener("click", () => {
		if (!cropper) {
			alert("No image to crop!");
			return;
		}
		const canvas = cropper.getCroppedCanvas();
		const croppedImage = new Image();
		croppedImage.src = canvas.toDataURL();
		document.body.appendChild(croppedImage);
		cropper.destroy();
		cropper = null;
	});
}
