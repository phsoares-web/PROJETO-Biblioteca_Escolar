// Alternar empréstimo / devolução
async function alterarStatus(id) {
  try {
    const response = await fetch(`/api/livros/${id}/toggle-status`, {
      method: 'PATCH'
    });

    if (response.ok) {
      window.location.reload();
    } else {
      alert('Erro ao alterar status do livro.');
    }
  } catch (err) {
    console.error(err);
  }
}

// Filtro/Busca dinâmica
document.getElementById('btnBuscar')?.addEventListener('click', async () => {
  const busca = document.getElementById('campoBusca').value;
  const res = await fetch(`/api/livros?busca=${encodeURIComponent(busca)}`);
  const livros = await res.json();
  
  const lista = document.getElementById('listaAcervo');
  lista.innerHTML = '';

  livros.forEach(livro => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span><strong>${livro.titulo}</strong></span>
      <span class="status ${livro.status}">${livro.status}</span>
      <button onclick="alterarStatus(${livro.id})">
        ${livro.status === 'disponivel' ? 'Emprestar' : 'Devolver'}
      </button>
    `;
    lista.appendChild(li);
  });
});