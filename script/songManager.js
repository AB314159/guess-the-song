// songManager.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("songForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputs = form.querySelectorAll("input, select");
    const name = inputs[0].value;
    const difficulty = inputs[1].value;
    const youtube = inputs[2].value;
    const image1 = inputs[3].files[0];
    const image2 = inputs[4].files[0];
    const image3 = inputs[5].files[0];

    if (!image1 || !image2 || !image3) {
      alert("All three images are required.");
      return;
    }

    const reader1 = new FileReader();
    const reader2 = new FileReader();
    const reader3 = new FileReader();

    reader1.onload = () => {
      reader2.onload = () => {
        reader3.onload = () => {
          const newSong = {
            name,
            difficulty,
            youtube,
            images: [reader1.result, reader2.result, reader3.result],
          };

          const songList = JSON.parse(localStorage.getItem("songs")) || [];
          songList.push(newSong);
          localStorage.setItem("songs", JSON.stringify(songList));
          alert("Song added successfully!");
          form.reset();
        };
        reader3.readAsDataURL(image3);
      };
      reader2.readAsDataURL(image2);
    };
    reader1.readAsDataURL(image1);
  });
});
