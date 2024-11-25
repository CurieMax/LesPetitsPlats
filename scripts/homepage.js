/**
 * Creates and returns the header content element for a webpage.
 * This function constructs the header's HTML structure, including
 * sections for the background image, logos, title, and search bar.
 * The header content consists of:
 * - A background image displayed behind the header content.
 * - A logo section containing two images.
 * - A title section with a heading displaying a message.
 * - A search bar allowing users to search for recipes or ingredients.
 *
 * @returns {HTMLElement} The constructed header content element.
 */
export function createHeaderContent() {
  // Conteneur principal du header
  const headerContent = document.createElement("div");
  headerContent.classList.add("header-content");

  // Section background
  const backgroundDiv = document.createElement("div");
  backgroundDiv.classList.add("background");
  const backgroundImg = document.createElement("img");
  backgroundImg.src = "assets/index-image.jpg";
  backgroundImg.alt = "background";
  backgroundImg.classList.add("background-img");
  backgroundDiv.appendChild(backgroundImg);

  // Section logo
  const logoDiv = document.createElement("div");
  logoDiv.classList.add("logo");
  const logoImg1 = document.createElement("img");
  logoImg1.src = "assets/Les petits plats.png";
  logoImg1.alt = "logo";
  logoImg1.classList.add("logo-img");
  const logoImg2 = document.createElement("img");
  logoImg2.src = "assets/Group 3.png";
  logoImg2.alt = "logo";
  logoImg2.classList.add("logo-img2");
  logoDiv.appendChild(logoImg1);
  logoDiv.appendChild(logoImg2);

  // Section titre
  const titleDiv = document.createElement("div");
  titleDiv.classList.add("title");
  const titleH1 = document.createElement("h1");
  titleH1.innerHTML =
    "CHERCHEZ PARMI PLUS DE 1500 RECETTES <br /> DU QUOTIDIEN, SIMPLES ET DÉLICIEUSES";
  titleDiv.appendChild(titleH1);

  // Barre de recherche
  const searchBarDiv = document.createElement("div");
  searchBarDiv.classList.add("search-bar");
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.classList.add("global-search");
  searchInput.placeholder =
    "Rechercher une recette, un ingrédient... (3 caractères minimum)";
  const searchButton = document.createElement("button");
  searchButton.type = "submit";
  const searchIcon = document.createElement("i");
  searchIcon.classList.add("fa-solid", "fa-magnifying-glass");
  searchButton.appendChild(searchIcon);
  searchBarDiv.appendChild(searchInput);
  searchBarDiv.appendChild(searchButton);

  // Assemblage des sections
  headerContent.appendChild(backgroundDiv);
  headerContent.appendChild(logoDiv);
  headerContent.appendChild(titleDiv);
  headerContent.appendChild(searchBarDiv);

  return headerContent;
}

// Injection dans le DOM
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");

  if (header) {
    const headerContent = createHeaderContent();
    header.appendChild(headerContent);
  } else {
    console.error("Aucun élément <header> trouvé dans le DOM.");
  }
});

function createFilterSection(filterName, filterId, placeholderText) {
    // Conteneur principal pour chaque filtre
    const filterList = document.createElement("div");
    filterList.classList.add("filter-list");
  
    // Conteneur du filtre (header)
    const filterContainer = document.createElement("div");
    filterContainer.classList.add("filter-container", `${filterId}-filter`);
  
    // Nom du filtre
    const filterNameSpan = document.createElement("span");
    filterNameSpan.classList.add("filter-name");
    filterNameSpan.textContent = filterName;
  
    // Icône chevron
    const chevronIcon = document.createElement("i");
    chevronIcon.classList.add("fa-solid", "fa-chevron-down");
  
    // Ajout du nom et de l'icône au conteneur
    filterContainer.appendChild(filterNameSpan);
    filterContainer.appendChild(chevronIcon);
  
    // Dropdown (conteneur déroulant)
    const dropdownList = document.createElement("div");
    dropdownList.id = `${filterId}Dropdown`;
    dropdownList.classList.add("dropdown-list");
  
    // Conteneur de recherche
    const filterSearch = document.createElement("div");
    filterSearch.classList.add("filter-search");
  
    // Input de recherche
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.id = `${filterId}Search`;
    searchInput.placeholder = placeholderText;
  
    // Icône de loupe
    const searchIcon = document.createElement("i");
    searchIcon.classList.add("fa-solid", "fa-magnifying-glass");
  
    // Ajout de l'input et de l'icône au conteneur de recherche
    filterSearch.appendChild(searchInput);
    filterSearch.appendChild(searchIcon);
  
    // Liste d'éléments
    const itemList = document.createElement("ul");
    itemList.id = `${filterId}List`;
  
    // Ajout des éléments au dropdown
    dropdownList.appendChild(filterSearch);
    dropdownList.appendChild(itemList);
  
    // Ajout du header et du dropdown au conteneur principal
    filterList.appendChild(filterContainer);
    filterList.appendChild(dropdownList);
  
    return filterList;
  }
  
  export function createFiltersSection() {
    // Création de la section principale
    const filtersSection = document.createElement("section");
    filtersSection.classList.add("filters");
  
    // Création des sections pour les filtres
    const ingredientFilter = createFilterSection(
      "Ingrédients",
      "ingredient",
      "Rechercher un ingrédient"
    );
    const applianceFilter = createFilterSection(
      "Appareils",
      "appliance",
      "Rechercher un appareil"
    );
    const ustensilFilter = createFilterSection(
      "Ustensiles",
      "ustensil",
      "Rechercher un ustensile"
    );
  
    // Ajout des filtres à la section principale
    filtersSection.appendChild(ingredientFilter);
    filtersSection.appendChild(applianceFilter);
    filtersSection.appendChild(ustensilFilter);
  
    // Ajout du texte des recettes
    const filterText = document.createElement("div");
    filterText.classList.add("filter-text");
    filterText.textContent = "1500 recettes";
    filtersSection.appendChild(filterText);
  
    return filtersSection;
  }
  
  // Ajout de la section des filtres au DOM
  document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("filtersContainer");
  
    if (container) {
      // Vérifie si une section "filters" existe déjà
      if (!container.querySelector(".filters")) {
        const filtersSection = createFiltersSection();
        container.appendChild(filtersSection);
      } else {
        console.warn("Une section 'filters' existe déjà dans le DOM.");
      }
    } else {
      console.error("Le conteneur #filtersContainer est introuvable.");
    }
  });