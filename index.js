//test1-1
(function () {
  // new variable
  const INDEX_URL = 'https://lighthouse-user-api.herokuapp.com/api/v1/users/'
  const data = []

  const dataPanel = document.getElementById('data-panel')

  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  let paginationData = []

  const genderButton = document.getElementById('genderButton')
  let nowData = []
  let nowThisPage = 1


  axios.get(INDEX_URL)
    .then((res) => {
      data.push(...res.data.results)
      /* console.log(data) */
      /* displayDataList(data) */
      getTotalPages(data)
      getPageData(1, data)
      nowData = data
    }).catch((err) => console.log(err))


  // test
  // test2
  // test3
  // test4
  // test5
  // test6
  

  genderButton.addEventListener('click',(event) => {
    if (event.target.matches('.genderButtonMan')){
      let men = []
      men = data.filter(man=>man.gender==='male')
      nowData = men
    } else if (event.target.matches('.genderButtonWomam')){
      let women = []
      women = data.filter(woman => woman.gender === 'female')
      nowData = women      
    }
    getTotalPages(nowData)
    getPageData(1, nowData)
  })

  // listen to data panel
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-user')) {
      console.log(event.target.dataset.id)
      showUser(event.target.dataset.id)
    } else if (event.target.matches('.favorite-heart')) {
      // heartButton light or dark
      heartButton = event.target
      showHeart(heartButton)
      addFavoriteItem(event.target.dataset.id)
    }
  })


  
  searchForm.addEventListener('submit', event => {
    event.preventDefault()
    let results = []
    const regex = new RegExp(searchInput.value, 'i')
    results = data.filter(person => person.name.match(regex))
    console.log(results)
    // displayDataList(results)
    getTotalPages(results)
    getPageData(1, results)
    nowData = results
    /* 搜尋字串後要重新設立目前頁數 */
    nowThisPage = 1
  })

  
  // listen to pagination click event
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    nowThisPage = event.target.dataset.page
    if (event.target.tagName === 'A') {
      getPageData(nowThisPage)
    }
  })


  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  function getPageData(pageNum = 1, data) {
    /* console.log('getPageData=' + data)
    console.log(data) */
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }



  

  
  function showHeart(data) {
    if (data.matches('.btn-outline-danger')){
      heartButton.classList.remove('btn-outline-danger')
      heartButton.classList.add('btn-danger')
    } /* else if (data.matches('.btn-danger')){
      heartButton.classList.remove('btn-danger')
      heartButton.classList.add('btn-outline-danger')
    } */
  }


  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoritePerson')) || []
    const person = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${person.name} is already in your favorite list.`)
    } else {
      list.push(person)
      alert(`Added ${person.name} to your favorite list!`)
    }
    localStorage.setItem('favoritePerson', JSON.stringify(list))
  }



  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(function (item) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2 shadow bg-white rounded">
            <img class="card-img-top " src="${item.avatar}" alt="Card image cap">
            <div class="card-body user-item-body">
              <h6 class="card-title">${item.name}</h6>
              <h6 class="card-title">${item.email}</h6>
            </div>

            <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-user" data-toggle="modal" data-target="#show-user-modal" data-id="${item.id}">More</button>
              <div id="heart">
                <i class="far fa-heart fa-2x btn btn-outline-danger favorite-heart" data-id="${item.id}" ></i>
              </div>
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  function showUser(id) {
    // get elements
    const modalTitle = document.getElementById('show-user-title')
    const modalImage = document.getElementById('show-user-image')
    const modalBirthday = document.getElementById('show-user-date')
    const modalAge = document.getElementById('show-user-age')
    const modalGender = document.getElementById('show-user-gender')
    const modalEmail = document.getElementById('show-user-email')
    const modalRegion = document.getElementById('show-user-region')

    // set request url
    const url = INDEX_URL + id
    console.log(url)

    // send request to show api
    axios.get(url).then(res => {
      const data = res.data
      console.log(data)

      // insert data into modal ui
      modalTitle.textContent = `${data.name} ${data.surname}`
      modalImage.innerHTML = `<img src="${data.avatar}" class="img-fluid rounded" alt="Responsive image">`
      modalBirthday.textContent = `birthday : ${data.birthday}`
      modalAge.textContent = `age : ${data.age}`
      modalGender.textContent = `gender : ${data.gender}`
      modalEmail.textContent = `Email : ${data.email}`
      modalRegion.textContent = `region : ${data.region}`
    }).catch((err) => console.log(err))
  }


})()
