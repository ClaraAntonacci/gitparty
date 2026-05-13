const url = "http://localhost:3000";



const cards = document.getElementById("cards");

if(cards){
    carregarEventos();
}

async function carregarEventos(){

    cards.innerHTML = "";

    const response = await fetch(
        `${url}/eventos/listar`
    );

    const eventos = await response.json();

    eventos.forEach(evento => {

        const ultimaImagem =
        evento.imagens[evento.imagens.length - 1];

        const imagem = ultimaImagem
        ? `${url}/${ultimaImagem.path}`
        : "https://placehold.co/600x400";

        cards.innerHTML += `
        <div class="card">

            <img src="${imagem}">

            <div class="card-content">

                <span class="status">
                    ${evento.status}
                </span>

                <h3>${evento.titulo}</h3>

                <p>
                     ${evento.local}
                </p>

                <p>
                    
                    ${new Date(
                        evento.data_evento
                    ).toLocaleDateString("pt-BR")}
                </p>

                <a href="detalhes.html?id=${evento.id}">
                    Ver Evento
                </a>

            </div>

        </div>
        `;
    });
}



const detalhesContainer =
document.getElementById("detalhes-container");

if(detalhesContainer){
    buscarEvento();
}

async function buscarEvento(){

    const params =
    new URLSearchParams(window.location.search);

    const id = params.get("id");

    const response = await fetch(
        `${url}/eventos/buscar/${id}`
    );

    const evento = await response.json();

    const ultimaImagem =
    evento.imagens[evento.imagens.length - 1];

    const imagem = ultimaImagem
    ? `${url}/${ultimaImagem.path}`
    : "https://placehold.co/1200x600";

    detalhesContainer.innerHTML = `

    <div class="banner-container">

        <img
        src="${imagem}"
        class="banner"
        >

        <button
        onclick="excluirEvento(${evento.id})"
        class="delete-btn"
        >
            🗑️
        </button>

    </div>

    <div class="detalhes-content">

        <div class="info-evento">

            <h2>${evento.titulo}</h2>

            <p>${evento.descricao}</p>

            <div class="infos-grid">

                <div class="info-card">

                    <h4>Data</h4>

                    <p>
                        ${new Date(
                            evento.data_evento
                        ).toLocaleDateString("pt-BR")}
                    </p>

                </div>

                <div class="info-card">

                    <h4>Local</h4>

                    <p>${evento.local}</p>

                </div>

                <div class="info-card">

                    <h4>Capacidade</h4>

                    <p>${evento.capacidade_maxima}</p>

                </div>

            </div>

        </div>

        <div class="side-panel">

            <a href="editar.html?id=${evento.id}">
                Atualizar Evento
            </a>

        </div>

    </div>
    `;
}

async function excluirEvento(id){

    const confirmar = confirm(
        "Deseja excluir este evento?"
    );

    if(!confirmar) return;

    const response = await fetch(
        `${url}/eventos/excluir/${id}`,
        {
            method: "DELETE"
        }
    );

    const data = await response.json();

    if(data.erro){
        alert(data.erro);
        return;
    }

    alert("Evento excluído");

    window.location.href = "index.html";
}



const formEvento =
document.getElementById("form-evento");

if(formEvento){

    formEvento.addEventListener(
        "submit",
        async (e) => {

        e.preventDefault();

        const formData =
        new FormData(formEvento);

        const evento = {

            titulo: formData.get("titulo"),

            descricao: formData.get("descricao"),

            data_evento: formData.get("data_evento"),

            local: formData.get("local"),

            capacidade_maxima: Number(
                formData.get("capacidade_maxima")
            ),

            status: formData.get("status")
        };

        const response = await fetch(
            `${url}/eventos/cadastrar`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify(evento)
            }
        );

        const novoEvento =
        await response.json();

        const imagem =
        document.getElementById("imagem").files[0];

        if(imagem){

            const imagemForm =
            new FormData();

            imagemForm.append(
                "imagem",
                imagem
            );

            imagemForm.append(
                "nome",
                evento.titulo
            );

            await fetch(
                `${url}/imagens-eventos/cadastrar/${novoEvento.id}`,
                {
                    method: "POST",
                    body: imagemForm
                }
            );
        }

        alert("Evento criado com sucesso");

        window.location.href = "index.html";
    });
}



const editarForm =
document.getElementById("editar-form");

if(editarForm){
    carregarEventoEditar();
}

async function carregarEventoEditar(){

    const params =
    new URLSearchParams(window.location.search);

    const id = params.get("id");

    const btnVoltar =
    document.getElementById("btn-voltar");

    if(btnVoltar){
        btnVoltar.href =
        `detalhes.html?id=${id}`;
    }

    const response = await fetch(
        `${url}/eventos/buscar/${id}`
    );

    const evento = await response.json();

    const ultimaImagem =
    evento.imagens[evento.imagens.length - 1];

    const imagem = ultimaImagem
    ? `${url}/${ultimaImagem.path}`
    : "https://placehold.co/1200x600";

    editarForm.innerHTML = `

    <h2>Editar Evento</h2>

    <img
    src="${imagem}"
    class="edit-banner"
    >

    <input
    type="text"
    name="titulo"
    value="${evento.titulo}"
    >

    <textarea
    name="descricao"
    >${evento.descricao}</textarea>

    <input
    type="datetime-local"
    name="data_evento"
    value="${evento.data_evento.slice(0,16)}"
    >

    <input
    type="text"
    name="local"
    value="${evento.local}"
    >

    <input
    type="number"
    name="capacidade_maxima"
    value="${evento.capacidade_maxima}"
    >

    <select name="status" id="status">

        <option value="ATIVO">
            ATIVO
        </option>

        <option value="ENCERRADO">
            ENCERRADO
        </option>

        <option value="CANCELADO">
            CANCELADO
        </option>

    </select>

    <p class="texto-imagem">
        Escolha uma nova imagem para atualizar o evento
    </p>

    <input
    type="file"
    id="imagem"
    accept="image/jpeg"
    required
    >

    <div class="historico">

        <h3>Imagens anteriores</h3>

        <div class="historico-imagens">

            ${evento.imagens.map(img => `
                <img src="${url}/${img.path}">
            `).join("")}

        </div>

    </div>

    <button>
        Salvar Alterações
    </button>
    `;

    document.getElementById("status").value =
    evento.status;

    editarForm.addEventListener(
        "submit",
        async (e) => {

        e.preventDefault();

        const dados =
        new FormData(editarForm);

        const imagem =
        document.getElementById("imagem").files[0];

        dados.append("imagem", imagem);

        await fetch(
            `${url}/eventos/atualizar/${id}`,
            {
                method: "PUT",
                body: dados
            }
        );

        alert("Evento atualizado");

        window.location.href =
        `detalhes.html?id=${id}`;
    });
}