const APIURL = 'https://api.github.com/users/'

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')

async function getUser(username) {
  try {
    const { data } = await axios(APIURL + username)

    createUserCard(data)
    await getRepos(username)
  } catch (err) {
    if (err.response.status === 404) {
      createErrorCard('No profile with this username')
    }
  }
}

async function getRepos(username) {
  try {
    const { data } = await axios(APIURL + username + '/repos?sort=created')

    addReposToCard(data)
  } catch (err) {
    createErrorCard('Problem fetching repos')
  }
}

function createUserCard({
  name,
  login,
  bio,
  avatar_url,
  followers,
  following,
  public_repos,
}) {
  const userID = name || login
  const userBio = bio ? `<p>${bio}</p>` : ''
  main.innerHTML = `
    <div class="card">
    <div>
      <img src="${avatar_url}" alt="${name}" class="avatar">
    </div>
    <div class="user-info">
      <h2>${userID}</h2>
      ${userBio}
      <ul>
        <li><span>${followers} </span> <strong>Followers</strong></li>
        <li><span>${following} </span> <strong>Following</strong></li>
        <li><span>${public_repos} </span> <strong>Repos</strong></li>
      </ul>
      <div id="repos"></div>
    </div>
  </div>
    `
}

function createErrorCard(msg) {
  main.innerHTML = `
        <div class="card">
            <h1>${msg}</h1>
        </div>
    `
}

function addReposToCard(repos) {
  const reposEl = document.getElementById('repos')

  repos.slice(0, 5).forEach(({ html_url, name }) => {
    const repoEl = document.createElement('a')
    repoEl.classList.add('repo')
    repoEl.href = html_url
    repoEl.target = '_blank'
    repoEl.innerText = name

    reposEl.appendChild(repoEl)
  })
}

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const user = search.value

  if (user) {
    getUser(user)

    search.value = ''
  }
})
