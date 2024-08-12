 const usuariosCtn = document.getElementById('usuarios');
        const form = document.getElementById('form');
        const main = document.getElementById('main');
        const btnCrear = document.getElementById('btn-crear');
        const btnUsuarios = document.getElementById('btn-usuarios');
        const btnOk = document.getElementById('btn-ok');
        const btnCancelar = document.getElementById('btn-cancelar');
        const fieldNombre = document.getElementById('field-nombre');
        const fieldEmail = document.getElementById('field-email');
        const fieldTelefono = document.getElementById('field-telefono');
        const loader = document.getElementById('loader');


        //////////////////////////////////aqui se modifico
        function mostrarOcultar() {
            btnCrear.classList.remove('show');
            main.classList.remove('show');
            form.classList.remove('show');
                
            if (location.hash === '#usuarios') {
                btnCrear.classList.add('show');
                main.classList.add('show');

                pedirUsuarios();
            } else {
                fieldNombre.value = '';
                fieldEmail.value = '';
                fieldTelefono.value = '';
                btnOk.textContent = 'Crear';
                form.classList.add('show');

                if (location.hash !== '#crear') {
                    btnOk.textContent = 'Modificar';
                    pedirUsuario();
                } 
            }
        }

        function handleClickCrear() {
            location.hash = 'crear';
        }

        function handleClickUsuarios() {
            if (location.hash === '#usuarios') {
                pedirUsuarios();
            }

            location.hash = 'usuarios';
        }

        function handleClickOk() {
            const metodo = location.hash === '#crear' ? 'post' : 'put';
            let url = '/users';
            if (location.hash !== '#crear') {
                const split = location.hash.split('/');
                url += `/${split[1]}`;
            }

            request(
                metodo,
                url,
                () => {
                    location.hash = 'usuarios';
                },
                handleError,
                {
                    name: fieldNombre.value,
                    email: fieldEmail.value,
                    phone: fieldTelefono.value
                }
            );
        }

        function handleClickCancel() {
            location.hash = 'usuarios';
        }

        function init() {
            window.addEventListener('hashchange', mostrarOcultar);
            btnCrear.addEventListener('click', handleClickCrear);
            btnUsuarios.addEventListener('click', handleClickUsuarios);
            btnOk.addEventListener('click', handleClickOk);
            btnCancelar.addEventListener('click', handleClickCancel);

            if (location.hash === '') {
                location.hash = 'usuarios';
            } else {
                mostrarOcultar();
            }
        }

        function handleError() {
            alert('Hubo un error');
        }

        function request(metodo, url, handleOk, handleError, body) {
            loader.classList.add('show');

            const baseUrl = 'https://jsonplaceholder.typicode.com';

            const xhr = new XMLHttpRequest();

            xhr.open(metodo, `${baseUrl}${url}`);

            xhr.setRequestHeader('content-type', 'application/json');

            xhr.responseType = 'json';

            xhr.addEventListener('error', () => {
                loader.classList.remove('show');
                handleError()
            });

            xhr.addEventListener('load', () => {
                loader.classList.remove('show');
                if (xhr.status >= 200 && xhr.status <= 299) {
                    handleOk(xhr.response);
                } else {
                    handleError();
                }
            })

            xhr.send(JSON.stringify(body));
        }

        function mostrarUsuarios(usuarios) {
            usuariosCtn.innerHTML = '';
            usuarios.forEach(u => mostrarUsuario(u));
        }

        function mostrarUsuario(usuario) {
            const article = document.createElement('article');
            article.className = 'usuario';

            article.innerHTML = `
                <h2>${usuario.name}</h2>
                <ul>
                    <li>
                        Email: <strong>${usuario.email}</strong>
                    </li>
                    <li>
                        Telefono: <strong>${usuario.phone}</strong>
                    </li>
                </ul>
            `;

            const div = document.createElement('div');

            const btnModificar = document.createElement('button');
            btnModificar.className = 'boton ok';
            btnModificar.textContent = 'Modificar';

            btnModificar.addEventListener('click', e => {
                location.hash = `modificar/${usuario.id}`;
            });

            const btnEliminar = document.createElement('button');
            btnEliminar.className = 'boton cancel';
            btnEliminar.textContent = 'Eliminar';

            btnEliminar.addEventListener('click', e => {
                const eliminar = confirm(`Esta seguro de eliminar el usuario ${usuario.name}`);

                if (eliminar) {
                    request('delete', `/users/${usuario.id}`, () => {
                        article.remove();
                    }, handleError);
                }
            });

            div.append(btnModificar, btnEliminar);
            article.append(div);

            usuariosCtn.append(article);
        }

        function pedirUsuarios() {
            request('get', '/users', mostrarUsuarios, handleError);
        }

        function cargarFormulario(usuario) {
            fieldNombre.value = usuario.name;
            fieldEmail.value = usuario.email;
            fieldTelefono.value = usuario.phone;
        }

        function pedirUsuario() {
            const split = location.hash.split('/');
            request('get',  `/users/${split[1]}`, cargarFormulario, handleError);
        }

        init();