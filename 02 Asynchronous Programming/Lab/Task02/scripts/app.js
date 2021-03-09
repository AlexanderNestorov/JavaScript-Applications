function loadRepos() {
	const username  = document.getElementById('username').value;

	let url = `https://api.github.com/users/${username}/repos`;

	fetch(url)
	.then(response => response.json())
	.then(data => {
		const ulElement = document.getElementById('repos');
		ulElement.innerHTML = '';
		data.forEach(r => {
			const liElement = document.createElement('li');
			liElement.textContent = r.full_name;
			ulElement.appendChild(liElement);
		});
	});

	document.getElementById('username').value = '';

}