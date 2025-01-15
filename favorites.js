const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM2QwMTJjOWViODEyOGJjNWE2MWM5MTIwZmQ5NTIwMSIsIm5iZiI6MTczNjI5OTE1Ni43NTcsInN1YiI6IjY3N2RkMjk0ZjJjNjIxODA3ZGJhZmJlMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AFTn-3T1Ji6Ye4iJHwC_ahEhXOSdzuufhKhIlmONgdQ",
  },
};
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w185";

const $favoritesContainer = document.querySelector(".favorites-container");

// 로컬스토리지에서 찜한 영화 가져오기
const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// 영화 데이터 렌더링
const renderFavorites = () => {
  if (favorites.length === 0) {
    $favoritesContainer.innerHTML = "<p>찜한 콘텐츠가 없습니다.</p>";
    return;
  }

  favorites.forEach((movie) => {
    const $movieCard = document.createElement("div");
    $movieCard.classList.add("movie-card");
    $movieCard.dataset.id = movie.id;

    $movieCard.innerHTML = `
      <img src="${IMAGE_BASE_URL + movie.poster_path}" alt="${movie.title}" />
    `;

    $favoritesContainer.appendChild($movieCard);
  });
};

// 모달창 띄우기
const showModal = async (movieId) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
      options
    );
    const movieDetails = await response.json();

    const modal = document.createElement("div");
    modal.classList.add("modal");

    modal.innerHTML = `
      <div class='modal-content'>
        <button class='close-modal'>X</button>
        <h2>${movieDetails.title}</h2>
        <p>${movieDetails.overview}</p>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".close-modal").addEventListener("click", () => {
      modal.remove();
    });
  } catch (err) {
    console.error(err);
  }
};

// 이벤트 위임으로 카드 클릭 시 모달 표시
$favoritesContainer.addEventListener("click", (e) => {
  const movieCard = e.target.closest(".movie-card");
  if (movieCard) {
    const movieId = movieCard.dataset.id;
    showModal(movieId);
  }
});

// 초기 렌더링
document.addEventListener("DOMContentLoaded", renderFavorites);
