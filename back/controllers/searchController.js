const { response, request } = require("express");
const SearchConnection = require("../database/SearchConnection");

const conx = new SearchConnection();

const searchAll = async (req = request, res = response) => {
    const { query } = req.query; 

    try {
        const songs = await conx.searchSongsByTitle(query);
        const playlists = await conx.searchPlaylistsByName(query);
        const artists = await conx.searchArtistsByName(query);
        const albums = await conx.searchAlbumsByTitle(query);

        res.json({
            songs,
            playlists,
            artists,
            albums
        });
    } catch (error) {
        console.error("Error en la búsqueda:", error); 
        res.status(500).json({ message: "Error al realizar la búsqueda" });
    }
};

module.exports = { searchAll};