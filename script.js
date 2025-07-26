document.addEventListener("DOMContentLoaded", () => {
  const hamburgerIcon = document.getElementById("hamburgerIcon");
  const logoLink = document.getElementById("logoLink");
  const appSidebar = document.getElementById("appSidebar");
  const pageOverlay = document.getElementById("pageOverlay");
  const sidebarLinksForReference = document.querySelectorAll(
    ".sidebar-nav ul li a"
  );
  const mainContentArea = document.getElementById("main-content-area");
  const topicSearchInput = document.getElementById("topicSearchInput");
  const searchSuggestionsBox = document.getElementById("searchSuggestionsBox");
  const submitSearchButton = document.getElementById("submitSearchButton");
  const contentDataStore = document.getElementById("content-data-store");

  const homeSectionKey = "home paikari bazar পাইকারি বাজার";
  
//for stop inspact to download code
      // --- Code to block Developer Tools ---

        // 1. Block right-click context menu
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });

        // 2. Block specific key combinations
        document.onkeydown = function(e) {
            // Block F12
            if (event.keyCode == 123) {
                return false;
            }
            // Block Ctrl+Shift+I
            if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
                return false;
            }
            // Block Ctrl+Shift+C
            if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
                return false;
            }
            // Block Ctrl+Shift+J
            if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
                return false;
            }
            // Block Ctrl+U (View Page Source)
            if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
                return false;
            }
        };

        // 3. A trick to make the debugger unusable
        // This will continuously trigger the debugger if the dev tools are open,
        // making it very difficult to use the console or sources tab.
        setInterval(function () {
            debugger;
        }, 500);
 //----------------------

  const sectionOrder = [];
  const availableTopics = [];
  sidebarLinksForReference.forEach((link) => {
    const sectionKey = link.getAttribute("data-section");
    const sectionName = link.textContent;
    sectionOrder.push(sectionKey);
    availableTopics.push({ name: sectionName, sectionKey: sectionKey });
  });
  let currentSectionIndex =
    sectionOrder.indexOf(homeSectionKey) !== -1
      ? sectionOrder.indexOf(homeSectionKey)
      : 0;

  function updateActiveSidebarLink(sectionKey) {
    sidebarLinksForReference.forEach((l) => l.classList.remove("active"));
    const activeLink = Array.from(sidebarLinksForReference).find(
      (link) => link.getAttribute("data-section") === sectionKey
    );
    if (activeLink) activeLink.classList.add("active");
  }

  function loadContent(sectionKeyToLoad) {
    const contentTemplate = contentDataStore.querySelector(
      `template[data-content-key="${sectionKeyToLoad}"]`
    );

    if (contentTemplate) {
      mainContentArea.innerHTML = contentTemplate.innerHTML;
    } else {
      mainContentArea.innerHTML = `<div class="tutorial-header"><h1>${sectionKeyToLoad} Tutorial</h1><div class="nav-buttons"><button class="prev-btn">&lt; Home</button><button class="next-btn">Next &gt;</button></div></div><section class="content-section"><h2>${sectionKeyToLoad}</h2><p>Content for ${sectionKeyToLoad} tutorial will be added soon.</p></section>`;
    }

    updateActiveSidebarLink(sectionKeyToLoad);
    currentSectionIndex = sectionOrder.indexOf(sectionKeyToLoad);
    if (currentSectionIndex === -1 && sectionOrder.length > 0)
      currentSectionIndex = 0;
    mainContentArea.scrollTop = 0;

    if (
      window.innerWidth <= 768 &&
      document.body.classList.contains("sidebar-open")
    ) {
      document.body.classList.remove("sidebar-open");
    }
  }

  // SIDEBAR & OVERLAY
  hamburgerIcon.addEventListener("click", () =>
    document.body.classList.toggle("sidebar-open")
  );
  pageOverlay.addEventListener("click", () => {
    if (document.body.classList.contains("sidebar-open")) {
      document.body.classList.remove("sidebar-open");
    }
  });


  // LOGO CLICK
  logoLink.addEventListener("click", (event) => {
    event.preventDefault();
    loadContent(homeSectionKey);
    topicSearchInput.value = "";
    searchSuggestionsBox.style.display = "none";
    searchSuggestionsBox.innerHTML = "";
    if (
      window.innerWidth <= 768 &&
      document.body.classList.contains("sidebar-open")
    ) {
      document.body.classList.remove("sidebar-open");
    }
  });

  // SIDEBAR LINKS CLICK
  sidebarLinksForReference.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const sectionName = this.getAttribute("data-section");
      loadContent(sectionName);
      topicSearchInput.value = "";
      searchSuggestionsBox.style.display = "none";
      searchSuggestionsBox.innerHTML = "";
    });
  });

  // MAIN CONTENT NAVIGATION BUTTONS (PREVIOUS/NEXT)
  mainContentArea.addEventListener("click", function (event) {
    const target = event.target;
    if (
      target.classList.contains("prev-btn") ||
      (target.parentElement &&
        target.parentElement.classList.contains("prev-btn"))
    ) {
      // Previous button logic
      if (sectionOrder.length > 0) {
        // Ensure sectionOrder is not empty
        let prevIndex = currentSectionIndex - 1;
        if (prevIndex < 0) {
          prevIndex = sectionOrder.length - 1; // Wrap around to the last item
        }
        loadContent(sectionOrder[prevIndex]);
      }
    } else if (
      target.classList.contains("next-btn") ||
      (target.parentElement &&
        target.parentElement.classList.contains("next-btn"))
    ) {
      // Next button logic
      if (sectionOrder.length > 0) {
        // Ensure sectionOrder is not empty
        let nextIndex = (currentSectionIndex + 1) % sectionOrder.length;
        loadContent(sectionOrder[nextIndex]);
      }
    }
    // Common actions after navigation
    topicSearchInput.value = "";
    searchSuggestionsBox.style.display = "none";
    searchSuggestionsBox.innerHTML = "";
  });
  //-------------



  // SEARCH FUNCTIONALITY
  submitSearchButton.addEventListener("click", function () {
    this.classList.add("clicked");
    const firstSuggestion = searchSuggestionsBox.querySelector(
      "div:not(.no-results)"
    );

    if (firstSuggestion && firstSuggestion.hasAttribute("data-sectionkey")) {
      firstSuggestion.click();
    } else if (topicSearchInput.value.trim() !== "") {
      const exactMatchKey = topicSearchInput.value.trim();
      let foundTopic = availableTopics.find(
        (topic) =>
          topic.sectionKey.toLowerCase() === exactMatchKey.toLowerCase() ||
          topic.name.toLowerCase() === exactMatchKey.toLowerCase()
      );

      if (foundTopic) {
        const contentTemplate = contentDataStore.querySelector(
          `template[data-content-key="${foundTopic.sectionKey}"]`
        );
        if (contentTemplate) {
          loadContent(foundTopic.sectionKey);
          topicSearchInput.value = "";
          searchSuggestionsBox.style.display = "none";
          searchSuggestionsBox.innerHTML = "";
        }
      } else {
        searchSuggestionsBox.innerHTML = "";
        const noResultsDiv = document.createElement("div");
        noResultsDiv.textContent = `"${exactMatchKey}" এর জন্য কোন বিষয় পাওয়া যায়নি.`;
        noResultsDiv.classList.add("no-results");
        searchSuggestionsBox.appendChild(noResultsDiv);
        searchSuggestionsBox.style.display = "block";
      }
    } else {
      searchSuggestionsBox.style.display = "none";
      searchSuggestionsBox.innerHTML = "";
    }
    setTimeout(() => this.classList.remove("clicked"), 300);
  });

  topicSearchInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      submitSearchButton.click();
    }
  });

  topicSearchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    searchSuggestionsBox.innerHTML = "";
    if (searchTerm.length === 0) {
      searchSuggestionsBox.style.display = "none";
      return;
    }
    const filteredTopics = availableTopics.filter(
      (topic) =>
        topic.name.toLowerCase().includes(searchTerm) ||
        topic.sectionKey.toLowerCase().includes(searchTerm)
    );
    if (filteredTopics.length > 0) {
      filteredTopics.forEach((topic) => {
        const suggestionDiv = document.createElement("div");
        suggestionDiv.textContent = topic.name;
        suggestionDiv.setAttribute("data-sectionkey", topic.sectionKey);
        suggestionDiv.addEventListener("click", () => {
          loadContent(topic.sectionKey);
          topicSearchInput.value = "";
          searchSuggestionsBox.style.display = "none";
          searchSuggestionsBox.innerHTML = "";
        });
        searchSuggestionsBox.appendChild(suggestionDiv);
      });
    } else {
      const noResultsDiv = document.createElement("div");
      noResultsDiv.textContent = "কোন বিষয় পাওয়া যায়নি.";
      noResultsDiv.classList.add("no-results");
      searchSuggestionsBox.appendChild(noResultsDiv);
    }
    searchSuggestionsBox.style.display = "block";
  });

  document.addEventListener("click", function (event) {
    const searchWrapper = topicSearchInput.closest(".search-input-wrapper");
    if (
      searchWrapper &&
      !searchWrapper.contains(event.target) &&
      !searchSuggestionsBox.contains(event.target)
    ) {
      searchSuggestionsBox.style.display = "none";
    }
  });

  topicSearchInput.addEventListener("focus", function () {
    if (this.value.length > 0 && searchSuggestionsBox.children.length > 0) {
      if (searchSuggestionsBox.querySelector("div")) {
        searchSuggestionsBox.style.display = "block";
      }
    }
  });

  if (sectionOrder.length > 0) {
    loadContent(sectionOrder[currentSectionIndex]);
  } else {
    mainContentArea.innerHTML = "<p>কোন সামগ্রী উপলব্ধ নেই।</p>";
  }
  updateActiveSidebarLink(sectionOrder[currentSectionIndex]);
});
