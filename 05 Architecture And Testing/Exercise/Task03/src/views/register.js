import { register } from '../api/data.js'

export function setupRegister(section, navigation) {
    const form = section.querySelector('form');
    form.addEventListener('submit', onSubmit);

    return showRegister;

    async function showRegister() {
        return section;
    }
    async function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(form);

        const email = formData.get('email');
        const password = formData.get('password');
        const repass = formData.get('repeatPassword');

        if (email == "" || password == '' || repass == '') {
            return alert('All fields are required!')
        } else if (password !== repass) {
            return alert('Passwords don\'t match!')
        }

        await register(email, password);

        form.reset();
        navigation.setUserNav();
        navigation.goTo('home')
    }
}