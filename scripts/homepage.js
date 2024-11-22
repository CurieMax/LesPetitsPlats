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