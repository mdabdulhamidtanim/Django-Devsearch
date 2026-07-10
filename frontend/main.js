let loginBtn = document.getElementById('login-btn')
let logoutBtn = document.getElementById('logout-btn')

let token = localStorage.getItem('token')

if (token) {
    loginBtn.remove()
} else {
    logoutBtn.remove()
}

let getProjects = () => {
    let projectsUrl = 'http://127.0.0.1:8000/api/projects/'

    fetch(projectsUrl)
        .then((response) => response.json())
        .then((data) => {
            buildProjects(data)
        })
}

let buildProjects = (projects) => {

    let projectsWrapper = document.getElementById('projects--wrapper')

    projectsWrapper.innerHTML = ''

    for (let i = 0; i < projects.length; i++) {

        let project = projects[i]

        let projectCard = `
        <div class="project--card">

            <img src="http://127.0.0.1:8000${project.featured_image}">

            <div>

                <div class="card--header">
                    <h3>${project.title}</h3>

                    <strong
                        class="vote--option"
                        data-vote="up"
                        data-project="${project.id}"
                    >
                        &#43;
                    </strong>

                    <strong
                        class="vote--option"
                        data-vote="down"
                        data-project="${project.id}"
                    >
                        &#8722;
                    </strong>
                </div>

                <i>${project.vote_ratio}% Positive Feedback</i>

                <p>
                    ${project.description.substring(0, 150)}
                </p>

            </div>

        </div>
        `

        projectsWrapper.innerHTML += projectCard
    }

    addVoteEvents()
}

let addVoteEvents = () => {

    let voteButtons = document.getElementsByClassName('vote--option')

    for (let i = 0; i < voteButtons.length; i++) {

        voteButtons[i].addEventListener('click', (e) => {

            let vote = e.target.dataset.vote
            let project = e.target.dataset.project

            let token = localStorage.getItem('token')

            if (!token) {
                alert('Please login first!')
                window.location = 'login.html'
                return
            }

            fetch(`http://127.0.0.1:8000/api/projects/${project}/vote/`, {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },

                body: JSON.stringify({
                    value: vote
                })
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    getProjects()
                })
        })
    }
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {

        e.preventDefault()

        localStorage.removeItem('token')

        window.location = 'login.html'
    })
}

getProjects()