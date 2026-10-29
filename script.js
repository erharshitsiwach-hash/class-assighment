
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");
const resultCount = document.getElementById("result-count");

form.addEventListener("submit", async function (event) {
  // 1. Stop the page from reloading
  event.preventDefault();

  // 2. Read the user's search
  const query = input.value.trim();

  // Ignore empty searches
  if (query === "") {
    return;
  }

  // Clear the previous search
  results.innerHTML = "";
  resultCount.textContent = "";

  // 3. Build the API URL
  const url =
    "https://commons.wikimedia.org/w/api.php" +
    "?action=query" +
    "&generator=search" +
    "&gsrnamespace=6" +
    "&gsrlimit=12" +
    "&gsrsearch=" + encodeURIComponent(query) +
    "&prop=imageinfo" +
    "&iiprop=url" +
    "&iiurlwidth=400" +
    "&format=json" +
    "&origin=*";

  // 4. Fetch and parse the data
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Could not fetch images");
  }

  const data = await response.json();

  // The API returns matching files inside query.pages
  const pages = Object.values(data.query?.pages || {});

  // 5. Enhancement: show the result count
  resultCount.textContent =
    `Showing ${pages.length} results for "${query}"`;

  // 6. Create one card per image
  pages.forEach(function (page) {
    const imageInfo = page.imageinfo?.[0];

    if (!imageInfo) {
      return;
    }

    const card = document.createElement("div");
    card.className = "image-card";

    const image = document.createElement("img");
    image.src = imageInfo.thumburl || imageInfo.url;
    image.alt = page.title;
    image.loading = "lazy";

    const caption = document.createElement("p");
    caption.textContent = page.title
      .replace("File:", "")
      .replace(/_/g, " ");

    card.appendChild(image);
    card.appendChild(caption);
    results.appendChild(card);
  });
});
