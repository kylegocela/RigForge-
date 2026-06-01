const products = [
    {
        id: 1,
        title: "Celestial Stellar X",
        name: "Intel Core i9-13900K",
        spec: "RTX 4090 24GB",
        price: 67000,
        category: "Gaming",
        brand: "INTEL",
        image: "assets/cat1.jpg",
        alt: "Gaming PC Build 1",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ornare eu sapien a dignissim. Mauris posuere vestibulum justo, quis viverra arcu bibendum quis. Donec porta turpis sit a met augue consequat congue. "
    },
    {
        id: 2,
        title: "Wintone Pro",
        name: "AMD Ryzen 9 7950X",
        spec: "RTX 4080 Super 16GB",
        price: 45600,
        category: "Gaming",
        brand: "AMD",
        image: "assets/cat2.png",
        alt: "Gaming PC Build 2",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ornare eu sapien a dignissim. Mauris posuere vestibulum justo, quis viverra arcu bibendum quis. Donec porta turpis sit a met augue consequat congue. "
    },
    {
        id: 3,
        title: "Hydra X",
        name: "Intel Core i7-14700K",
        spec: "RX 7900 XTX 24GB",
        price: 68800,
        category: "Gaming",
        brand: "INTEL",
        image: "assets/cat3.png",
        alt: "Gaming PC Build 3",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ornare eu sapien a dignissim. Mauris posuere vestibulum justo, quis viverra arcu bibendum quis. Donec porta turpis sit a met augue consequat congue. "
    },
    {
        id: 4,
        title: "Crimson Flux Ultra",
        name: "AMD Ryzen 7 7800X3D",
        spec: "RTX 5090 Ti 32GB",
        price: 76000,
        category: "Gaming",
        brand: "AMD",
        image: "assets/cat4.png",
        alt: "Gaming PC Build 4",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ornare eu sapien a dignissim. Mauris posuere vestibulum justo, quis viverra arcu bibendum quis. Donec porta turpis sit a met augue consequat congue. "
    },
    {
        id: 5,
        title: "Nighteldin",
        name: "Intel Core i5-14600K",
        spec: "RTX 4070 Ti 12GB",
        price: 42550,
        category: "Gaming",
        brand: "INTEL",
        image: "assets/cat5.png",
        alt: "Gaming PC Build 5",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ornare eu sapien a dignissim. Mauris posuere vestibulum justo, quis viverra arcu bibendum quis. Donec porta turpis sit a met augue consequat congue. "
    },
    {
        id: 6,
        title: "Eclipse Warlord Max",
        name: "AMD Ryzen 5 7600X",
        spec: "RX 7800 XT 16GB",
        price: 82500,
        category: "Gaming",
        brand: "AMD",
        image: "assets/cat6.png",
        alt: "Gaming PC Build 6",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ornare eu sapien a dignissim. Mauris posuere vestibulum justo, quis viverra arcu bibendum quis. Donec porta turpis sit a met augue consequat congue. "
    }
];

const fmt = price => "₱ " + price.toLocaleString() + ".00";
const $  = id => document.getElementById(id);


// ACCOUNT SYSTEM
const getUsers       = ()    => JSON.parse(sessionStorage.getItem("users")) || [];
const saveUsers      = users => sessionStorage.setItem("users", JSON.stringify(users));
const getLoggedIn    = ()    => JSON.parse(sessionStorage.getItem("loggedInUser"));
const setLoggedIn    = user  => sessionStorage.setItem("loggedInUser", JSON.stringify(user));
const clearLoggedIn  = ()    => sessionStorage.removeItem("loggedInUser");


// REGISTER PAGE
if ($("registerBtn")) {
    $("registerBtn").addEventListener("click", () => {
        const firstName = $("regFirstName").value.trim();
        const lastName  = $("regLastName").value.trim();
        const email     = $("regEmail").value.trim();
        const password  = $("regPassword").value.trim();

        if (!firstName || !lastName || !email || !password) return alert("Please fill in all fields.");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))     return alert("Please enter a valid email.");

        const users = getUsers();
        if (users.find(u => u.email === email)) return alert("Email already registered!");

        users.push({ firstName, lastName, email, password });
        saveUsers(users);
        alert("Account created! Please log in.");
        window.location.href = "rigforgeLogin.html";
    });
}


// LOGIN PAGE
if ($("loginBtn")) {
    $("loginBtn").addEventListener("click", () => {
        const email    = $("loginEmail").value.trim();
        const password = $("loginPassword").value.trim();

        if (!email || !password) return alert("Please fill in all fields.");

        const user = getUsers().find(u => u.email === email && u.password === password);
        if (!user) return alert("Invalid email or password.");

        setLoggedIn(user);
        window.location.href = "rigforgeAccount.html";
    });
}


// ACCOUNT PAGE
if ($("user-name")) {
    const user = getLoggedIn();
    if (!user) {
        window.location.href = "rigforgeLogin.html";
    } else {

        // Ensure optional fields exist
        user.address  = user.address  || "";
        user.address2 = user.address2 || "";

        // Field definitions: each cell, its user-object keys, and optional type
        const FIELDS = [
            { cellId: "user-name",     keys: ["firstName", "lastName"], joiner: " " },
            { cellId: "user-email",    keys: ["email"],                 type: "email" },
            { cellId: "user-address",  keys: ["address"]  },
            { cellId: "user-address2", keys: ["address2"] },
        ];

        const editBtn     = $("editBtn");
        const saveBtn     = $("saveBtn");
        const cancelBtn   = $("cancelBtn");
        const editActions = $("editActions");
        const saveToast   = $("saveToast");

        // Render display values into table cells
        function renderDisplay() {
            FIELDS.forEach(({ cellId, keys, joiner }) => {
                const cell = $(cellId);
                cell.textContent = keys.map(k => user[k] || "").join(joiner || "").trim();
            });
        }

        renderDisplay();

        // Logout
        document.querySelector(".logout-link").addEventListener("click", (e) => {
            e.preventDefault();
            clearLoggedIn();
            window.location.href = "rigforgeLogin.html";
        });

        // Enter edit mode: swap cell text for inputs
        function enterEditMode() {
            FIELDS.forEach(({ cellId, keys, joiner }) => {
                const cell  = $(cellId);
                const value = keys.map(k => user[k] || "").join(joiner || "").trim();

                const input       = document.createElement("input");
                input.type        = "text";
                input.className   = "editable-input";
                input.value       = value;

                const errSpan     = document.createElement("span");
                errSpan.className = "field-error";
                errSpan.id        = cellId + "-err";

                cell.innerHTML = "";
                cell.appendChild(input);
                cell.appendChild(errSpan);
            });

            editBtn.style.display = "none";
            editActions.classList.add("visible");

            const first = document.querySelector(".editable-input");
            if (first) first.focus();
        }

        // Exit edit mode: restore display values
        function exitEditMode() {
            renderDisplay();
            editBtn.style.display = "";
            editActions.classList.remove("visible");
        }

        // Validate inputs and save to sessionStorage
        function saveChanges() {
            let valid     = true;
            const updates = {};

            FIELDS.forEach(({ cellId, keys, type }) => {
                const cell  = $(cellId);
                const input = cell.querySelector(".editable-input");
                const err   = cell.querySelector(".field-error");
                if (!input) return;

                const val = input.value.trim();
                err.textContent = "";
                err.classList.remove("visible");

                if (type === "email") {
                    if (!val) {
                        err.textContent = "Email is required.";
                        err.classList.add("visible");
                        valid = false;
                        return;
                    }
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                        err.textContent = "Please enter a valid email.";
                        err.classList.add("visible");
                        valid = false;
                        return;
                    }
                }

                // Split "First Last" back into two keys for the name field
                if (keys.length === 2 && keys[0] === "firstName") {
                    const parts          = val.split(" ");
                    updates["firstName"] = parts[0] || "";
                    updates["lastName"]  = parts.slice(1).join(" ") || "";
                } else {
                    updates[keys[0]] = val;
                }
            });

            if (!valid) return;

            // Email uniqueness check
            if (updates.email && updates.email !== user.email) {
                const taken = getUsers().find(u => u.email === updates.email);
                if (taken) {
                    const errEl = $("user-email-err");
                    if (errEl) {
                        errEl.textContent = "This email is already in use.";
                        errEl.classList.add("visible");
                    }
                    return;
                }
            }

            // Persist updates
            const users = getUsers();
            const idx   = users.findIndex(u => u.email === user.email);
            Object.assign(user, updates);
            if (idx !== -1) users[idx] = user;
            else            users.push(user);
            saveUsers(users);
            setLoggedIn(user);

            exitEditMode();

            saveToast.classList.add("show");
            setTimeout(() => saveToast.classList.remove("show"), 2200);
        }

        editBtn.addEventListener("click",   enterEditMode);
        cancelBtn.addEventListener("click", exitEditMode);
        saveBtn.addEventListener("click",   saveChanges);
    }
}

if ($("userNavBtn")) {
    if (getLoggedIn()) $("userNavBtn").href = "rigforgeAccount.html";
}

// CATALOG PAGE
if ($("productGrid")) {
    const grid = $("productGrid");

    function renderProducts(list) {
        grid.innerHTML = "";

        if (list.length === 0) {
            grid.innerHTML = `<p class="noResults">No products match your filters.</p>`;
            return;
        }

        list.forEach(p => {
            const card = document.createElement("div");
            card.className = "productCard";
            card.setAttribute("data-id", p.id);
            card.innerHTML = `
                <div class="productImageWrap">
                    <img src="${p.image}" alt="${p.alt}">
                    <div class="productOverlay">
                        <div class="prodTitle">${p.title}</div>
                        <div class="prodName">${p.name}</div>
                        <div class="prodSpec">${p.spec}</div>
                    </div>
                </div>
                <div class="productPrice">${fmt(p.price)}</div>
            `;
            card.addEventListener("click", () => {
                sessionStorage.setItem("selectedProduct", JSON.stringify(p));
                window.location.href = "rigforgeProductPage.html?id=" + p.id;
            });
            grid.appendChild(card);
        });
    }

    function getFilteredSorted() {
  
        const checkedCategories = [...document.querySelectorAll('input[data-filter="category"]:checked')].map(el => el.value);
        const checkedBrands     = [...document.querySelectorAll('input[data-filter="brand"]:checked')].map(el => el.value);

        // Parse price range input — accepts "min - max", "min-max", or just "max"
        const priceRaw = document.querySelector(".priceInput").value.trim();
        let minPrice = 0, maxPrice = Infinity;
        if (priceRaw) {
            const parts = priceRaw.split("-").map(s => parseFloat(s.replace(/[^\d.]/g, "")));
            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                minPrice = parts[0];
                maxPrice = parts[1];
            } else if (parts.length === 1 && !isNaN(parts[0])) {
                maxPrice = parts[0];
            }
        }

        let result = products.filter(p => {
            const catMatch   = checkedCategories.length === 0 || checkedCategories.includes(p.category);
            const brandMatch = checkedBrands.length === 0     || checkedBrands.includes(p.brand);
            const priceMatch = p.price >= minPrice && p.price <= maxPrice;
            return catMatch && brandMatch && priceMatch;
        });

        const sort = $("sortSelect").value;
        if (sort === "low")    result.sort((a, b) => a.price - b.price);
        if (sort === "high")   result.sort((a, b) => b.price - a.price);
        if (sort === "newest") result.sort((a, b) => b.id - a.id);


        return result;
    }


    renderProducts(getFilteredSorted());


    $("sortSelect").addEventListener("change", () => renderProducts(getFilteredSorted()));

    // Apply Filters button
    document.querySelector(".applyBtn").addEventListener("click", () => renderProducts(getFilteredSorted()));

    // Clear All button — uncheck everything, clear price, re-render
    document.querySelector(".clearBtn").addEventListener("click", () => {
        document.querySelectorAll(".catalogSidebar input[type='checkbox']").forEach(cb => cb.checked = false);
        document.querySelector(".priceInput").value = "";
        $("sortSelect").value = "best";
        renderProducts(getFilteredSorted());
    });
}


// PRODUCT PAGE
if ($("mainProductImage")) {
    const id = parseInt(new URLSearchParams(window.location.search).get("id"));
    const p  = products.find(p => p.id === id);

    if (!p) {
        window.location.href = "rigforgeCatalog.html";
    } else {
        document.title = p.name + " | Rigforge Customs";
        $("breadcrumbName").textContent = p.title;
        $("productName").textContent    = p.title;
        $("productPrice").textContent   = fmt(p.price);
        $("productDescription").textContent = p.description;
        $("productSpecs").innerHTML     = `<li>${p.category}</li><li>${p.name}</li><li>${p.spec}</li><li>${p.brand}</li>`;

        const mainImg = $("mainProductImage");
        mainImg.src = $("thumb1").src = p.image;
        mainImg.alt = p.alt;

        document.querySelectorAll(".thumbnail").forEach(thumb => {
            thumb.addEventListener("click", function() {
                mainImg.src = this.src;
                mainImg.alt = this.alt;
                document.querySelectorAll(".thumbnail").forEach(t => t.classList.remove("active"));
                this.classList.add("active");
            });
        });

        $("buyNowBtn").addEventListener("click", () => {
            sessionStorage.setItem("selectedProduct", JSON.stringify(p));
            sessionStorage.setItem("selectedQty", parseInt($("productQty").value) || 1);
            window.location.href = "rigforgeCheckout.html";
        });
    }
}


// QUOTATION PAGE
if ($("quotationSubmitBtn")) {
    $("quotationSubmitBtn").addEventListener("click", () => {
        const fields = [
            { el: $("qFullName"), err: $("errFullName"), label: "Full name is required." },
            { el: $("qEmail"),    err: $("errEmail"),    label: "Email is required.", extra: "email" },
            { el: $("qBudget"),   err: $("errBudget"),   label: "Budget range is required." },
        ];

        // Clear previous errors
        fields.forEach(({ el, err }) => {
            el.classList.remove("error");
            err.textContent = "";
        });

        let valid = true;

        fields.forEach(({ el, err, label, extra }) => {
            const val = el.value.trim();
            if (!val) {
                valid = false;
                el.classList.add("error");
                err.textContent = label;
            } else if (extra === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                valid = false;
                el.classList.add("error");
                err.textContent = "Please enter a valid email address.";
            }
        });

        if (valid) alert("Quotation request submitted!");
    });
}


// CHECKOUT PAGE
if ($("checkoutProductImage")) {
    const p   = JSON.parse(sessionStorage.getItem("selectedProduct"));
    const qty = parseInt(sessionStorage.getItem("selectedQty")) || 1;

    if (!p) {
        window.location.href = "rigforgeCatalog.html";
    } else {
        const total = fmt(p.price * qty);
        $("checkoutProductImage").src    = p.image;
        $("checkoutProductImage").alt    = p.alt;
        $("checkoutProductTitle").textContent = p.title;
        $("checkoutProductName").textContent  = p.name;
        $("checkoutProductSpec").textContent  = p.spec;
        $("checkoutProductPrice").textContent = total;
        $("checkoutSubtotal").textContent     = total;
        $("checkoutTotal").textContent        = total;

        document.querySelectorAll(".checkoutRadioGroup").forEach(group => {
            group.querySelectorAll("input[type='radio']").forEach(radio => {
                radio.addEventListener("change", function() {
                    group.querySelectorAll(".checkoutRadioOption").forEach(o => o.classList.remove("selected"));
                    this.parentElement.classList.add("selected");
                });
            });
        });

        document.querySelector(".completeOrderBtn").addEventListener("click", () => {
            const fields = [
                { el: $("fieldContact"),   label: "Contact" },
                { el: $("fieldFirstName"), label: "First name" },
                { el: $("fieldLastName"),  label: "Last name" },
                { el: $("fieldAddress"),   label: "Address" },
                { el: $("fieldBarangay"),  label: "Barangay" },
                { el: $("fieldPostal"),    label: "Postal code" },
                { el: $("fieldCity"),      label: "City" },
                { el: $("fieldPhone"),     label: "Phone" },
            ];

            document.querySelectorAll(".checkoutError").forEach(e => e.remove());
            document.querySelectorAll(".checkoutInput.error").forEach(e => e.classList.remove("error"));

            let valid = true;

            fields.forEach(({ el, label }) => {
                if (!el.value.trim()) {
                    valid = false;
                    el.classList.add("error");
                    const msg = document.createElement("span");
                    msg.className   = "checkoutError";
                    msg.textContent = label + " is required.";
                    el.parentElement.appendChild(msg);
                }
            });

            const agreed = document.querySelector(".checkoutAgree input[type='checkbox']");
            if (!agreed.checked) {
                valid = false;
                if (!document.querySelector(".agreeError")) {
                    const msg = document.createElement("span");
                    msg.className   = "checkoutError agreeError";
                    msg.textContent = "You must agree to the terms and conditions.";
                    agreed.parentElement.insertAdjacentElement("afterend", msg);
                }
            }

            if (valid) alert("Order placed successfully!");
        });
    }
}