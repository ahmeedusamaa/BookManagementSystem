let books = [];
let editingIndex = -1;
let numBooksInput = document.getElementById("numBooks");
let bookForm = document.getElementById("bookForm");
let booksTableBody = document.getElementById("booksBody");
let booksTable = document.getElementById("booksTable");
let genBtn = document.getElementById("genBtn");
let text = document.getElementById("text");
let reEnterBtn = document.getElementById("reEnterBtn");
//hide the table
booksTable.style.display = "none";
bookForm.style.border = "0px solid black";






//check books in local storage
if (localStorage.getItem("books")) {
  numBooksInput.style.display = "none";
  genBtn.style.display = "none";
  text.style.display = "none";
  bookForm.style.display = "none";
  reEnterBtn.style.display = "block";
  booksTable.style.display = "block";
  books = JSON.parse(localStorage.getItem("books"));
  books.forEach((book) => {
    booksTableBody.innerHTML += `
      <tr>
        <td>${book.title}</td>
        <td>${book.price}</td>
        <td>${book.author.name}</td>
        <td>${book.author.email}</td>
        <td>
          <button class="edit-btn" onclick="editRow(this)">Edit</button>
          <button class="delete-btn" onclick="deleteRow(this)">Delete</button>
        </td>
      </tr>
    `;
  });
}else{
  reEnterBtn.style.display = "none";
}




function reEnter () {
  // Show the numBooks input and the genBtn
  numBooksInput.style.display = "block";
  reEnterBtn.style.display = "none";
  genBtn.style.display = "block";
  text.style.display = "block";
  booksTable.style.display = "none"; // Hide the table
  reEnterButton.style.display = "none"; // Hide the re-enter button itself
};


function generateBookForm() {
  console.log("generateBookForm");
  bookForm.innerHTML = "";
  genBtn.style.display = "none";
  booksTable.style.display = "none";

  numBooksInput.style.display = "none";
  text.style.display = "none";
  
  bookForm.style.border = "1px solid #ccc";
  bookForm.style.display = "block"; 

  // Get and validate user input
  let numBooks = numBooksInput.value;

  if (isNaN(numBooks) || numBooks < 1) {
    alert("Please enter a valid number of books.");
    return;
  }

  // Ensure fresh book entries based on new input
  for (let i = 0; i < numBooks; i++) {
    let bookDiv = document.createElement("div");
    bookDiv.classList.add("book-entry"); // Add class for styling
    bookDiv.innerHTML = `
      <label>Title:</label>
      <input type="text" id="bookName${i}" required>

      <label>Price:</label>
      <input type="number" id="price${i}" required>

      <label>Author Name:</label>
      <input type="text" id="authorName${i}" required>

      <label>Email:</label>
      <input type="email" id="authorEmail${i}" required>
    `;
    bookForm.appendChild(bookDiv);
  }

  // Create submit button
  let submitButton = document.createElement("button");
  submitButton.id = "submitButton";
  submitButton.innerHTML = "Submit";
  submitButton.type = "submit";
  bookForm.appendChild(submitButton);

  bookForm.onsubmit = handleSubmit;
}

function handleSubmit(event) {
  event.preventDefault();
  genBtn.style.display = "none";
  reEnterBtn.style.display = "block";
  text.style.display = "none";
  bookForm.style.display = "none";
  booksTable.style.display = "block";

  if (editingIndex !== -1) {
    let book = {
      title: document.getElementById(`bookName${editingIndex}`).value,
      price: document.getElementById(`price${editingIndex}`).value,
      author: {
        name: document.getElementById(`authorName${editingIndex}`).value,
        email: document.getElementById(`authorEmail${editingIndex}`).value,
      },
    };

    books[editingIndex] = book;

    let row = booksTableBody.rows[editingIndex];
    row.cells[0].innerText = book.title;
    row.cells[1].innerText = book.price;
    row.cells[2].innerText = book.author.name;
    row.cells[3].innerText = book.author.email;

    editingIndex = -1;
    document.getElementById("submitButton").innerText = "Submit";
  } else {
    for (let i = 0; i < numBooksInput.value; i++) {
      let book = {
        title: document.getElementById(`bookName${i}`).value,
        price: document.getElementById(`price${i}`).value,
        author: {
          name: document.getElementById(`authorName${i}`).value,
          email: document.getElementById(`authorEmail${i}`).value,
        },
      };

      books.push(book);
      localStorage.setItem("books", JSON.stringify(books));

      booksTableBody.innerHTML += `  
        <tr>
          <td>${book.title}</td>
          <td>${book.price}</td>
          <td>${book.author.name}</td>
          <td>${book.author.email}</td>
          <td>
            <button class="edit-btn" onclick="editRow(this)">Edit</button>
            <button class="delete-btn" onclick="deleteRow(this)">Delete</button>
          </td>
        </tr>
      `;
    }
  }


}


function deleteRow(button) {
  let row = button.parentElement.parentElement;
  let rowIndex = row.rowIndex - 1;
  books.splice(rowIndex, 1);
  localStorage.setItem("books", JSON.stringify(books));
  row.remove();
}

function editRow(button) {
  let row = button.parentElement.parentElement;
  editingIndex = row.rowIndex - 1;

  let book = books[editingIndex];

  row.innerHTML = `
      <td><input type="text" id="bookName${editingIndex}" value="${book.title}" required></td>
      <td><input type="number" id="price${editingIndex}" value="${book.price}" required></td>
      <td><input type="text" id="authorName${editingIndex}" value="${book.author.name}" required></td>
      <td><input type="email" id="authorEmail${editingIndex}" value="${book.author.email}" required></td>
      <td>
          <button onclick="saveEdit(${editingIndex})">Save</button>
          <button onclick="cancelEdit(${editingIndex}, this)">Cancel</button>
      </td>
  `;

  document.getElementById("submitButton").innerText = "Update";
}

function saveEdit(index) {
  let book = {
    title: document.getElementById(`bookName${index}`).value,
    price: document.getElementById(`price${index}`).value,
    author: {
      name: document.getElementById(`authorName${index}`).value,
      email: document.getElementById(`authorEmail${index}`).value,
    },
  };

  books[index] = book;
  localStorage.setItem("books", JSON.stringify(books));

  let row = booksTableBody.rows[index];
  row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.price}</td>
      <td>${book.author.name}</td>
      <td>${book.author.email}</td>
      <td>
          <button class="edit-btn" onclick="editRow(this)">Edit</button>
          <button class="delete-btn" onclick="deleteRow(this)">Delete</button>
      </td>
  `;

  document.getElementById("submitButton").innerText = "Submit";
  editingIndex = -1;
}

function cancelEdit(index, button) {
  let book = books[index];

  let row = button.parentElement.parentElement;
  row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.price}</td>
      <td>${book.author.name}</td>
      <td>${book.author.email}</td>
      <td>
          <button class="edit-btn" onclick="editRow(this)">Edit</button>
          <button class="delete-btn" onclick="deleteRow(this)">Delete</button>
      </td>
  `;

  document.getElementById("submitButton").innerText = "Submit";
  editingIndex = -1;
}
