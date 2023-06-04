document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    let searchTerm = document.getElementById('searchBar').value;

    window.location.href = `/search?term=${searchTerm}`;
});