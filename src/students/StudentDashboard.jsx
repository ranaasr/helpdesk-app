/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { useCookies } from "react-cookie";
import {
  Container,
  Form,
  InputGroup,
  Button,
  Spinner,
  Modal,
} from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import "./styles/StudentDashboard.css";
import StudentNavbar from "../components/StudentNavbar.jsx";
import { ambilSemuaFaktaPermasalahan } from "../database/faktaPermasalahanService.js";
import { ambilSemuaKesimpulan } from "../database/kesimpulanService.js";
import { ambilSemuaSolusi } from "../database/solusiService.js";
import { tambahNotification } from "../database/notificationService.js";
import { ambilSemuaRules } from "../database/rulesService.js";
import { tambahHistory } from "../database/historyService.js";

// HelpSection Component
const HelpSection = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className="help-section">
      <Container className="text-center">
        <h1>Selamat datang di Helpdesk UIN Ar-Raniry.</h1>
        <InputGroup className="search-bar w-75 mx-auto">
          <InputGroup.Text className="search-icon-container">
            <Search className="search-icon" />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Temukan permasalahan Anda di sini..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <Button
              variant="primary"
              className="clear-search-button button-ask"
              onClick={handleClearSearch}
            >
              X
            </Button>
          )}
        </InputGroup>
      </Container>
    </div>
  );
};

const SubmitIssueForm = ({ show, handleClose }) => {
  const [issueDescription, setIssueDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cookies] = useCookies(["user"]);
  const formRef = React.createRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formRef.current.checkValidity() === false) {
      e.stopPropagation();
      formRef.current.classList.add("was-validated");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log(cookies.user);
      await tambahNotification(
        issueDescription,
        cookies.user ? cookies.user.uid : null
      );

      setIssueDescription("");
      handleClose();
    } catch (error) {
      console.error("Error submitting issue: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Kirim permasalahanmu yang baru</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form ref={formRef} noValidate onSubmit={handleSubmit}>
          <Form.Group controlId="issueDescription">
            <Form.Label>Deskripsi Permasalahan</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Harap isi bidang ini.
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Tutup
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Mengirim..." : "Kirim"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const IssuesSection = ({ searchTerm }) => {
  const [cookies] = useCookies(["user"]);
  const [facts, setFacts] = useState([]);
  const [filteredFacts, setFilteredFacts] = useState([]);
  const [selectedFacts, setSelectedFacts] = useState([]);
  const [solutionData, setSolutionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unmatchedFacts, setUnmatchedFacts] = useState([]);
  const [partialSolutions, setPartialSolutions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [notFoundSolution, setNotFoundSolution] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Tambahkan fungsi ini dalam komponen IssuesSection
  const highlightFact = (factId) => {
    const factElement = document.getElementById(factId);
    if (factElement) {
      factElement.classList.add("highlight");
      setTimeout(() => {
        factElement.classList.remove("highlight");
      }, 1000);
    }
  };

  useEffect(() => {
    const fetchFacts = async () => {
      const factsData = [];
      await new Promise((resolve) => {
        ambilSemuaFaktaPermasalahan((faktaData) => {
          faktaData.forEach((doc) => {
            factsData.push(doc);
          });
          resolve();
        });
      });

      setFacts(factsData);
      setFilteredFacts(factsData);
      console.log(factsData);
    };
    fetchFacts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = facts.filter((fact) =>
        fact.nama_fakta.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFacts(filtered);
    } else {
      setFilteredFacts(facts);
    }
  }, [searchTerm, facts]);

  const handleCheckboxChange = (id) => {
    setSelectedFacts((prev) =>
      prev.includes(id) ? prev.filter((factId) => factId !== id) : [...prev, id]
    );
  };

  const handleCardClick = (id) => {
    handleCheckboxChange(id);
  };

  // Fungsi Sistem Pakar
  const handleFindSolution = async () => {
    setIsLoading(true);
    tambahHistory({fakta:selectedFacts}, cookies.user ? cookies.user.uid : null);
    // Buat Array tampung data dari tabel rules
    const rulesData = [];
    // Ambil data dari tabel rules dan masukkan ke rulesData
    await new Promise((resolve) => {
      ambilSemuaRules((rules) => {
        rules.forEach((doc) => {
          rulesData.push(doc);
        });
        resolve();
      });
    });
    console.log(rulesData);

    // buat array untuk tampung solusi
    const solutionsFound = [];
    const matchedFactIds = new Set();

    // looping semua rulesData
    for (let rule of rulesData) {
      const { id_fakta, id_kesimpulan, id_solusi } = rule;

      // cek apakah semua id fakta pada sebuah rule termasuk dalam fakta yang dipilih
      if (id_fakta.every((fact) => selectedFacts.includes(fact))) {
        const daftarFakta = [];

        // masukkan seluruh fakta pada array matchedFactIds dan nama fakta pada array daftarFakta
        await ambilSemuaFaktaPermasalahan((faktaData) => {
          id_fakta.forEach((fakta) => {
            faktaData.forEach((doc) => {
              if (doc.id === fakta) {
                daftarFakta.push(doc.nama_fakta);
                matchedFactIds.add(fakta);
              }
            });
          });
        });

        // ambil nama kesimpulan dan simpan pada variabel conclusionText
        let conclusionText = "";
        await ambilSemuaKesimpulan((kesimpulanData) => {
          console.log(kesimpulanData);
          kesimpulanData.forEach((satuKesimpulan) => {
            if (satuKesimpulan.id === id_kesimpulan) {
              conclusionText = satuKesimpulan.nama_kesimpulan;
            }
          });
        });

        // ambil nama solusi dan simpan pada variabel solutionText
        let solutionText = "";
        await new Promise((resolve) => {
          ambilSemuaSolusi((solusiData) => {
            solusiData.forEach((satuSolusi) => {
              if (satuSolusi.id === id_solusi) {
                solutionText = satuSolusi.nama_solusi;
              }
            });
            resolve();
          });
        });

        // tambahkan fakta, kesimpulan, dan solusi pada array solutionsFound
        solutionsFound.push({
          facts: daftarFakta,
          conclusion: conclusionText,
          solution: solutionText,
        });
      }
    }

    // cari fakta yang belum menemukan fix kesimpulan dan solusi, disimpan pada array unmatchedFactsList
    const unmatchedFactsList = selectedFacts.filter(
      (factId) => !matchedFactIds.has(factId)
    );

    // buat array partialSolutionsFound untuk simpan kemungkinan solusi
    const partialSolutionsFound = [];

    // looping semua rulesData
    for (let rule of rulesData) {
      const { id_fakta, id_kesimpulan, id_solusi } = rule;

      // cek apakah id_faktanya terdapat pada unmatchedFactsList
      const intersectingFacts = id_fakta.filter((fact) =>
        unmatchedFactsList.includes(fact)
      );
      console.log(intersectingFacts);

      // jika id_faktanya terdapat pada unmatchedFactsList
      if (intersectingFacts.length > 0) {
        const daftarFaktaUnmatched = [];
        const daftarFaktaMatched = [];

        // ambil fakta lainnya yang berada dalam rule yang sama
        ambilSemuaFaktaPermasalahan((rules) => {
          id_fakta.forEach((fakta) => {
            rules.forEach((doc) => {
              if (doc.id === fakta) {
                if (unmatchedFactsList.includes(fakta)) {
                  daftarFaktaUnmatched.push(doc.nama_fakta);
                } else {
                  daftarFaktaMatched.push({
                    nama: doc.nama_fakta,
                    id: doc.id,
                  });
                }
              }
            });
          });
        });

        // ambil kemungkinan kesimpulannya dan simpan pada conclusionText
        let conclusionText = "";
        await ambilSemuaKesimpulan((kesimpulanData) => {
          kesimpulanData.forEach((satuKesimpulan) => {
            if (satuKesimpulan.id === id_kesimpulan) {
              conclusionText = satuKesimpulan.nama_kesimpulan;
            }
          });
        });

        // ambil kemungkinan solusinya dan simpan pada solutionText
        let solutionText = "";
        await new Promise((resolve) => {
          ambilSemuaSolusi((solusiData) => {
            solusiData.forEach((satuSolusi) => {
              if (satuSolusi.id === id_solusi) {
                solutionText = satuSolusi.nama_solusi;
              }
            });
            resolve();
          });
        });

        // tambahkan fakta, kemungkinan kesimpulan, dan kemungkinan solusi pada array partialSolutionsFound
        partialSolutionsFound.push({
          factsMatched: daftarFaktaMatched,
          factsUnmatched: daftarFaktaUnmatched,
          conclusion: conclusionText,
          solution: solutionText,
        });
      }
    }

    setSolutionData(solutionsFound);
    setUnmatchedFacts(unmatchedFactsList);
    setPartialSolutions(partialSolutionsFound);
    setIsLoading(false);
    solutionsFound.length == 0 && partialSolutionsFound.length == 0
      ? setNotFoundSolution(true)
      : setNotFoundSolution(false);
  };

  return (
    <div className="issues-section">
      <div className="facts-list mt-5">
        <h4>Atau pilih permasalahan Anda di bawah</h4>
        {filteredFacts.length > 0 ? (
          filteredFacts.map((fact) => (
            <div
              key={fact.id}
              id={fact.id}
              className={`fact-item ${
                selectedFacts.includes(fact.id) ? "selected" : ""
              }`}
              onClick={() => handleCardClick(fact.id)}
            >
              <div className="fact-text">{fact.nama_fakta}</div>
              <Form.Check
                type="checkbox"
                checked={selectedFacts.includes(fact.id)}
                onChange={() => handleCheckboxChange(fact.id)}
                className="fact-checkbox"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          ))
        ) : (
          <div className="no-facts-message">
            <p>Tidak ada fakta yang sesuai dengan kriteria pencarian.</p>
          </div>
        )}
        <Button
          variant="primary"
          className={`find-solution-button ${
            selectedFacts.length < 1 ? "disabled" : ""
          }`}
          onClick={handleFindSolution}
        >
          {isLoading ? (
            <Spinner animation="border" size="sm" />
          ) : selectedFacts < 1 ? (
            <div>
              <FontAwesomeIcon icon={faLock} /> Temukan Solusi
            </div>
          ) : (
            "Temukan Solusi"
          )}
        </Button>
        {/* kode untuk menampilkan hasil/completion */}
        {(solutionData.length > 0 || partialSolutions.length > 0) && (
          <div className="solution-section mt-5">
            {solutionData.map((solution, index) => (
              <div key={index} className="solution-item">
                <h3>Penyelesaian {index + 1}</h3>
                <hr />
                <div>
                  <h4>Fakta Permasalahan:</h4>
                  <ul>
                    {solution.facts.map((fact, idx) => (
                      <li key={idx}>{fact}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Kesimpulan:</h4>
                  <p>{solution.conclusion}</p>
                </div>
                <div>
                  <h4>Solusi:</h4>
                  <p>{solution.solution}</p>
                </div>
              </div>
            ))}

            {partialSolutions.map((solution, index) => (
              <div key={index} className="solution-item">
                <h3>Penyelesaian {index + solutionData.length + 1}</h3>
                <hr />
                <div>
                  <h4>Fakta Permasalahan:</h4>
                  <ul>
                    {solution.factsUnmatched.map((fact, idx) => (
                      <li key={idx}>{fact}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Kemungkinan Kesimpulan:</h4>
                  <p>{solution.conclusion}</p>
                </div>
                <div>
                  <h4>Kemungkinan Solusi:</h4>
                  <p>{solution.solution}</p>
                </div>
                <div>
                  <h4>
                    Berikut adalah fakta-fakta masalah yang perlu diperiksa
                    untuk memastikan kesimpulan dan solusi yang tepat:
                  </h4>
                  <ul>
                    {solution.factsMatched.map((fact, idx) => (
                      <li key={idx}>
                        <a
                          href={`#${fact.id}`}
                          onClick={() => highlightFact(fact.id)}
                        >
                          {fact.nama}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            {}
          </div>
        )}
        {notFoundSolution == true && (
          <div className="no-facts-message">
            <p>Tidak ada solusi yang ditemukan sesuai dengan kriteria fakta.</p>
          </div>
        )}
        <Button
          variant="link"
          className="new-problem-button"
          onClick={handleShowModal}
        >
          Tidak menemukan masalah Anda? Ajukan masalah baru.
        </Button>
        <SubmitIssueForm show={showModal} handleClose={handleCloseModal} />
      </div>
    </div>
  );
};

// StudentDashboard Component
const StudentDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="main">
      <StudentNavbar activeLink="Dashboard" />
      <HelpSection onSearch={handleSearch} />
      <IssuesSection searchTerm={searchTerm} />
    </div>
  );
};

export default StudentDashboard;
