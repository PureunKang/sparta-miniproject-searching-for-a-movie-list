const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM2QwMTJjOWViODEyOGJjNWE2MWM5MTIwZmQ5NTIwMSIsIm5iZiI6MTczNjI5OTE1Ni43NTcsInN1YiI6IjY3N2RkMjk0ZjJjNjIxODA3ZGJhZmJlMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AFTn-3T1Ji6Ye4iJHwC_ahEhXOSdzuufhKhIlmONgdQ",
  },
};

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

fetch(
  "https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1",
  options
)
  .then((res) => res.json())
  .then((res) => {
    console.log("popular movies: ", res);

    const movies = res.results;

    const cardContainer = document.querySelector(".card-container");

    movies.forEach((movie) => {
      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");

      movieCard.innerHTML = `
        <img src="${IMAGE_BASE_URL + movie.poster_path}" alt="${movie.title}" />
        <h2>${movie.original_title}</h2>
      `;

      cardContainer.appendChild(movieCard);
    });
  })
  .catch((err) => console.error(err));
