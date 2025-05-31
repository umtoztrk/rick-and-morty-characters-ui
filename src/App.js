import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./index.css";

function App() {
  const [characters, setCharacters] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [statusFilters, setStatusFilters] = useState([]);
  const [genderFilters, setGenderFilters] = useState([]);
  const [speciesFilters, setSpeciesFilters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const allCharacters = [];
        let nextPage = "https://rickandmortyapi.com/api/character";

        while (nextPage && allCharacters.length < 250) {
          const res = await fetch(nextPage);
          const data = await res.json();
          allCharacters.push(...data.results);
          nextPage = data.info.next;
        }

        setCharacters(allCharacters.slice(0, 250));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  useEffect(() => {
    if (selected) {
      const details = document.getElementById("character-details");
      if (details) details.scrollIntoView({ behavior: "smooth" });
    }
  }, [selected]);

  const handlePageChange = (direction) => {
    setCurrentPage((prev) =>
      direction === "next"
        ? Math.min(totalPages, prev + 1)
        : Math.max(1, prev - 1)
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading)
    return <div className="text-white text-center p-4">Yükleniyor...</div>;

  let filteredData = characters.filter((char) =>
    char.name.toLowerCase().includes(searchName.toLowerCase())
  );

  if (statusFilters.length > 0) {
    filteredData = filteredData.filter((char) =>
      statusFilters.includes(char.status)
    );
  }

  if (genderFilters.length > 0) {
    filteredData = filteredData.filter((char) =>
      genderFilters.includes(char.gender)
    );
  }

  if (speciesFilters.length > 0) {
    filteredData = filteredData.filter((char) =>
      speciesFilters.includes(char.species)
    );
  }

  filteredData.sort((a, b) => {
    let valA = a[sortKey]?.toString().toLowerCase() || "";
    let valB = b[sortKey]?.toString().toLowerCase() || "";
    return sortOrder === "asc"
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const uniqueSpecies = [...new Set(characters.map((char) => char.species))];

  return (
    <div
      className="min-h-screen text-white px-6 py-8 font-futura bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://comicbook.com/wp-content/uploads/sites/4/2025/04/Rick-and-Morty-Seaosn-8-Adult-Swim-Promo.jpg')",
        backgroundColor: "rgba(0,0,0,0.8)",
        backgroundBlendMode: "darken",
        backgroundAttachment: "fixed",
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-lime-400 text-4xl font-bold mb-6 text-center drop-shadow-lg"
      >
        Rick and Morty Karakterleri
      </motion.h1>

      <div className="flex flex-wrap gap-4 mb-4 justify-center">
        <input
          type="text"
          placeholder="İsme göre filtrele"
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            setCurrentPage(1);
          }}
          className="h-10 px-3 py-2 bg-gray-800 text-white rounded shadow"
        />

        {/* Durum filtresi */}
        <div className="flex flex-col text-sm text-white">
          <span className="font-bold mb-1">Durum:</span>
          {["Alive", "Dead", "unknown"].map((status) => (
            <label key={status} className="flex items-center gap-1 mb-1">
              <input
                type="checkbox"
                value={status}
                checked={statusFilters.includes(status)}
                onChange={(e) => {
                  const value = e.target.value;
                  setStatusFilters((prev) =>
                    prev.includes(value)
                      ? prev.filter((s) => s !== value)
                      : [...prev, value]
                  );
                  setCurrentPage(1);
                }}
              />
              {status}
            </label>
          ))}
        </div>

        {/* Cinsiyet filtresi */}
        <div className="flex flex-col text-sm text-white">
          <span className="font-bold mb-1">Cinsiyet:</span>
          {["Male", "Female", "Genderless", "unknown"].map((gender) => (
            <label key={gender} className="flex items-center gap-1 mb-1">
              <input
                type="checkbox"
                value={gender}
                checked={genderFilters.includes(gender)}
                onChange={(e) => {
                  const value = e.target.value;
                  setGenderFilters((prev) =>
                    prev.includes(value)
                      ? prev.filter((g) => g !== value)
                      : [...prev, value]
                  );
                  setCurrentPage(1);
                }}
              />
              {gender}
            </label>
          ))}
        </div>

        {/* Tür filtresi */}
        <div className="flex flex-col text-sm text-white max-w-xs">
          <span className="font-bold mb-1">Tür:</span>
          <div className="flex flex-wrap gap-1">
            {uniqueSpecies.map((specie) => (
              <label key={specie} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  value={specie}
                  checked={speciesFilters.includes(specie)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSpeciesFilters((prev) =>
                      prev.includes(value)
                        ? prev.filter((s) => s !== value)
                        : [...prev, value]
                    );
                    setCurrentPage(1);
                  }}
                />
                {specie}
              </label>
            ))}
          </div>
        </div>

        {/* Sıralama seçimi */}
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="h-10 px-3 bg-gray-800 text-white text-sm rounded shadow"
        >
          <option value="name">İsim</option>
          <option value="status">Durum</option>
          <option value="gender">Cinsiyet</option>
        </select>

        {/* Sıralama yönü */}
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          title="Sıralama yönünü değiştir"
          className="h-10 px-4 text-sm bg-lime-500 text-black rounded shadow hover:bg-lime-400 transition-all"
        >
          {sortOrder === "asc" ? "🔼 A-Z" : "🔽 Z-A"}
        </button>

        {/* Sayfa boyutu */}
        <div className="flex items-center gap-2 h-10">
          <span className="text-sm font-medium text-white">Sayfa Boyutu:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="h-10 px-3 bg-gray-800 text-white text-sm rounded shadow outline-none"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

      </div>

      {/* Tablo */}
      {visibleData.length === 0 ? (
        <p className="text-center mt-4">Hiçbir karakter bulunamadı.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-center bg-black bg-opacity-60 backdrop-blur-sm rounded-lg">
            <thead className="bg-gray-900 text-lime-400">
              <tr>
                <th className="py-2">İsim</th>
                <th>Durum</th>
                <th>Cinsiyet</th>
                <th>Tür</th>
              </tr>
            </thead>
            <tbody>
              {visibleData.map((char) => (
                <motion.tr
                  key={char.id}
                  onClick={() => setSelected(char)}
                  className="cursor-pointer hover:bg-gray-700"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="py-2">{char.name}</td>
                  <td>{char.status}</td>
                  <td>{char.gender}</td>
                  <td>{char.species}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sayfalama */}
      <div className="mt-6 flex flex-wrap justify-center items-center gap-4">
        <motion.button
          onClick={() => handlePageChange("prev")}
          disabled={currentPage === 1}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="h-10 px-4 text-sm bg-lime-500 text-black rounded font-semibold shadow hover:bg-lime-400 disabled:opacity-50"
        >
          ⬅️ Önceki
        </motion.button>

        <span className="text-sm">Sayfa {currentPage} / {totalPages}</span>

        <motion.button
          onClick={() => handlePageChange("next")}
          disabled={currentPage === totalPages}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="h-10 px-4 text-sm bg-lime-500 text-black rounded font-semibold shadow hover:bg-lime-400 disabled:opacity-50"
        >
          Sonraki ➡️
        </motion.button>
      </div>

      {/* Karakter detayları */}
      {selected && (
        <motion.div
          id="character-details"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-10 mx-auto max-w-md text-center bg-gray-900 bg-opacity-70 p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-4 text-lime-400">
            Seçilen Karakter
          </h2>
          <p><strong>İsim:</strong> {selected.name}</p>
          <p><strong>Durum:</strong> {selected.status}</p>
          <p><strong>Tür:</strong> {selected.species}</p>
          <p><strong>Cinsiyet:</strong> {selected.gender}</p>
          <img
            src={selected.image}
            alt={selected.name}
            className="mt-4 rounded w-52 mx-auto"
          />

          <button
            onClick={() => setSelected(null)}
            className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
          >
            Kapat ✖️
          </button>
        </motion.div>
      )}

    </div>
  );
}

export default App;
