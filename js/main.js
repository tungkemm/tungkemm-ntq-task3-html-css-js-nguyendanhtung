import { EMPLOYEES } from "./MOCK_DATA.js";

//////// get element
const $ = document.querySelector.bind(document);
const employeeListEl = $(".content-staff");
const logoPageEl = $(".header-logo")
const currentPageEl = $(".header-option-page-info span:nth-child(1)");
const totalPageEl = $(".header-option-page-info span:nth-child(2)");
const prevPageEl = $(".header-option-page-icon.prev");
const nextPageEl = $(".header-option-page-icon.next");
const inputSearchEl = $(".header-option-search input");
const btnDeleteSearchEl = $(".header-option-deleteicon");
const btnSearchEl = $(".header-option-searchicon");
const sortPageIdEl = $(".header-sort-item-id");
const sortPageAZEl = $(".header-sort-item1");
const sortPageZAEl = $(".header-sort-item2");
const btnOpenModalAdd = $(".header-option-add");
const modalAddEl = $(".modal-block");
const modalFormEl = $(".modal-add-staff");
const closeModalAddEl = $(".modal-add-staff-close");
const inputNameAddEl = $(".modal-add-staff-input input");
const selectPositionAddEl = $(".modal-add-staff-select select");
const inputEmailAddEl = $(".modal-add-staff-email input");
const btnAddEl = $(".modal-add-staff-submit button");

///////// khai bao phan trang
const listEmployee = EMPLOYEES;
let currentPage = 1; // page hien tai
const perPage = 40; // so employee trong 1 page
let totalPage = Math.ceil(listEmployee.length / perPage); // tong so page
let perEmployees = listEmployee.slice(
  (currentPage - 1) * perPage,
  (currentPage - 1) * perPage + perPage
); //  listEmployee trong 1 page

///////// khai bao search
let inputValueSearch = "";
let filterListEmployee = [];

const app = {
  render: function () {
    const htmls = perEmployees.map((employee) => {
      // xu ly render avatar
      const isName = typeof employee.name === "boolean";
      const fullName = !isName && employee.name.replace(/[0-9]/g, "");
      const arrFullname = fullName.trim().split(" ");
      const firstName = arrFullname[arrFullname.length - 1].split("")[0];

      return `
        <div class="content-staff-row">
            <div class="content-staff-block">
                <div class="content-staff-img">
                    <p class="content-staff-img-avatar">${firstName}</p>
                    <p class="content-staff-img-detail">
                        <i class="fa-solid fa-comments"></i>
                        <span>15</span>
                        <i class="fa-solid fa-users"></i>
                        <span>3</span>
                    </p>
                </div>
            <div class="content-staff-info">
                <p class="content-staff-name">${employee.name}</p>
                <li class="content-staff-position">${employee.job}</li>
                <div class="content-staff-email">
                    <i class="fa-solid fa-envelope"></i>
                    <p>${employee.email}</p>
                </div>
                <button class="content-staff-btn">Follow</button>
            </div>
        </div>
    </div>
    `;
    });
    // render list
    employeeListEl.innerHTML = htmls.join("");

    // render so trang va tong so trang
    currentPageEl.innerHTML = currentPage;
    totalPageEl.innerHTML = totalPage;
  },

  // ham sort A-Z
  sortListDataAZ: function (listdata) {
    return listdata.sort((a, b) =>
      a.name
        .toLowerCase()
        .split(" ")
        [a.name.split(" ").length - 1].localeCompare(
          b.name.toLowerCase().split(" ")[b.name.split(" ").length - 1]
        )
    );
  },

  // ham sort Z-A
  sortListDataZA: function (listdata) {
    return this.sortListDataAZ(listdata).reverse();
  },

  // ham sort id
  sortListDataId: function (listdata) {
    return listdata.sort((a, b) => a.id - b.id);
  },

  // update perEmployees
  updatePerEmployees: function (listdata) {
    return listdata.slice(
      (currentPage - 1) * perPage,
      (currentPage - 1) * perPage + perPage
    );
  },

  // ham update currentPage, perEmployees when next
  updatePageWhenNext: function (listdata) {
    currentPage = currentPage + 1;
    perEmployees = this.updatePerEmployees(listdata);
  },

  // ham update currentPage, perEmployees when prev
  updatePageWhenPrev: function (listdata) {
    currentPage = currentPage - 1;
    perEmployees = this.updatePerEmployees(listdata);
  },

  // ham update currentPage, perEmployees, totalPage when search or sort or add
  updatePageWhenSearchOrSortOrAdd: function (listdata) {
    currentPage = 1;
    perEmployees = this.updatePerEmployees(listdata);
    totalPage = Math.ceil(listdata.length / perPage);
  },

  // ham get input email tu value input name
  inputEmailWhenAdd: function (input) {
    // ham convert loai bo dau trong 1 chuoi
    const convertName = (name) => {
      name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      name = name.replace(/Đ/g, "D");
      name = name.replace(/đ/g, "d");
      return name;
    };

    // input name -> input email
    let inputEmail;
    let inputEmailNew;
    const arrEmailNameAdd = convertName(input.slice()).toLowerCase().split(" ");
    if (arrEmailNameAdd.length === 1) {
      inputEmail = arrEmailNameAdd.join("");
      inputEmailNew = `${inputEmail}@ntq-solution.com.vn`;
    } else {
      const firstEmailName = arrEmailNameAdd[0];
      const lastEmailName = arrEmailNameAdd[arrEmailNameAdd.length - 1];
      const arrNewEmail = [];
      arrNewEmail.push(firstEmailName);
      arrNewEmail.push(lastEmailName);
      inputEmail = arrNewEmail.reverse().join(".");
      inputEmailNew = `${inputEmail}@ntq-solution.com.vn`;
    }

    // filter ra arr gom nhung email trung voi email input
    const filterCoincidentEmail = listEmployee.filter((employee) => {
      const isEmail = typeof employee.email === "boolean";
      const g = !isEmail && employee.email.replace(/[0-9]/g, "");
      return g === inputEmailNew;
    });

    // update lai email input
    inputEmail = filterCoincidentEmail.length
      ? `${inputEmail}${filterCoincidentEmail.length}@ntq-solution.com.vn`
      : inputEmailNew;

    return inputEmail;
  },

  handleEvents: function () {
    //////// xu ly khi next page
    nextPageEl.onclick = function () {
      if (inputValueSearch) {
        if (currentPage < totalPage) {
          app.updatePageWhenNext(filterListEmployee);
          app.render();
        } else {
          alert("Khong the next them");
        }
      } else {
        if (currentPage < totalPage) {
          app.updatePageWhenNext(listEmployee);
          app.render();
        } else {
          alert("Khong the next them");
        }
      }
    };

    /////// xu ly khi prev page
    prevPageEl.onclick = function () {
      if (inputValueSearch) {
        if (currentPage > 1) {
          app.updatePageWhenPrev(filterListEmployee);
          app.render();
        } else {
          alert("Khong the prev them");
        }
      } else {
        if (currentPage > 1) {
          app.updatePageWhenPrev(listEmployee);
          app.render();
        } else {
          alert("Khong the prev them");
        }
      }
    };

    /////// xu ly khi search
    btnSearchEl.onclick = function () {
      inputValueSearch = inputSearchEl.value.trim().toLowerCase();
      if (inputValueSearch) {
        filterListEmployee = listEmployee.filter((employee) => {
          return (
            employee.name.toLowerCase().includes(inputValueSearch) ||
            (employee.email &&
              employee.email.toLowerCase().includes(inputValueSearch)) ||
            employee.job.toLowerCase().includes(inputValueSearch)
          );
        });
        if (filterListEmployee.length === 0) {
          alert("Khong tim thay thong tin nhan vien nao !!!");
        } else {
          app.updatePageWhenSearchOrSortOrAdd(filterListEmployee);
          app.render();
        }
      } else {
        alert("Chua nhap gi trong input search")
      }
    };

    ////// xu ly khi delete text search
    btnDeleteSearchEl.onclick = function () {
      inputValueSearch = "";
      inputSearchEl.value = "";
      app.updatePageWhenSearchOrSortOrAdd(listEmployee);
      app.render();
    };

    logoPageEl.onclick = function () {
      inputValueSearch = "";
      app.updatePageWhenSearchOrSortOrAdd(listEmployee);
      app.render();
    };

    /////// xu ly khi sort A-Z
    sortPageAZEl.onclick = function () {
      if (inputValueSearch) {
        app.sortListDataAZ(filterListEmployee);
        app.updatePageWhenSearchOrSortOrAdd(filterListEmployee);
      } else {
        app.sortListDataAZ(listEmployee);
        app.updatePageWhenSearchOrSortOrAdd(listEmployee);
      }
      app.render();
    };

    /////// xu ly khi sort Z-A
    sortPageZAEl.onclick = function () {
      if (inputValueSearch) {
        app.sortListDataZA(filterListEmployee);
        app.updatePageWhenSearchOrSortOrAdd(filterListEmployee);
      } else {
        app.sortListDataZA(listEmployee);
        app.updatePageWhenSearchOrSortOrAdd(listEmployee);
      }
      app.render();
    };

    /////// xu ly khi sort Id
    sortPageIdEl.onclick = function () {
      if (inputValueSearch) {
        app.sortListDataId(filterListEmployee);
        app.updatePageWhenSearchOrSortOrAdd(filterListEmployee);
      } else {
        app.sortListDataId(listEmployee);
        app.updatePageWhenSearchOrSortOrAdd(listEmployee);
      }
      app.render();
    };

    /////// xu ly khi active modal add
    btnOpenModalAdd.onclick = function () {
      modalAddEl.classList.remove("hide");
      modalAddEl.classList.add("active");
    };

    ///// xu ly khi hide modal add bang icon
    closeModalAddEl.onclick = function (e) {
      e.stopImmediatePropagation();
      modalAddEl.classList.remove("active");
      modalAddEl.classList.add("hide");
    };

    ///// xu ly hide modal add khi click vao background
    modalAddEl.onclick = function () {
      modalAddEl.classList.remove("active");
      modalAddEl.classList.add("hide");
    };

    ///// xu ly ngan noi bot khi click vao background modal
    modalFormEl.onclick = (e) => {
      e.stopPropagation();
    };

    ///// xu ly khi blur input name
    inputNameAddEl.onblur = function () {
      const inputNameAdd = inputNameAddEl.value.trim();
      if (inputNameAdd) {
        const inputEmail = app.inputEmailWhenAdd(inputNameAdd);
        inputEmailAddEl.value = inputEmail;
      }
    };

    ///// xu ly khi add nhan vien
    btnAddEl.onclick = function () {
      const inputNameAdd = inputNameAddEl.value.trim();
      const selectPositionAdd = selectPositionAddEl.value.trim();
      if (inputNameAdd && selectPositionAdd) {
        // select id nhan vien cuoi cung
        const arrId = [];
        listEmployee.forEach((employee) => arrId.push(employee.id));
        const id = arrId.sort()[arrId.sort().length - 1];

        // input email
        const inputEmail = app.inputEmailWhenAdd(inputNameAdd);

        // add nhan vien
        listEmployee.unshift({
          id: id + 1,
          name: inputNameAdd,
          email: inputEmail,
          job: selectPositionAdd,
        });

        inputNameAddEl.value = "";
        selectPositionAddEl.value = "Team Leader";
        inputEmailAddEl.value = "";
        inputValueSearch = ""
        inputSearchEl.value = ""
        modalAddEl.classList.remove("active");
        modalAddEl.classList.add("hide");

        app.updatePageWhenSearchOrSortOrAdd(listEmployee);
        app.render();
      } else {
        alert("Chua nhap day du thong tin");
      }
    };
  },

  start: function () {
    // Xu ly su kien
    this.handleEvents();

    // Render employee list
    this.render();
  },
};

app.start();
