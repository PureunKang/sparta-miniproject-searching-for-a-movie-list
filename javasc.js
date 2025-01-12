const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM2QwMTJjOWViODEyOGJjNWE2MWM5MTIwZmQ5NTIwMSIsIm5iZiI6MTczNjI5OTE1Ni43NTcsInN1YiI6IjY3N2RkMjk0ZjJjNjIxODA3ZGJhZmJlMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AFTn-3T1Ji6Ye4iJHwC_ahEhXOSdzuufhKhIlmONgdQ",
  },
};

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w185";
const MOVIE_BASE_URL = "https://api.themoviedb.org/3/search/movie";

const $cardContainer = document.querySelector(".card-container");
const $targetMovie = document.querySelector("#target-movie");
const $btn = document.querySelector('input[type="button"]');

let page = 1;
let isLoading = false;

// 영화 데이터를 화면에 추가하는 함수
const renderMovies = (movies) => {
  movies.forEach((movie) => {
    const $movieCard = document.createElement("div");
    $movieCard.classList.add("movie-card");

    $movieCard.innerHTML = `
      <img src="${IMAGE_BASE_URL + movie.poster_path}" alt="${movie.title}" />
    `;

    $cardContainer.appendChild($movieCard);
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

// 검색을 위한 API 호출 함수
// 한국어, 영어 검색 API 통합
const searchMovies = function (page) {
  const movieName = $targetMovie.value.trim();
  if (!movieName) return;

  // 기존 데이터 초기화
  $cardContainer.innerHTML = "";
  isLoading = true; // 스크롤 이벤트 방지

  let totalResults = [];
  let totalPages = 1;

  const fetchAllPages = (language) => {
    const fetchPage = (page) => {
      return fetch(
        `${MOVIE_BASE_URL}?query=${encodeURIComponent(
          movieName
        )}&include_adult=true&language=${language}&page=${page}`,
        options
      )
        .then((res) => res.json())
        .then((data) => {
          totalPages = data.total_pages;
          totalResults = [...totalResults, ...data.results];
        })
        .catch((err) => console.error(err));
    };

    const promises = [];
    for (let i = 1; i <= totalPages; i++) {
      promises.push(fetchPage(i));
    }

    return Promise.all(promises);
  };
  Promise.all([fetchAllPages("ko-KR"), fetchAllPages("en-US")])
    .then(() => {
      // 중복된 json 데이터 제거
      const uniqueResults = totalResults.reduce((acc, current) => {
        if (!acc.some((movie) => movie.id === current.id)) {
          acc.push(current);
        }
        return acc;
      }, []);

      // 화면에 렌더링
      renderMovies(uniqueResults);
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

// 검색 버튼 클릭 이벤트
$btn.addEventListener("click", function () {
  searchMovies();
});

// Enter키로 검색 버튼 대체하기 이벤트
$targetMovie.addEventListener("keydown", function (e) {
  if (e.keyCode === 13) {
    searchMovies();
  }
});

// 실시간 검색 - 디바운싱
let timer;
$targetMovie.addEventListener("input", function () {
  const movieName2 = $targetMovie.value.trim();

  clearTimeout(timer);
  timer = setTimeout(function () {
    if (movieName2) {
      searchMovies();
    }
  }, 500);
});
