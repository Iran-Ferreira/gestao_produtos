/* Desenvolver um sistema capaz de fazer a gestão de produtos 
roupas/comida/artigos esportivos/beleza
CRUD de produtos (categoria, nome, preço, descrição, imagem)
BaseURL = https://649a1d4a79fbe9bcf8404b5a.mockapi.io/users/{matricula}/products*/

const baseUrl = "https://649a1d4a79fbe9bcf8404b5a.mockapi.io/users/20201214010013/products"

getDados();

async function cadastrar() {
    const inputNome = document.querySelector("#inputNome");
    const inputCategoria = document.querySelector("#inputCategoria");
    const inputPreco = document.querySelector("#inputPreco");
    const inputDescricao = document.querySelector("#inputDescricao");
    const inputImagem = document.querySelector("#inputImagem");
    const pictureImage = document.querySelector("#pictureImage")
    inputImagem.addEventListener("change", function(event){
        const inputTarget = event.target;
        const imagem = inputTarget.files[0];

        if (imagem){
            const reader = new FileReader();

            reader.addEventListener("load", function(event){
                const readerTarget = event.target

                const img = document.createElement("img")
                img.src = readerTarget.result
                img.classList.add("pictureImg")

                pictureImage.innerHTML = " "
                pictureImage.appendChild(img)
            })
            reader.readAsDataURL(imagem).uploadData.secure_url
        }else{  
            pictureImage.innerHTML = "Escolha uma imagem"
        }
    })
    const dados = {
        nome: inputNome.value,
        categoria: inputCategoria.value,
        preco: inputPreco.value,
        descricao: inputDescricao.value,
        imagem: inputImagem.value
    }
    try {
        await fetch(baseUrl, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
    }catch (error) {
        alert("Ocorreu um erro")
        console.log(error)
    }

    //Limpar dados
    inputNome.value = "";
    inputCategoria.value = "";
    inputPreco.value = "";
    inputDescricao.value = "";
    inputImagem.value = "";
    //Fechar janela
    const m = document.querySelector("#exampleModal");
    const modal = bootstrap.Modal.getInstance(m);
    modal.hide();

    exibirDados();
}

async function exibirDados() {
    const tbody = document.querySelector("#dadosProdutos");

    try {
        const response = await fetch(baseUrl)
        const data = await response.json()
        let linhas = "";
        if (data.length === 0){
            linhas = `
            <tr>
                <td colspan="5" style="text-align:center">Não há dados cadastrados</td>
            </tr>
        `;
        } else {
            data.forEach((dado, index) => {
                linhas += `<tr>
                    <td>${index + 1}</td>
                    <td>${dado.nome}</td>
                    <td>${dado.categoria}</td>
                    <td>${dado.preco}</td>
                    <td>${dado.descricao}</td>
                    <td>
                        <img src="${dado.imagem}" alt="Produto" width="400" height="100">
                    </td>
                    <td><i class="bi bi-pencil-square" style="cursor: pointer" onclick="editarDados(${dado.id})"></i></td>
                    <td><i class="bi bi-trash" style="cursor: pointer" onclick="removerDados(${dado.id})"></i></td>
                    </tr>`;
            });
        }
        
        tbody.innerHTML = linhas;
    }catch(error){
        alert("Ocorreu um erro")
        console.log(error)
    }
}

async function getDados() {
    try {
        const response = await fetch(baseUrl);
        const data = await response.json();
        exibirDados(data);
    } catch (error) {
        alert("Ocorreu um erro")
        console.log(error)
    }
}

async function buscarDados() {
    const filtro = document.querySelector("#search");
    try {
        if (filtro.value == "")
            getDados();
        else {
            const response = await fetch(baseUrl + "/?nome=" + filtro.value);
            const data = await response.json();
            exibirDados(data);
    }} 
    catch (error) {
        alert("Ocorreu um erro")
        console.log(error)
    }
}


async function removerDados(index) {
    const modalRemover = new bootstrap.Modal('#modalRemover');
    modalRemover.show();

    const btnRemover = document.querySelector("#remover");
    btnRemover.addEventListener("click", async () => {
        try {
            await fetch(baseUrl + "/" + index, { method: "DELETE" });
            modalRemover.hide();
            exibirDados();
        } catch (error) {
            alert("Ocorreu um erro")
            console.log(error)
        }});
} 

async function editarDados(index) {
    const editNome = document.querySelector("#editNome");
    const editCategoria = document.querySelector("#editCategoria");
    const editPreco = document.querySelector("#editPreco");
    const editDescricao = document.querySelector("#editDescricao")
    const editImagem = document.querySelector("#editImagem")
    try {
        const response = await fetch(baseUrl + "/" + index);
        const data = await response.json();
        editNome.value = data.nome;
        editCategoria.value = data.categoria;
        editPreco.value = data.preco;
        editDescricao.value = data.descricao;
        editImagem.value = data.imagem
    } catch (error) {
        alert("Ocorreu um erro")
        console.log(error)
    }

    const modalEditar = new bootstrap.Modal('#editModal');
    modalEditar.show();
    
    const editar = document.querySelector("#editar");
    editar.addEventListener("click", async () => {
        const dado = {
            nome: editNome.value,
            categoria: editCategoria.value,
            preco: editPreco.value,
            descricao: editDescricao.value,
            imagem: editImagem.value
    };
    try {
        await fetch(baseUrl + "/" + index, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dado)
        });
        
        exibirDados();
        modalEditar.hide();
    } catch (error) {
        alert("Ocorreu um erro")
        console.log(error)
    }
})
}