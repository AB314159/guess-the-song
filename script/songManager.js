document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("songForm");

  if (!form) {
    alert("Form not found!");
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.songName.value.trim();
    const difficulty = form.difficulty.value;
    const youtube = form.youtubeUrl.value.trim();
    const image5 = form.image5.value;
    const image3 = form.image3.value;
    const image1 = form.image1.value;

    if (!image5 || !image3 || !image1) {
      alert("All three images must be pasted before submitting.");
      return;
    }

    const newSong = {
      name,
      difficulty,
      youtube,
      images: [image5, image3, image1],
    };

    const songList = JSON.parse(localStorage.getItem("songs")) || [];
    songList.push(newSong);
    localStorage.setItem("songs", JSON.stringify(songList));

    alert("Song added successfully!");
    form.reset();

    // Reset visuals
    ["box5", "box3", "box1"].forEach(id => {
      document.getElementById(id).innerHTML = `Paste ${id.replace("box", "")} Point Image Here`;
    });
  });
});
