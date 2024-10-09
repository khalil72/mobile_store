let MobileData;
let OnlyParsedMobileDataToHTML;
let currentPage = 1;
let TotalPages;
const NoOFItemShowOnScreen = 12;

// Fetch data from JSON file
fetch("assets/data/mobile.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    MobileData = data;
    OnlyParsedMobileDataToHTML = data; // Store the full dataset for reference
    MobileDataParsedFromSidebarFiltering(OnlyParsedMobileDataToHTML);
  })
  .catch((Err) => {
    console.log(Err, Err?.message);
  });

function MobileDataParsedFromSidebarFiltering(mobile_data) {
  document.getElementById('products').innerHTML = '';
  Loading(); // Show loading spinner while filtering
  let filtering = mobile_data;

  // Apply company filtering only
  if (selectedMobilecompany) {
    filtering = filtering.filter((a) => {
      return selectedMobilecompany.toLowerCase() === a.companyName?.toLowerCase();
    });
  }

  // If sorting is selected, apply sorting
  if (selectedSorting) {
    filtering = filtering.sort((a, b) => {
      if (selectedSorting === 'latest') return new Date(b.Date) - new Date(a.Date);
      else if (selectedSorting === 'PriceDescending') return b.Price - a.Price;
      else return a.Price - b.Price;
    });
  }

  OnlyParsedMobileDataToHTML = filtering;

  setTimeout(() => {
    removeLoading();

    if (!OnlyParsedMobileDataToHTML.length) {
      // No products found: show message
      const products = document.getElementById("products");
      const error_div = document.createElement('div');
      error_div.classList.add("error_not_found");
      error_div.innerHTML = `
        <div> 
          <i id="not_found_icon" class="fa-solid fa-ban"></i>
          <h1>No Product Found</h1>
        </div>
        <p>Use Efficient search & Filter for Best result</p>
      `;
      products.appendChild(error_div);
    } else {
      // Products found: show them and apply pagination
      GetProductsANDStoreinHTML(OnlyParsedMobileDataToHTML);
    }
  }, 1500); // Simulated delay for loading spinner
}

// Function to display products and handle pagination
function GetProductsANDStoreinHTML(data) {
  const products = document.getElementById("products");

  setTimeout(() => {
    TotalPages = Math.ceil(data.length / NoOFItemShowOnScreen);
    const paginationCon = document.getElementById('pagniationContainer');

    paginationCon.innerHTML = `
      <div class="box" id="prev" onclick="if (currentPage > 1) Pagination(currentPage - 1);">
        <i class="fa-solid fa-backward-fast"></i>
      </div>
    `;

    for (let i = 1; i <= TotalPages; i++) {
      paginationCon.innerHTML += `
        <div class="box" id="${i}" onclick="Pagination(${i})">
          ${i}
        </div>
      `;
    }

    paginationCon.innerHTML += `
      <div class="box" id="next" onclick="if (currentPage < TotalPages) Pagination(currentPage + 1);">
        <i class="fa-solid fa-forward-fast"></i>
      </div>
    `;

    Pagination(1);
    removeLoading();
  }, 1500);
}

// Pagination handler
function Pagination(noOfPage) {
  currentPage = noOfPage;
  if (currentPage > TotalPages) return;

  console.log(currentPage, TotalPages);

  const products = document.getElementById("products");
  products.innerHTML = '';
  let startingPoint = NoOFItemShowOnScreen * (noOfPage - 1);

  if (noOfPage > 1) {
    document.getElementById(String(noOfPage - 1))?.classList?.remove('active');
  }
  document.getElementById(String(noOfPage))?.classList?.add('active');

  for (let i = startingPoint; i < OnlyParsedMobileDataToHTML.length && i < (startingPoint + NoOFItemShowOnScreen); i++) {
    StoreCardandMerge(products, OnlyParsedMobileDataToHTML[i]);
  }
}

// Function to display individual mobile cards
function StoreCardandMerge(productContainer, mobile) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = ` 
    <div class="Imgcontainer">
      <img
        src="${mobile.ImgURL}"
        alt="${mobile.Name}"
      />
      <div class="overlay">
        <div class="text"> Cart <i class="fa-solid fa-cart-shopping"></i></div>
      </div>
    </div>
    <div class="NameContainer">${mobile.Name}</div>
    <div class="priceContainer"><sup>Rs.</sup>${new Intl.NumberFormat().format(mobile.Price)}/-</div>
    <button>View &rarr;</button>`;

  productContainer.appendChild(card);
}

// Loading spinner function
function Loading() {
  const loading_div = document.createElement('div');
  loading_div.classList.add("loading_class");
  loading_div.innerHTML = `
    <i id="loading_icon" class="fa-solid fa-spinner fa-spin-pulse"></i>
  `;
  document.getElementById('products').appendChild(loading_div);
}

// Remove loading spinner function
function removeLoading() {
  const loading_div = document.querySelector('.loading_class');
  if (loading_div) {
    loading_div.remove();
  }
}

// Handle sorting and company filter changes
let mobilecompany = document.getElementsByName("mobilecompany");
let sorting = document.getElementsByName("sorting");
let selectedMobilecompany, selectedSorting;

for (let i = 0; i < mobilecompany.length; i++) {
  mobilecompany[i].addEventListener("change", () => {
    if (mobilecompany[i].checked) {
      selectedMobilecompany = mobilecompany[i].value;
      console.log(selectedMobilecompany);

      // Reset sorting when a new company is selected
      selectedSorting = undefined;
      sorting.forEach((e) => {
        e.checked = false; // Clear previous selections
      });

      MobileDataParsedFromSidebarFiltering(MobileData); // Refresh data with full dataset
    }
  });
}

for (let i = 0; i < sorting.length; i++) {
  sorting[i].addEventListener("change", () => {
    if (sorting[i].checked) {
      selectedSorting = sorting[i].value;
      console.log(selectedSorting);
      MobileDataParsedFromSidebarFiltering(OnlyParsedMobileDataToHTML); // Refresh data with filtered dataset
    }
  });
}
