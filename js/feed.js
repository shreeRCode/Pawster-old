const imageInput = document.getElementById("imageInput");
const fileName = document.getElementById("fileName");
const imagePreview = document.getElementById("imagePreview");
const previewModal = document.getElementById("imagePreviewModal");
const closePreview = document.getElementById("closePreview");
const uploadBtn = document.getElementById("uploadBtn");
let model;
const dogLabels = [
  "Labrador retriever",
  "Golden retriever",
  "German shepherd",
  "Beagle",
  "Bulldog",
  "Poodle",
  "Rottweiler",
  "Yorkshire terrier",
  "Boxer",
  "Dachshund",
  "Siberian husky",
  "Great Dane",
  "Maltese dog",
  "Pomeranian",
  "Border collie",
  "Chihuahua",
  "Shih Tzu",
  "Boston bull",
  "Cocker spaniel",
  "Saint Bernard",
];
let isValidDogImage = false;
async function loadModel() {
  try {
    model = await mobilenet.load();
    console.log("Mobilenet loaded successfully");
  } catch (error) {
    console.error("Failed to load model:", error);
    alert("AI model failed to load. Dog detection won't work.");
  }
}
function isDog(predictions) {
  return predictions.some(
    (prediction) =>
      dogLabels.some((dogLabel) =>
        prediction.className.toLowerCase().includes(dogLabel.toLowerCase())
      ) && prediction.probability > 0.3
  );
}
async function classifyAndValidateImage(imageElement) {
  if (!model) {
    alert("AI model is still loading. Please wait and try again.");
    return false;
  }
  try {
    const predictions = await model.classify(imageElement);
    console.log("Predictions:", predictions);
    if (isDog(predictions)) {
      console.log("✅ Dog detected!");
      return true;
    } else {
      console.log("❌ No dog detected");
      alert(
        "Please upload an image consisting a dog.Only pet (dog) images are allowed!"
      );
      return false;
    }
  } catch (error) {
    console.error("Classification error:", error);
    alert("Error analyzing image. Please try again.");
    return false;
  }
}

imageInput.addEventListener("change", function (e) {
  if (e.target.files.length > 0) {
    const file = e.target.files[0];
    fileName.textContent = file.name;
    fileName.style.display = "inline";
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    fileName.style.display = "none";
  }
});
// When user clicks on filename, show preview
fileName.addEventListener("click", function () {
  if (imagePreview.src) {
    previewModal.style.display = "flex";
  }
});
// Close preview when clicking X or outside
closePreview.addEventListener("click", function () {
  previewModal.style.display = "none";
});
previewModal.addEventListener("click", function (e) {
  if (e.target == previewModal) {
    previewModal.style.display = "none";
  }
});
