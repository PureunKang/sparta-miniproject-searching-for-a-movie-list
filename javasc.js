const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM2QwMTJjOWViODEyOGJjNWE2MWM5MTIwZmQ5NTIwMSIsIm5iZiI6MTczNjI5OTE1Ni43NTcsInN1YiI6IjY3N2RkMjk0ZjJjNjIxODA3ZGJhZmJlMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AFTn-3T1Ji6Ye4iJHwC_ahEhXOSdzuufhKhIlmONgdQ",
  },
};

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w185";
const cardContainer = document.querySelector(".card-container");

let page = 1;
let isLoading = false;

// 영화 데이터를 화면에 추가하는 함수
const renderMovies = (movies) => {
  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    movieCard.innerHTML = `
      <img src="${IMAGE_BASE_URL + movie.poster_path}" alt="${movie.title}" />
    `;

    cardContainer.appendChild(movieCard);
  });
};

// 목록 출력을 위한 API 호출 함수
const fetchPopularMovies = function (page) {
  if (isLoading) return;

  isLoading = true;
  fetch(
    `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${page}`,
    options
  )
    .then((res) => res.json())
    .then((res) => {
      renderMovies(res.results);
      isLoading = false; // 로딩 상태 해제
    })
    .catch((err) => {
      console.error(err);
      isLoading = false;
    });
};

// 새로고침되자마자 바로 실행
document.addEventListener("DOMContentLoaded", () => {
  fetchPopularMovies(page); // 첫 번째 페이지 데이터를 로드
});

// 스크롤 이벤트
window.addEventListener("scroll", function () {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
    !isLoading
  ) {
    page++;
    fetchPopularMovies(page); // ++된 페이지의 데이터 요청
  }
});
