const finalImage = document.getElementById("image");
const finalText = document.getElementById("text");

const imageSrc = localStorage.getItem("finalImage");
const text = localStorage.getItem("finalText");

if (imageSrc && text) {
    finalImage.src = imageSrc;
    finalText.innerText = text;
} else {
    finalImage.src = "Images/somethingWentWrong.png"; 
    finalText.innerText = "";
}