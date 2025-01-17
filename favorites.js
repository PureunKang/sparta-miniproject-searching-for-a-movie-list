import { options } from "./movieAPI.js";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w185";

const $favoritesContainer = document.querySelector(".favorites-container");

// 로컬스토리지에서 찜한 영화 가져오기 -> 화면에 띄우기
const renderFavorites = () => {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.length === 0) {
    $favoritesContainer.innerHTML =
      "<p style='color:white;'>찜한 콘텐츠가 없습니다.</p>";
    return;
  }

  favorites.forEach((movie) => {
    const $movieCard = document.createElement("div");
    $movieCard.classList.add("movie-card");
    $movieCard.dataset.id = movie.id;

    $movieCard.innerHTML = `
      <img src="${IMAGE_BASE_URL + movie.poster_path}" alt="${
      movie.title
    }" width="185px" height="280px" onError="this.onerror=null; this.src=''; this.style.fontSize='20px'"; />
    `;

    $favoritesContainer.appendChild($movieCard);
  });
};

// API 호출 및 모달창 관련
const showModal = async (movieId) => {
  try {
    const movieDetailsResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
      options
    );
    const videoDetailsResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?language=ko-KR`,
      options
    );

    const movieDetails = await movieDetailsResponse.json();
    const videoDetails = await videoDetailsResponse.json();

    const videoKey = videoDetails.results.find(
      (video) => video.site === "YouTube" && video.type === "Trailer"
    )?.key;

    const modal = document.createElement("div");
    modal.classList.add("modal");

    // 모달창 상세 내용
    modal.innerHTML = `
      <div class='modal-content'>
      <button class='close-modal'>X</button> 
        <button class='remove-bookmark'>찜 해제</button>
         ${
           videoKey
             ? `<iframe 
                class='video'
                width="100%" 
                height="315" 
                src="https://www.youtube.com/embed/${videoKey}?autoplay=1" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
              </iframe>`
             : `
               <img src='https://image.tmdb.org/t/p/w780${movieDetails.backdrop_path}' />`
         }
        <div class='details left'>
          <h1>${movieDetails.title} <span>(${movieDetails.release_date.slice(
      0,
      4
    )})</span></h1>
          <div><span>${movieDetails.runtime} 분</span></div>
          
        </div>
        <div class='details right'>
        <div>${movieDetails.overview}</div>
<div>장르: ${movieDetails.genres.map((n) => n.name)}</div>
<div>평점: ${Math.floor(movieDetails.vote_average)} / 10</div>
</div>
</div>
    `;

    // 모달창 화면에 추가
    document.body.appendChild(modal);

    modal.querySelector(".close-modal").addEventListener("click", () => {
      modal.remove();
    });

    modal.querySelector(".remove-bookmark").addEventListener("click", () => {
      removeFromFavorites(movieDetails.id);
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

// 로컬스토리지에서 삭제
const removeFromFavorites = (movieId) => {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const updatedFavorites = favorites.filter(
    (fav) => fav.id !== parseInt(movieId, 10)
  );

  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

  $favoritesContainer.innerHTML = "";
  renderFavorites();
};
